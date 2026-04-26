/** Mirror of `daily_usage` table. One row per user per day. */
export interface DailyUsage {
  id: string;
  user_id: string;
  /** 'YYYY-MM-DD' */
  date: string;
  total_seconds: number;
  source_screenshot_id: string | null;
  created_at: string;
}

/** Mirror of `app_usage` table. One row per app per screenshot period. */
export interface AppUsage {
  id: string;
  user_id: string;
  screenshot_id: string;
  app_name: string;
  category: string | null;
  total_seconds: number;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
}
