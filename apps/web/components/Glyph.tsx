import { tierGlow } from '@truthtap/theme';
import type { Tier } from '@truthtap/types';

interface GlyphProps {
  size?: number;
  tier?: Tier;
  /** Override tier-derived color. */
  color?: string;
  /** Disable pulse. Defaults true at Tier 1 (Clinical). */
  paused?: boolean;
  className?: string;
}

/**
 * Web counterpart to mobile's TapGlyph. Three concentric rings, hairline
 * strokes. Pulse is CSS-driven (see app/globals.css) so it can render
 * inside RSCs without client-side animation libraries.
 */
export function Glyph({ size = 96, tier = 3, color, paused, className }: GlyphProps) {
  const stroke = color ?? tierGlow[tier];
  const isPaused = paused ?? tier === 1;
  const center = size / 2;
  const outerR = size / 2 - 1;
  const middleR = size / 3;
  const innerR = size / 6;
  const strokeWidth = Math.max(1, size / 48);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="TruthTap glyph"
    >
      <circle
        cx={center}
        cy={center}
        r={outerR}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={0.6}
        className={isPaused ? undefined : 'glyph-outer'}
      />
      <circle
        cx={center}
        cy={center}
        r={middleR}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
        className={isPaused ? undefined : 'glyph-middle'}
      />
      <circle cx={center} cy={center} r={innerR} fill={stroke} opacity={0.95} />
    </svg>
  );
}
