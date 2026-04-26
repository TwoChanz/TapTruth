import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

/**
 * Service-role Supabase client — RLS-bypassing.
 *
 * Use ONLY for:
 *   - Public RSC reads where RLS shouldn't apply (e.g. /scroll/[slug])
 *   - Admin operations behind the Clerk-protected /admin gate
 *
 * For user-context queries (RLS-respecting), use:
 *   - utils/supabase/server.ts in RSCs / server actions
 *   - utils/supabase/client.ts in client components
 *
 * Lazy singleton — build doesn't crash when env is missing; only routes
 * that actually call this throw if SUPABASE_SERVICE_ROLE_KEY is unset.
 *
 * NEVER import from a client component. The `server-only` import enforces this.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
  cached = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}
