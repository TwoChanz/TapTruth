import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Env } from './env';

/**
 * Service-role Supabase client. Bypasses RLS — caller is trusted (a Worker).
 *
 * Created per-request because Workers may handle requests across many
 * isolate restarts; the client is cheap to instantiate.
 */
export function createSupabaseAdmin(env: Env): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/** Storage bucket holding raw screenshot uploads. Must exist in Supabase. */
export const SCREENSHOT_BUCKET = 'screenshots';
