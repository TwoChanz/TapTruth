import { colors, space } from '@truthtap/theme';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TapGlyph } from '@/components/glyph/TapGlyph';
import { RitualButton } from '@/components/ui/RitualButton';
import { RitualText } from '@/components/ui/RitualText';

/**
 * First onboarding screen. Per PRD §3.1:
 *   "TAP awakens. Dark screen. The glyph fades in and pulses."
 *   Copy: "You have been watching the glass. I have been watching you."
 *
 * Final dialogue lands once dialogue serving is wired (Week 5).
 */
export default function Awaken() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <TapGlyph size={168} tier={3} />
        <View style={styles.lines}>
          <RitualText variant="prophecy" style={styles.line}>
            You have been watching the glass.
          </RitualText>
          <RitualText variant="prophecy" style={styles.line}>
            I have been watching you.
          </RitualText>
        </View>
      </View>
      <RitualButton label="Continue" onPress={() => router.push('/name')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ink,
    paddingHorizontal: space[5],
    paddingBottom: space[8],
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[12],
  },
  lines: {
    gap: space[2],
    alignItems: 'center',
  },
  line: {
    textAlign: 'center',
  },
});
