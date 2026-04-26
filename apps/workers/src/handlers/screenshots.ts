import Anthropic from '@anthropic-ai/sdk';
import type { ProcessScreenshotResponse } from '@truthtap/types';
import { Hono } from 'hono';
import { z } from 'zod';

import { VISION_MODEL, createAnthropic } from '../lib/anthropic';
import type { Env } from '../lib/env';
import { HttpError } from '../lib/errors';
import { SCREENSHOT_BUCKET, createSupabaseAdmin } from '../lib/supabase';
import {
  SCREENSHOT_EXTRACTION_PROMPT,
  ScreenshotExtractionResultSchema,
  type ScreenshotExtractionResult,
} from '../prompts/screenshot-extraction';

const ProcessRequestSchema = z.object({
  screenshot_id: z.string().uuid(),
  user_id: z.string(),
  storage_path: z.string().min(1),
});

export const screenshotsApp = new Hono<{ Bindings: Env }>();

/**
 * POST /screenshots/process
 *
 * Triggered by a Supabase Storage webhook (or manual retry from the mobile app)
 * once a user uploads an iOS Screen Time screenshot. Downloads the image,
 * runs it through Claude Vision, validates the structured response, and
 * writes the extracted usage data into screenshots / daily_usage / app_usage.
 *
 * The screenshot row's upload_status field is the client's source of truth —
 * it transitions pending → processing → (complete | failed). On any error,
 * the row is marked failed so the client doesn't see it stuck in 'processing'.
 */
screenshotsApp.post('/process', async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = ProcessRequestSchema.safeParse(body);
  if (!parsed.success) {
    throw new HttpError(
      400,
      'invalid_request',
      'Body did not match expected shape',
      parsed.error.flatten(),
    );
  }
  const { screenshot_id, user_id, storage_path } = parsed.data;
  const sb = createSupabaseAdmin(c.env);

  // 1. Mark as processing for client status polling.
  await sb
    .from('screenshots')
    .update({ upload_status: 'processing' })
    .eq('id', screenshot_id);

  try {
    // 2. Download image bytes from Supabase Storage.
    const { data: file, error: downloadErr } = await sb.storage
      .from(SCREENSHOT_BUCKET)
      .download(storage_path);
    if (downloadErr || !file) {
      throw new HttpError(
        500,
        'download_failed',
        downloadErr?.message ?? 'Could not fetch image from storage',
      );
    }
    const arrayBuf = await file.arrayBuffer();
    const base64 = arrayBufferToBase64(arrayBuf);

    // 3. Run through Claude Vision.
    const anthropic = createAnthropic(c.env);
    let completion;
    try {
      completion = await anthropic.messages.create({
        model: VISION_MODEL,
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: 'image/png', data: base64 },
              },
              { type: 'text', text: SCREENSHOT_EXTRACTION_PROMPT },
            ],
          },
        ],
      });
    } catch (apiErr) {
      // Map common SDK errors to clearer HTTP statuses for the client.
      if (apiErr instanceof Anthropic.RateLimitError) {
        throw new HttpError(429, 'rate_limited', 'Vision API rate limited; retry later');
      }
      if (apiErr instanceof Anthropic.APIError) {
        throw new HttpError(502, 'vision_upstream', `Vision API error: ${apiErr.message}`);
      }
      throw apiErr;
    }

    // 4. Pull text content; defensively strip any code fences the model added.
    const textBlock = completion.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new HttpError(500, 'extraction_failed', 'Model returned no text content');
    }
    const jsonText = stripCodeFence(textBlock.text);

    // 5. Validate against the schema. Both success and failure shapes are accepted.
    let extraction: ScreenshotExtractionResult;
    try {
      const parsedJson = JSON.parse(jsonText);
      const result = ScreenshotExtractionResultSchema.safeParse(parsedJson);
      if (!result.success) {
        throw new HttpError(
          500,
          'invalid_extraction',
          'Vision response did not match schema',
          result.error.flatten(),
        );
      }
      extraction = result.data;
    } catch (jsonErr) {
      if (jsonErr instanceof HttpError) throw jsonErr;
      throw new HttpError(
        500,
        'invalid_extraction',
        'Vision response was not valid JSON',
        { rawText: jsonText.slice(0, 500) },
      );
    }

    // 6a. Failure case — model says it isn't a Screen Time screenshot.
    if ('error' in extraction) {
      await sb
        .from('screenshots')
        .update({
          upload_status: 'failed',
          raw_extraction: extraction,
          error_message: extraction.error,
          processed_at: new Date().toISOString(),
        })
        .eq('id', screenshot_id);
      const response: ProcessScreenshotResponse = {
        status: 'failed',
        screenshot_id,
        error: extraction.error,
      };
      return c.json(response);
    }

    // 6b. Success case — write extraction to screenshots, daily_usage, app_usage.
    await sb
      .from('screenshots')
      .update({
        upload_status: 'complete',
        period_start: extraction.period_start,
        period_end: extraction.period_end,
        total_seconds: extraction.total_seconds,
        total_pickups: extraction.total_pickups,
        total_notifications: extraction.total_notifications,
        raw_extraction: extraction,
        processed_at: new Date().toISOString(),
      })
      .eq('id', screenshot_id);

    if (extraction.daily_breakdown.length > 0) {
      // Last write wins when a new screenshot covers a previously-recorded day.
      const dailyRows = extraction.daily_breakdown.map((d) => ({
        user_id,
        date: d.date,
        total_seconds: d.total_seconds,
        source_screenshot_id: screenshot_id,
      }));
      await sb.from('daily_usage').upsert(dailyRows, { onConflict: 'user_id,date' });
    }

    if (extraction.top_apps.length > 0) {
      const appRows = extraction.top_apps.map((a) => ({
        user_id,
        screenshot_id,
        app_name: a.name,
        category: a.category,
        total_seconds: a.total_seconds,
        period_start: extraction.period_start,
        period_end: extraction.period_end,
      }));
      await sb.from('app_usage').insert(appRows);
    }

    const response: ProcessScreenshotResponse = {
      status: 'complete',
      screenshot_id,
    };
    return c.json(response);
  } catch (err) {
    // Mark the screenshot failed so the client doesn't see it stuck in 'processing'.
    const message = err instanceof Error ? err.message : 'Unknown error';
    await sb
      .from('screenshots')
      .update({
        upload_status: 'failed',
        error_message: message,
        processed_at: new Date().toISOString(),
      })
      .eq('id', screenshot_id);
    throw err;
  }
});

/**
 * Convert an ArrayBuffer to base64 in 32KB chunks. The naive
 * `String.fromCharCode(...new Uint8Array(buf))` blows the call stack on
 * large images (Workers' max args limit is ~64K).
 */
function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}

/**
 * Defensive: the model is instructed not to wrap JSON in code fences, but
 * vision models occasionally do anyway. Strip common ``` / ```json wrappers.
 */
function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith('```')) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();
  }
  return trimmed;
}
