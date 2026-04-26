import type { Tier } from './tier';

/**
 * Mirror of `users` table.
 * Auth is owned by Clerk; we mirror minimal profile here.
 * Field names match Postgres (snake_case) — adapt at the data layer if needed.
 */
export interface User {
  id: string;
  display_name: string | null;
  goal_hours_per_day: number | null;
  tier_preference: Tier;
  /** 'HH:mm:ss' */
  confession_time: string;
  /** IANA timezone, e.g. 'America/Chicago' */
  timezone: string;
  notifications_enabled: boolean;
  reckoning_unlocked: boolean;
  paid_tier: boolean;
  paid_tier_renews_at: string | null;
  /** Hidden score gating Rogue Mode (V1.5). */
  affinity_score: number;
  created_at: string;
  updated_at: string;
}
