/** Frozen data captured at the moment a scroll is shared. */
export interface SharedScrollSnapshot {
  total_seconds: number;
  daily_avg_seconds: number;
  worst_day: { date: string; total_seconds: number };
  best_day: { date: string; total_seconds: number };
  top_apps: Array<{ name: string; total_seconds: number }>;
  total_pickups: number | null;
  total_notifications: number | null;
}

/** Mirror of `shared_scrolls` table. */
export interface SharedScroll {
  id: string;
  user_id: string;
  /** 'YYYY-MM-DD' */
  period_start: string;
  /** 'YYYY-MM-DD' */
  period_end: string;
  snapshot: SharedScrollSnapshot;
  /** URL slug used at truthtap.app/scroll/{slug}. */
  share_slug: string;
  view_count: number;
  created_at: string;
}
