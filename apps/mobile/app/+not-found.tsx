import { colors, space } from '@truthtap/theme';
import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { RitualText } from '@/components/ui/RitualText';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.container}>
        <RitualText variant="prophecy">Not found.</RitualText>
        <Link href="/" style={styles.link}>
          <RitualText variant="caption" muted>
            Return.
          </RitualText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[5],
  },
  link: {
    marginTop: space[6],
  },
});
