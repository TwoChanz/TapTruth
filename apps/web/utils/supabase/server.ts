import { createServerClient } from '@supabase/ssr';
import type { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Server-side Supabase client for RSCs and server actions.
 * Uses the publishable (anon) key — RLS gates what the user can see.
 *
 * NOTE: TruthTap uses Clerk for auth, not Supabase Auth. The cookie
 * handlers below satisfy the @supabase/ssr contract but no Supabase
 * session cookies are expected.
 *
 * TODO (Week 2-3): inject Clerk JWT (template: "supabase") via the
 * `accessToken` option so RLS sees the user's Clerk identity.
 *   See: https://clerk.com/docs/integrations/databases/supabase
 *
 * For RLS-bypassing admin reads (currently only the public /scroll/[slug]
 * page), use `getSupabaseAdmin()` from `lib/supabase.ts` instead.
 */
export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
  if (!supabaseKey) throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required');

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — safe to ignore.
        }
      },
    },
  });
};
