import { tierGlow } from '@truthtap/theme';
import type { Tier } from '@truthtap/types';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { glyphPulseDurationForTier } from '@/components/glyph/GlyphMoods';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TapGlyphProps {
  /** Diameter in px. Default 96. */
  size?: number;
  /** Influences color and pulse cadence. Default 3 (Foreseen). */
  tier?: Tier;
  /** Override tier-derived color. */
  color?: string;
  /** Pause the pulse. Defaults true at Tier 1 (Clinical). */
  paused?: boolean;
}

/**
 * The TruthTap glyph — three concentric rings around a solid core.
 *
 * Per the Character Bible: not a face, not eyes. An aperture.
 * Outer ring breathes; middle ring counter-breathes; inner core
 * holds steady. Pulse cadence comes from the tier.
 */
export function TapGlyph({ size = 96, tier = 3, color, paused }: TapGlyphProps) {
  const stroke = color ?? tierGlow[tier];
  const isPaused = paused ?? tier === 1;

  const outerOpacity = useSharedValue(0.6);
  const middleOpacity = useSharedValue(1);

  useEffect(() => {
    if (isPaused) {
      cancelAnimation(outerOpacity);
      cancelAnimation(middleOpacity);
      outerOpacity.value = 0.4;
      middleOpacity.value = 0.8;
      return;
    }

    const dur = glyphPulseDurationForTier(tier);
    outerOpacity.value = withRepeat(
      withTiming(1, { duration: dur, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    middleOpacity.value = withRepeat(
      withTiming(0.5, { duration: dur, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [tier, isPaused, outerOpacity, middleOpacity]);

  const outerProps = useAnimatedProps(() => ({ opacity: outerOpacity.value }));
  const middleProps = useAnimatedProps(() => ({ opacity: middleOpacity.value }));

  // Geometry — three concentric rings, hairline strokes scale with size.
  const center = size / 2;
  const outerR = size / 2 - 1;
  const middleR = size / 3;
  const innerR = size / 6;
  const strokeWidth = Math.max(1, size / 48);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <AnimatedCircle
          cx={center}
          cy={center}
          r={outerR}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
          animatedProps={outerProps}
        />
        <AnimatedCircle
          cx={center}
          cy={center}
          r={middleR}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
          animatedProps={middleProps}
        />
        <Circle cx={center} cy={center} r={innerR} fill={stroke} opacity={0.95} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
