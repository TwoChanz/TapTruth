import { Hono } from 'hono';

import type { Env } from '../lib/env';

export const healthApp = new Hono<{ Bindings: Env }>();

healthApp.get('/health', (c) =>
  c.json({ status: 'ok', timestamp: new Date().toISOString() }),
);
