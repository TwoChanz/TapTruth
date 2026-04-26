import { colors, fontFamily, fontSize, lineHeight } from '@truthtap/theme';
import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

type SizeToken = keyof typeof fontSize;

interface TabularNumberProps extends TextProps {
  size?: SizeToken;
  muted?: boolean;
}

/**
 * Reverent number rendering — tabular figures, monospaced ledger family.
 * Per the Character Bible: numbers are exact, generous, unhurried.
 */
export function TabularNumber({ size = 'ledger', muted, style, ...rest }: TabularNumberProps) {
  const lh = (lineHeight as Record<string, number | undefined>)[size] ?? fontSize[size] * 1.3;
  return (
    <Text
      {...rest}
      style={[
        styles.base,
        {
          fontSize: fontSize[size],
          lineHeight: lh,
          color: muted ? colors.boneSoft : colors.bone,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: fontFamily.ledger,
    fontVariant: ['tabular-nums'],
    ...Platform.select({
      web: { fontFeatureSettings: '"tnum"' },
    }),
  },
});
