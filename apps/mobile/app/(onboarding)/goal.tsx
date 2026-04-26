import { colors, space } from '@truthtap/theme';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RitualText } from '@/components/ui/RitualText';

// TODO (Week 2): "What do you want the ledger to show?" — goal picker (under 2h/4h/6h/I'll decide/I don't know yet)
export default function Goal() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <RitualText variant="caption" muted>
          goal — TODO Week 2
        </RitualText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink, paddingHorizontal: space[5] },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
