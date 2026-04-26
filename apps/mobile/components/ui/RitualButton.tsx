import { colors, fontFamily, fontSize, letterSpacing, radius, space } from '@truthtap/theme';
import {
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  StyleSheet,
  Text,
  type TextStyle,
  View,
} from 'react-native';

export type RitualButtonVariant = 'primary' | 'secondary' | 'destructive';

interface RitualButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: RitualButtonVariant;
  disabled?: boolean;
  style?: PressableProps['style'];
}

/**
 * The ritual button. Primary is bone-on-ink; secondary is hairline-bordered
 * transparent; destructive is reckoning-red border on transparent.
 *
 * Label is rendered uppercase with ritual letter-spacing — TAP's labels are
 * incantations, not commands.
 */
export function RitualButton({
  label,
  variant = 'primary',
  disabled,
  style,
  ...rest
}: RitualButtonProps) {
  return (
    <Pressable
      {...rest}
      disabled={disabled}
      style={(state) => [
        styles.base,
        styles[variant],
        state.pressed && styles.pressed,
        disabled && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      <View style={styles.inner}>
        <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: space[5],
    paddingVertical: space[3],
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.bone,
    borderColor: colors.bone,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: colors.boneSoft,
  },
  destructive: {
    backgroundColor: 'transparent',
    borderColor: colors.reckoning,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontFamily: fontFamily.voice,
    fontSize: fontSize.body,
    fontWeight: '500',
    letterSpacing: letterSpacing.ritual,
    textTransform: 'uppercase',
  },
});

const labelStyles: Record<RitualButtonVariant, TextStyle> = {
  primary: { color: colors.ink },
  secondary: { color: colors.bone },
  destructive: { color: colors.reckoning },
};

// Re-export for callers who want to type their own state callback.
export type { PressableStateCallbackType };
