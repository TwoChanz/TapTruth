import type { ExpoConfig } from 'expo/config';

const config = (): ExpoConfig => ({
  name: 'TruthTap',
  slug: 'truthtap',
  version: '0.0.1',
  orientation: 'portrait',
  scheme: 'truthtap',
  userInterfaceStyle: 'dark',
  newArchEnabled: true,
  backgroundColor: '#0B0B12',
  ios: {
    bundleIdentifier: 'studio.six1five.truthtap',
    supportsTablet: false,
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'studio.six1five.truthtap',
  },
  plugins: ['expo-router', 'expo-secure-store', 'expo-font'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '60dbc453-81ab-4ad6-8145-10bdf93b9db7',
    },
  },
  // owner: '<your-expo-account-username>', // set when you create an Expo org/team
});

export default config;
