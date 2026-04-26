import type { Tier } from './tier';

/**
 * The named places TAP can speak.
 *
 * Adding a surface = adding a string here. The strict union catches typos
 * at the callsite. New surfaces are routine — extend freely.
 */
export const DIALOGUE_SURFACES = [
  // Onboarding
  'onboarding_awaken',
  'onboarding_name',
  'onboarding_goal',
  'onboarding_tier_select',
  'onboarding_first_confession',

  // Daily app-open
  'app_open_morning',
  'app_open_afternoon',
  'app_open_evening',
  'app_open_late_night',

  // Confession responses
  'confession_great',
  'confession_mid',
  'confession_rough',
  'confession_mismatch_better',
  'confession_mismatch_worse',

  // Vigil events
  'vigil_continued',
  'vigil_broken',
  'vigil_milestone_3',
  'vigil_milestone_7',
  'vigil_milestone_14',
  'vigil_milestone_30',
  'vigil_milestone_60',
  'vigil_milestone_100',

  // Weekly reveal
  'weekly_reveal_under_goal',
  'weekly_reveal_at_goal',
  'weekly_reveal_over_goal',
  'weekly_worst_app',
  'weekly_best_day',
  'weekly_worst_day',

  // Data states
  'state_no_data',
  'state_low_data',
  'state_high_spike',
  'state_quiet_day',
  'state_app_spike',
  'state_late_night',

  // Errors
  'error_screenshot_failed',
  'error_screenshot_unreadable',
  'error_connection',
  'error_account',

  // Gamification
  'vision_unlocked',
  'calibration_complete',
  'tier_upgrade_offer',
  'tier_downgrade_ack',
  'rogue_mode_teaser',
] as const;

export type DialogueSurface = (typeof DIALOGUE_SURFACES)[number];

/**
 * Conditions filter candidate templates server-side.
 * All conditions present must match for a template to be eligible.
 */
export interface DialogueConditions {
  min_streak?: number;
  max_streak?: number;
  worst_app?: string;
  min_total_seconds?: number;
  max_total_seconds?: number;
  /** 0 = Sunday */
  day_of_week?: number;
  /** [startHour, endHour) in 24-hour local time */
  hour_range?: [number, number];
}

/**
 * Render context — keys substituted into {{placeholders}} in template body.
 * Open-ended string index allows future keys without a types release.
 */
export interface DialogueContext {
  name?: string;
  worst_app?: string;
  best_app?: string;
  streak_days?: number;
  total_hours?: number;
  daily_avg_hours?: number;
  worst_day?: string;
  best_day?: string;
  pickup_count?: number;
  notification_count?: number;
  app_count?: number;
  hour?: number;
  date?: string;
  [key: string]: unknown;
}

/** Mirror of `dialogue_templates` table. */
export interface DialogueTemplate {
  id: string;
  surface: DialogueSurface;
  tier: Tier;
  /** May contain {{placeholders}} resolved against DialogueContext. */
  body: string;
  conditions: DialogueConditions | null;
  /** Topical line lifecycle. */
  active_from: string | null;
  active_until: string | null;
  is_active: boolean;
  impressions: number;
  last_served_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Mirror of `dialogue_served` table — log of which line went to which user. */
export interface DialogueServed {
  id: string;
  user_id: string;
  template_id: string;
  surface: DialogueSurface;
  served_at: string;
}
