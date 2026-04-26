/** TAP's five personality tiers. Tier 1 (Clinical) is the personality-off baseline. */
export const TIERS = [1, 2, 3, 4, 5] as const;
export type Tier = (typeof TIERS)[number];

export const TIER_NAMES = {
  1: 'Clinical',
  2: 'Observed',
  3: 'Foreseen',
  4: 'Prophetic',
  5: 'Reckoning',
} as const satisfies Record<Tier, string>;

export type TierName = (typeof TIER_NAMES)[Tier];

/** Default tier set during onboarding. */
export const DEFAULT_TIER: Tier = 3;

/** Tier 5 is gated — must be unlocked after 3 confessions + explicit confirmation. */
export const RECKONING_TIER: Tier = 5;
