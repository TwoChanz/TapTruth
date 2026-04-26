import type { Config } from 'tailwindcss';

/**
 * Token values are duplicated from packages/theme intentionally —
 * Tailwind's config loader is brittle with cross-workspace TS imports.
 * Keep these in sync with packages/theme/src/colors.ts and adjacent files.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#0B0B12',
        'ink-raised': '#15151E',
        'ink-line': '#22222E',
        bone: '#F5EFE7',
        'bone-soft': '#A09A92',
        'bone-faint': '#5C5953',
        amber: '#D4A84B',
        reckoning: '#8B2E2E',
        'mood-great': '#7DA87A',
        'mood-mid': '#D4A84B',
        'mood-rough': '#A65C45',
      },
      fontFamily: {
        prophecy: ['var(--font-prophecy)', 'serif'],
        ledger: ['var(--font-ledger)', 'monospace'],
        voice: ['var(--font-voice)', 'sans-serif'],
      },
      fontSize: {
        glyph: ['48px', '52px'],
        'prophecy-display': ['32px', '40px'],
        prophecy: ['24px', '32px'],
        ledger: ['20px', '26px'],
        body: ['16px', '22px'],
        caption: ['13px', '18px'],
        micro: ['11px', '14px'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      letterSpacing: {
        tight: '-0.5px',
        wide: '0.5px',
        ritual: '1.5px',
      },
    },
  },
  plugins: [],
};

export default config;
