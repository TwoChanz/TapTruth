export const MOODS = ['great', 'mid', 'rough'] as const;
export type Mood = (typeof MOODS)[number];

/** Mirror of `confessions` table. One row per user per day. */
export interface Confession {
  id: string;
  user_id: string;
  /** 'YYYY-MM-DD' */
  date: string;
  mood: Mood;
  most_time_stolen_by: string | null;
  /** Reference to the dialogue_templates row TAP served back. */
  tap_response_line_id: string | null;
  created_at: string;
}
