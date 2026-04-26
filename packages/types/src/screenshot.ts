/** Lifecycle states for an uploaded screenshot. */
export const SCREENSHOT_STATUSES = ['pending', 'processing', 'complete', 'failed'] as const;
export type ScreenshotStatus = (typeof SCREENSHOT_STATUSES)[number];

/** Confidence levels returned by the vision model. */
export const EXTRACTION_CONFIDENCES = ['high', 'medium', 'low'] as const;
export type ExtractionConfidence = (typeof EXTRACTION_CONFIDENCES)[number];

/** Per-day datum extracted from a Screen Time screenshot. */
export interface ScreenshotDailyDatum {
  /** 'YYYY-MM-DD' */
  date: string;
  total_seconds: number;
}

/** Per-app datum extracted from a Screen Time screenshot. */
export interface ScreenshotAppDatum {
  name: string;
  category: string | null;
  total_seconds: number;
}

/** Successful structured response from the vision model. */
export interface ScreenshotExtraction {
  period_start: string;
  period_end: string;
  total_seconds: number;
  total_pickups: number | null;
  total_notifications: number | null;
  daily_breakdown: ScreenshotDailyDatum[];
  top_apps: ScreenshotAppDatum[];
  confidence: ExtractionConfidence;
}

/** Failure response from the vision model. */
export interface ScreenshotExtractionFailure {
  error: 'not_screen_time' | 'unreadable';
  confidence: 'low';
}

export type ScreenshotExtractionResult = ScreenshotExtraction | ScreenshotExtractionFailure;

/** Mirror of `screenshots` table. */
export interface Screenshot {
  id: string;
  user_id: string;
  storage_path: string;
  upload_status: ScreenshotStatus;
  period_start: string | null;
  period_end: string | null;
  total_seconds: number | null;
  total_pickups: number | null;
  total_notifications: number | null;
  raw_extraction: ScreenshotExtractionResult | null;
  error_message: string | null;
  uploaded_at: string;
  processed_at: string | null;
  /** Soft delete; user may opt to retain originals. */
  deleted_at: string | null;
}
