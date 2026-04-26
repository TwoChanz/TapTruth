import Anthropic from '@anthropic-ai/sdk';

import type { Env } from './env';

export function createAnthropic(env: Env): Anthropic {
  return new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
}

/**
 * Vision model for screenshot extraction.
 *
 * Architecture doc references "claude-sonnet-4" (no longer a valid ID).
 * Using the current Sonnet 4.6 — strong vision + structured-output reliability,
 * and ~5x cheaper than Opus for this constrained extraction task.
 *
 * Bump to `claude-opus-4-7` if accuracy is insufficient at scale; revisit
 * after Week 3 testing with real iOS Screen Time screenshots.
 */
export const VISION_MODEL = 'claude-sonnet-4-6';
