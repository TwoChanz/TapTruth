/**
 * TruthTap color palette.
 *
 * Per the Character Bible: deep ink background, warm white glyph,
 * amber for gentle accents, deep red for Reckoning-tier warnings only.
 * No gradients. No blur. Flat, sacred, deliberate.
 */

export const colors = {
  // Backgrounds (near-black, the void TAP records from)
  ink: '#0B0B12',
  inkRaised: '#15151E',
  inkLine: '#22222E',

  // Foregrounds (warm white — the bone of the glyph)
  bone: '#F5EFE7',
  boneSoft: '#A09A92',
  boneFaint: '#5C5953',

  // Accents (used sparingly)
  amber: '#D4A84B',
  reckoning: '#8B2E2E',

  // Mood states (confession dots, day cells)
  moodGreat: '#7DA87A',
  moodMid: '#D4A84B',
  moodRough: '#A65C45',
} as const;

/**
 * Tier-aware glyph color. The glyph dims at Clinical and warms toward
 * Reckoning. Only the glyph follows this scale — text uses `bone`.
 */
export const tierGlow = {
  1: '#5C5953', // Clinical — dim
  2: '#8C857B', // Observed — soft
  3: '#F5EFE7', // Foreseen — full warm white (canonical)
  4: '#E6C66B', // Prophetic — warmer, more presence
  5: '#C84A2E', // Reckoning — ember-red intensity
} as const;

export type ColorToken = keyof typeof colors;
export type TierGlowKey = keyof typeof tierGlow;
