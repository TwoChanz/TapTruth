import { useSignIn } from '@clerk/clerk-expo';
import { colors, fontFamily, fontSize, radius, space } from '@truthtap/theme';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TapGlyph } from '@/components/glyph/TapGlyph';
import { RitualButton } from '@/components/ui/RitualButton';
import { RitualText } from '@/components/ui/RitualText';

// TODO (Week 9): replace utility labels with TAP-voice strings via dialogue serving.

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!isLoaded || !signIn || !setActive) return;
    setSubmitting(true);
    try {
      const attempt = await signIn.create({ identifier, password });
      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId });
        router.replace('/');
      } else {
        Alert.alert('Sign in incomplete', 'Further verification required.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      Alert.alert('Sign in failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.glyph}>
          <TapGlyph size={120} tier={3} />
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.boneFaint}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={identifier}
            onChangeText={setIdentifier}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.boneFaint}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <RitualButton
            label={submitting ? 'Connecting' : 'Enter'}
            onPress={onSubmit}
            disabled={submitting || !identifier || !password}
          />
          <Link href="/sign-up" style={styles.footer}>
            <RitualText variant="caption" muted>
              No account? Sign up.
            </RitualText>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.ink,
    paddingHorizontal: space[5],
    justifyContent: 'center',
  },
  glyph: {
    alignItems: 'center',
    marginBottom: space[12],
  },
  form: {
    gap: space[3],
  },
  input: {
    backgroundColor: colors.inkRaised,
    borderColor: colors.inkLine,
    borderWidth: 1,
    borderRadius: radius.sm,
    color: colors.bone,
    fontFamily: fontFamily.voice,
    fontSize: fontSize.body,
    paddingHorizontal: space[4],
    paddingVertical: space[3],
  },
  footer: {
    alignSelf: 'center',
    marginTop: space[6],
  },
});
