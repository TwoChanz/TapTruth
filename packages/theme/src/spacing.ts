/**
 * Spacing, radii, and layout constants.
 * 4px base scale. Numeric keys for arithmetic, named layout for landmark sizes.
 */

export const space = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const layout = {
  /** Standard horizontal screen padding */
  pagePadding: 20,
  /** Web max content width */
  maxContentWidth: 640,
  /** Glyph diameters at standard sizes */
  glyphSm: 48,
  glyphMd: 96,
  glyphLg: 168,
  glyphHero: 240,
  /** Hairline border width (RN treats this differently — platform layer adapts) */
  hairline: 1,
} as const;

export type SpaceToken = keyof typeof space;
export type RadiusToken = keyof typeof radius;
