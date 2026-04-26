import { useAuth } from '@clerk/clerk-expo';
import { colors, fontFamily, fontSize, letterSpacing } from '@truthtap/theme';
import { Redirect, Tabs } from 'expo-router';

export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.ink,
          borderTopColor: colors.inkLine,
        },
        tabBarActiveTintColor: colors.bone,
        tabBarInactiveTintColor: colors.boneFaint,
        tabBarLabelStyle: {
          fontFamily: fontFamily.voice,
          fontSize: fontSize.micro,
          letterSpacing: letterSpacing.ritual,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen name="ledger/index" options={{ title: 'Ledger' }} />
      <Tabs.Screen name="visions/index" options={{ title: 'Visions' }} />
      <Tabs.Screen name="calibration/index" options={{ title: 'Calibration' }} />
    </Tabs>
  );
}
