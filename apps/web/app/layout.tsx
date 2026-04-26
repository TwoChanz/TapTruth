import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { ledger, prophecy, voice } from '@/lib/fonts';

import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: 'TruthTap',
  // Verbatim from docs/01_POSITIONING.md (one-line pitch). Locked content.
  description:
    'TruthTap is a best-in-class screen time utility fronted by TAP — a deadpan data prophet who has seen your week and has things to say about it.',
  metadataBase: siteUrl ? new URL(siteUrl) : null,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${prophecy.variable} ${ledger.variable} ${voice.variable}`}>
      <body className="bg-ink text-bone font-voice min-h-screen">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
