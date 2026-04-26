import { duration } from '@truthtap/theme';
import type { Tier } from '@truthtap/types';

/**
 * Tier → idle pulse duration. Higher tiers pulse faster, signalling
 * TAP is "more present". Tier 1 (Clinical) is paused upstream and
 * never reaches this function in practice.
 */
export function glyphPulseDurationForTier(tier: Tier): number {
  if (tier <= 3) return duration.pulseSlow;
  return duration.pulseFast;
}
