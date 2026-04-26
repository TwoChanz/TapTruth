/** Conditions that unlock a Vision (lore fragment). */
export type VisionUnlockCondition =
  | { type: 'vigil_milestone'; days: number }
  | { type: 'calibration_count'; count: number }
  | { type: 'confession_count'; count: number }
  | { type: 'first_screenshot' }
  | { type: 'manual' };

/** Mirror of `visions` table. */
export interface Vision {
  id: string;
  /** Stable identifier, e.g. 'before_the_glass'. Used in admin tools and analytics. */
  slug: string;
  title: string;
  /** Prophecy-voice text, 2–4 sentences. */
  body: string;
  unlock_condition: VisionUnlockCondition;
  order_index: number | null;
  is_paid_only: boolean;
  created_at: string;
}

/** Mirror of `user_visions` table. Records which Visions a user has unlocked. */
export interface UserVision {
  id: string;
  user_id: string;
  vision_id: string;
  unlocked_at: string;
}
