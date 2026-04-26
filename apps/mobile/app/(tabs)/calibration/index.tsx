import { colors, space } from '@truthtap/theme';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RitualText } from '@/components/ui/RitualText';

// TODO (Week 6): Calibration (settings) — The Voice (tier), The Name, The Goal,
// The Confession Hour, The Scroll, Unfiltered, Account, Silent TAP, End the vigil.
export default function Calibration() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <RitualText variant="caption" muted>
          calibration — TODO Week 6
        </RitualText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink, paddingHorizontal: space[5] },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
