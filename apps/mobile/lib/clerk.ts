import * as SecureStore from 'expo-secure-store';

/**
 * Token cache contract that Clerk's React Native SDK consumes.
 * Defined inline rather than imported from a Clerk subpath to avoid coupling
 * to internal package layout.
 */
export interface TokenCache {
  getToken: (key: string) => Promise<string | null>;
  saveToken: (key: string, token: string) => Promise<void>;
}

/**
 * SecureStore-backed cache. SecureStore wraps iOS Keychain and Android Keystore —
 * the right home for auth tokens. Errors are swallowed so a transient SecureStore
 * issue can't lock the app out; Clerk will simply re-authenticate on next mount.
 */
export const tokenCache: TokenCache = {
  async getToken(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key, token) {
    try {
      await SecureStore.setItemAsync(key, token);
    } catch {
      // Intentional no-op — see header comment.
    }
  },
};
