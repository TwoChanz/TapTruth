import type { DialogueContext, DialogueSurface } from './dialogue';
import type { Tier } from './tier';

/**
 * Transport shapes for the Cloudflare Worker endpoints.
 * These are NOT DB rows — they're what crosses the wire between client and worker.
 */

/** POST /dialogue/serve */
export interface ServeDialogueRequest {
  user_id: string;
  surface: DialogueSurface;
  tier: Tier;
  context: DialogueContext;
}

export interface ServeDialogueResponse {
  template_id: string;
  surface: DialogueSurface;
  tier: Tier;
  /** Body with placeholders resolved. */
  rendered: string;
  served_at: string;
}

/**
 * POST /screenshots/process
 * Triggered by Supabase Storage webhook OR manual retry.
 */
export interface ProcessScreenshotRequest {
  screenshot_id: string;
  user_id: string;
  storage_path: string;
}

export type ProcessScreenshotResponse =
  | { status: 'complete'; screenshot_id: string }
  | { status: 'failed'; screenshot_id: string; error: string };

/** Standard error envelope for all worker endpoints. */
export interface ApiError {
  error: string;
  message: string;
  details?: unknown;
}
