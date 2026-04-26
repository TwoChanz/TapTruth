/** Bonding mini-actions the user performs to deepen affinity with TAP. */
export const CALIBRATION_ACTIONS = [
  'seal_the_ledger',
  'speak_the_truth',
  'acknowledge_the_prophecy',
] as const;
export type CalibrationAction = (typeof CALIBRATION_ACTIONS)[number];

/** Mirror of `calibrations` table. */
export interface Calibration {
  id: string;
  user_id: string;
  action: CalibrationAction;
  performed_at: string;
  /** Optional metadata (e.g. which scroll was sealed). */
  context: Record<string, unknown> | null;
}
