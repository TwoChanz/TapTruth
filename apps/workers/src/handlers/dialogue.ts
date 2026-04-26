import { DIALOGUE_SURFACES } from '@truthtap/types';
import { Hono } from 'hono';
import { z } from 'zod';

import type { Env } from '../lib/env';
import { HttpError } from '../lib/errors';

const ServeRequestSchema = z.object({
  user_id: z.string(),
  surface: z.enum(DIALOGUE_SURFACES),
  tier: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  context: z.record(z.unknown()),
});

export const dialogueApp = new Hono<{ Bindings: Env }>();

dialogueApp.post('/serve', async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = ServeRequestSchema.safeParse(body);
  if (!parsed.success) {
    throw new HttpError(
      400,
      'invalid_request',
      'Body did not match expected shape',
      parsed.error.flatten(),
    );
  }

  // TODO (Week 5): implement serveDialogue per docs/04_TECHNICAL_ARCHITECTURE.md §3.
  //   1. SELECT * FROM dialogue_templates
  //      WHERE surface = $1 AND tier <= $2 AND is_active
  //        AND (active_from IS NULL OR active_from <= NOW())
  //        AND (active_until IS NULL OR active_until > NOW())
  //   2. Filter by .conditions JSONB matching the request context (worst_app, min_streak, etc.)
  //   3. Exclude lines served to this user_id+surface in the last 14 days (dialogue_served)
  //   4. Weighted random selection favoring less-served lines
  //   5. Render {{placeholders}} against the request context
  //   6. INSERT into dialogue_served, increment dialogue_templates.impressions
  //   7. Return { template_id, surface, tier, rendered, served_at }

  throw new HttpError(501, 'not_implemented', 'Dialogue serving lands Week 5');
});
