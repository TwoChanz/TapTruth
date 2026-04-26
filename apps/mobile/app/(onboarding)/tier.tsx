import { colors, space } from '@truthtap/theme';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RitualText } from '@/components/ui/RitualText';

// TODO (Week 2): five-tier picker with sample dialogue per tier.
//   Tier 5 (Reckoning) is grayed out — "Unlocks after three confessions."
//   Default selected: Tier 3 (Foreseen).
export default function TierSelect() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <RitualText variant="caption" muted>
          tier — TODO Week 2
        </RitualText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink, paddingHorizontal: space[5] },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
