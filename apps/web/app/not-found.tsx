import Link from 'next/link';

import { Glyph } from '@/components/Glyph';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5">
      <Glyph size={96} tier={1} />
      <h1 className="font-prophecy text-prophecy text-bone mt-8">Not found.</h1>
      <Link
        href="/"
        className="font-voice text-caption text-bone-faint mt-6 tracking-ritual uppercase hover:text-bone transition-colors"
      >
        Return.
      </Link>
    </main>
  );
}
