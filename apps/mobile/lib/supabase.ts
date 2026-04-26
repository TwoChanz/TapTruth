import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

import { requireEnv } from '@/lib/env';

/**
 * Supabase client with NO session management.
 *
 * Auth is owned by Clerk. RLS is enforced via Clerk-issued JWTs.
 *
 * TODO (Week 2-3): wire Clerk → Supabase. Two options:
 *   1) `accessToken` option on createClient pointing to a function that
 *      returns Clerk's session token.
 *   2) Custom `fetch` that injects Authorization on every request.
 *   See: https://clerk.com/docs/integrations/databases/supabase
 */
export const supabase = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_ANON_KEY'), {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});
