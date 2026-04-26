/**
 * Type-safe access to EXPO_PUBLIC_* environment variables.
 *
 * Vars are read at build time (Metro inlines them into the bundle).
 * `env.X` returns undefined if missing; `requireEnv('X')` throws with a
 * clear message — use it where the value is actually needed.
 */

export const env = {
  CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  WORKER_BASE_URL: process.env.EXPO_PUBLIC_WORKER_BASE_URL,
} as const;

export type EnvKey = keyof typeof env;

export const requireEnv = (key: EnvKey): string => {
  const value = env[key];
  if (!value) {
    throw new Error(
      `Missing required env var: EXPO_PUBLIC_${key}. ` +
        `Copy .env.example to .env and fill it in.`,
    );
  }
  return value;
};
