import { colors, space } from '@truthtap/theme';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TapGlyph } from '@/components/glyph/TapGlyph';
import { RitualText } from '@/components/ui/RitualText';

// TODO (Week 2): real Clerk sign-up flow with email verification.
//   - useSignUp().create({ emailAddress, password })
//   - prepareEmailAddressVerification → verify code → setActive
export default function SignUp() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <TapGlyph size={96} tier={3} />
        <RitualText variant="caption" muted>
          sign-up — TODO Week 2
        </RitualText>
      </View>
      <Link href="/sign-in" style={styles.footer}>
        <RitualText variant="caption" muted>
          Return to sign in.
        </RitualText>
      </Link>
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
    gap: space[6],
  },
  footer: {
    alignSelf: 'center',
  },
});
