import { colors, space } from '@truthtap/theme';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TapGlyph } from '@/components/glyph/TapGlyph';
import { RitualText } from '@/components/ui/RitualText';

// TODO (Week 4): The Ledger.
//   - Glyph header
//   - Today's reading (TAP line via dialogue serving)
//   - Today's confession card
//   - This week chart
//   - Pattern notices (Tier 2+)
//   - Vigil status
//   - Sponsored prophecy (free tier)
export default function Ledger() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <TapGlyph size={120} tier={3} />
        <RitualText variant="caption" muted>
          ledger — TODO Week 4
        </RitualText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink, paddingHorizontal: space[5] },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[8] },
});
