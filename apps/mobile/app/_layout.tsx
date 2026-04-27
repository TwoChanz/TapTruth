import { ClerkProvider } from '@clerk/clerk-expo';
import { CormorantGaramond_500Medium } from '@expo-google-fonts/cormorant-garamond';
import { IBMPlexMono_400Regular } from '@expo-google-fonts/ibm-plex-mono';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import { colors } from '@truthtap/theme';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { tokenCache } from '@/lib/clerk';
import { requireEnv } from '@/lib/env';

const PUBLISHABLE_KEY = requireEnv('CLERK_PUBLISHABLE_KEY');

// Hold splash while fonts resolve. Without this we'd flash system fonts first.
SplashScreen.preventAutoHideAsync().catch(() => {
  // No-op if already hidden — happens on Fast Refresh.
});

export default function RootLayout() {
  // Register Google Fonts under the semantic names theme/typography.ts uses.
  // When we license Canela later, swap CormorantGaramond_500Medium for it
  // and theme references stay unchanged.
  const [fontsLoaded, fontError] = useFonts({
    Canela: CormorantGaramond_500Medium,
    IBMPlexMono: IBMPlexMono_400Regular,
    Inter: Inter_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <Slot />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ink,
  },
});
