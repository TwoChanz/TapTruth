import { colors, fontFamily, fontSize, letterSpacing, lineHeight } from '@truthtap/theme';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type RitualTextVariant =
  | 'prophecyDisplay'
  | 'prophecy'
  | 'ledger'
  | 'body'
  | 'caption'
  | 'micro';

interface RitualTextProps extends TextProps {
  variant?: RitualTextVariant;
  /** Use boneSoft (secondary). */
  muted?: boolean;
  /** Use boneFaint (tertiary / disabled). */
  faint?: boolean;
}

/**
 * Single text primitive for the whole app. Variant maps to the typography
 * scale; tone modifiers select bone / boneSoft / boneFaint.
 */
export function RitualText({ variant = 'body', muted, faint, style, ...rest }: RitualTextProps) {
  const color = faint ? colors.boneFaint : muted ? colors.boneSoft : colors.bone;
  return <Text {...rest} style={[styles[variant], { color }, style]} />;
}

const styles = StyleSheet.create({
  prophecyDisplay: {
    fontFamily: fontFamily.prophecy,
    fontSize: fontSize.prophecyDisplay,
    lineHeight: lineHeight.prophecyDisplay,
    letterSpacing: letterSpacing.tight,
  },
  prophecy: {
    fontFamily: fontFamily.prophecy,
    fontSize: fontSize.prophecy,
    lineHeight: lineHeight.prophecy,
    letterSpacing: letterSpacing.tight,
  },
  ledger: {
    fontFamily: fontFamily.ledger,
    fontSize: fontSize.ledger,
    lineHeight: lineHeight.ledger,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontFamily: fontFamily.voice,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    letterSpacing: letterSpacing.normal,
  },
  caption: {
    fontFamily: fontFamily.voice,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
    letterSpacing: letterSpacing.wide,
  },
  micro: {
    fontFamily: fontFamily.voice,
    fontSize: fontSize.micro,
    lineHeight: lineHeight.micro,
    letterSpacing: letterSpacing.ritual,
    textTransform: 'uppercase',
  },
});
