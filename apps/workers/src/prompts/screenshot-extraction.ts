import { z } from 'zod';

/**
 * Vision prompt for extracting structured data from an iOS Screen Time screenshot.
 * Source: docs/04_TECHNICAL_ARCHITECTURE.md §4.
 *
 * The model is instructed to return ONLY JSON. The Worker validates the result
 * against `ScreenshotExtractionResultSchema` below — anything that fails
 * validation is treated as a vision failure.
 */
export const SCREENSHOT_EXTRACTION_PROMPT = `You are extracting data from an iOS Screen Time screenshot. Return ONLY valid JSON matching this schema. Do not include commentary, do not wrap in code fences.

{
  "period_start": "YYYY-MM-DD",
  "period_end": "YYYY-MM-DD",
  "total_seconds": number,
  "total_pickups": number | null,
  "total_notifications": number | null,
  "daily_breakdown": [
    { "date": "YYYY-MM-DD", "total_seconds": number }
  ],
  "top_apps": [
    { "name": "string", "category": "string | null", "total_seconds": number }
  ],
  "confidence": "high" | "medium" | "low"
}

If the image is not an iOS Screen Time screenshot or is unreadable, return:
{ "error": "not_screen_time" | "unreadable", "confidence": "low" }`;

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

export const ScreenshotExtractionSuccessSchema = z.object({
  period_start: dateString,
  period_end: dateString,
  total_seconds: z.number().int().nonnegative(),
  total_pickups: z.number().int().nonnegative().nullable(),
  total_notifications: z.number().int().nonnegative().nullable(),
  daily_breakdown: z.array(
    z.object({
      date: dateString,
      total_seconds: z.number().int().nonnegative(),
    }),
  ),
  top_apps: z.array(
    z.object({
      name: z.string(),
      category: z.string().nullable(),
      total_seconds: z.number().int().nonnegative(),
    }),
  ),
  confidence: z.enum(['high', 'medium', 'low']),
});

export const ScreenshotExtractionFailureSchema = z.object({
  error: z.enum(['not_screen_time', 'unreadable']),
  confidence: z.literal('low'),
});

export const ScreenshotExtractionResultSchema = z.union([
  ScreenshotExtractionSuccessSchema,
  ScreenshotExtractionFailureSchema,
]);

export type ScreenshotExtractionResult = z.infer<typeof ScreenshotExtractionResultSchema>;
