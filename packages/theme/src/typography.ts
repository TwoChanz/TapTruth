/**
 * Typography tokens.
 *
 * Three semantic families:
 *   - prophecy: serif display — TAP's voice, headers, ledger reveals
 *   - ledger:   tabular monospaced — numbers, data, the ledger itself
 *   - voice:    neo-grotesque sans — body copy, UI chrome
 *
 * Platform layers (mobile/web) map these to actual loaded fonts.
 * Mobile uses expo-font; web uses next/font. Both target the same
 * canonical families: Canela (prophecy), IBM Plex Mono (ledger), Inter (voice).
 */

export const fontFamily = {
  prophecy: 'Canela',
  ledger: 'IBMPlexMono',
  voice: 'Inter',
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
} as const;

/**
 * All sizes in px. Numbers use tabular-nums feature when rendered;
 * platform layer applies that via fontVariant (RN) or font-feature-settings (web).
 */
export const fontSize = {
  glyph: 48,
  prophecyDisplay: 32,
  prophecy: 24,
  ledger: 20,
  body: 16,
  caption: 13,
  micro: 11,
} as const;

export const lineHeight = {
  prophecyDisplay: 40,
  prophecy: 32,
  ledger: 26,
  body: 22,
  caption: 18,
  micro: 14,
} as const;

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  ritual: 1.5,
} as const;

export type FontFamilyToken = keyof typeof fontFamily;
export type FontSizeToken = keyof typeof fontSize;
export type LineHeightToken = keyof typeof lineHeight;
export type FontWeightToken = keyof typeof fontWeight;
