import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Browser-side Supabase client for client components.
 * Uses the publishable (anon) key — RLS gates access.
 *
 * TODO (Week 2-3): wire Clerk session token via custom fetch so
 * client-component queries respect the user's identity.
 */
export const createClient = () => {
  if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
  if (!supabaseKey) throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required');
  return createBrowserClient(supabaseUrl, supabaseKey);
};
