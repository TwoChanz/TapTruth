/**
 * Motion tokens.
 *
 * TAP does not bounce. Easing curves are contemplative, slightly
 * symmetric, never overshoot. Glyph pulse is the signature animation —
 * slow at low tiers, faster at high tiers.
 */

/** Durations in milliseconds. */
export const duration = {
  pulseSlow: 2400,
  pulseFast: 1400,
  fast: 160,
  base: 240,
  slow: 480,
  reveal: 1200,
} as const;

/** Cubic-bezier control points. Tuples are `readonly` to keep them immutable. */
export const easing = {
  prophecy: [0.45, 0.0, 0.55, 1.0] as const,
  voice: [0.4, 0.0, 0.2, 1.0] as const,
} as const;

export type DurationToken = keyof typeof duration;
export type EasingToken = keyof typeof easing;
