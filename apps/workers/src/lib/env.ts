/**
 * Worker bindings. Mirrors the names in wrangler.toml / .dev.vars.
 *
 * Don't put `EXPO_PUBLIC_*` or `NEXT_PUBLIC_*` here — those are client-side
 * conventions and the Worker is server-only.
 */
export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ANTHROPIC_API_KEY: string;
  /** HMAC secret for verifying Supabase Storage webhook signatures. */
  WEBHOOK_SECRET: string;
}
