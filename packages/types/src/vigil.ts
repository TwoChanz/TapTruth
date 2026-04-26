export const VIGIL_TYPES = ['under_goal', 'daily_confession'] as const;
export type VigilType = (typeof VIGIL_TYPES)[number];

/** Streak milestones that unlock Visions and trigger TAP commentary. */
export const VIGIL_MILESTONES = [3, 7, 14, 30, 60, 100] as const;
export type VigilMilestone = (typeof VIGIL_MILESTONES)[number];

/** Mirror of `vigils` table. */
export interface Vigil {
  id: string;
  user_id: string;
  vigil_type: VigilType;
  /** 'YYYY-MM-DD' */
  started_on: string;
  /** Null while vigil is active. */
  ended_on: string | null;
  /** Computed when vigil closes. */
  length_days: number | null;
  /** Subset of VIGIL_MILESTONES that have fired during this vigil. */
  milestones_hit: number[];
  is_current: boolean;
  created_at: string;
}
