import { colors, tierGlow } from './colors';
import { duration, easing } from './motion';
import { layout, radius, space } from './spacing';
import { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } from './typography';

/**
 * Combined theme object. Most consumers prefer the named imports
 * (`import { colors } from '@truthtap/theme'`), but `theme` is here
 * for cases where a single object is more ergonomic.
 */
export const theme = {
  colors,
  tierGlow,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  space,
  radius,
  layout,
  duration,
  easing,
} as const;

export type Theme = typeof theme;
