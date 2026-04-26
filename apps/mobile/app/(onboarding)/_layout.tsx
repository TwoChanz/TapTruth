import { useAuth } from '@clerk/clerk-expo';
import { colors } from '@truthtap/theme';
import { Redirect, Stack } from 'expo-router';

export default function OnboardingLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/sign-in" />;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.ink },
        animation: 'fade',
      }}
    />
  );
}
