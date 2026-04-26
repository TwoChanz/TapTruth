import { colors, space } from '@truthtap/theme';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RitualText } from '@/components/ui/RitualText';

// TODO (Week 2): "What should I call you?" — text input → users.display_name
export default function Name() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <RitualText variant="caption" muted>
          name — TODO Week 2
        </RitualText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink, paddingHorizontal: space[5] },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
