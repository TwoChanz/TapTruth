import type { SharedScroll } from '@truthtap/types';
import { notFound } from 'next/navigation';

import { Glyph } from '@/components/Glyph';
import { getSupabaseAdmin } from '@/lib/supabase';

interface ScrollPageProps {
  params: { slug: string };
}

async function fetchScroll(slug: string): Promise<SharedScroll | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('shared_scrolls')
    .select('*')
    .eq('share_slug', slug)
    .maybeSingle();
  if (error) throw error;
  return (data as SharedScroll | null) ?? null;
}

/**
 * Public shareable scroll page. Rendered when a user hits truthtap.app/scroll/{slug}.
 * Full visual treatment lands Week 6 alongside the share-image generator.
 */
export default async function ScrollPage({ params }: ScrollPageProps) {
  const scroll = await fetchScroll(params.slug);
  if (!scroll) notFound();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
      <Glyph size={120} tier={3} className="mb-8" />
      <h1 className="font-prophecy text-prophecy text-bone text-center">The Ledger</h1>
      <p className="font-voice text-caption text-bone-faint text-center mt-4 tracking-ritual uppercase tabular">
        {scroll.period_start} — {scroll.period_end}
      </p>
      {/* TODO (Week 6): full scroll rendering (totals, top apps, daily chart, share button) */}
    </main>
  );
}

// Re-fetch at most once per minute so view counts and snapshot edits propagate.
export const revalidate = 60;
