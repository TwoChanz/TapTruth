import { colors, space } from '@truthtap/theme';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RitualText } from '@/components/ui/RitualText';

// TODO (Week 6): unlocked Visions list. Each Vision is 2-4 sentences of prophetic lore.
export default function Visions() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <RitualText variant="caption" muted>
          visions — TODO Week 6
        </RitualText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink, paddingHorizontal: space[5] },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
