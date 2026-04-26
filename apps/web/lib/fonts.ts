import { Cormorant_Garamond, IBM_Plex_Mono, Inter } from 'next/font/google';

/**
 * Font wiring. Each family registers a CSS variable that Tailwind
 * utilities (font-prophecy / font-ledger / font-voice) reference.
 *
 * Cormorant Garamond stands in for Canela until the licensed font is wired.
 * IBM Plex Mono and Inter are the canonical ledger and voice families.
 */
export const prophecy = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-prophecy',
  display: 'swap',
});

export const ledger = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ledger',
  display: 'swap',
});

export const voice = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-voice',
  display: 'swap',
});
