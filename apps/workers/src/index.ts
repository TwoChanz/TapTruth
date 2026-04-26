import { Hono } from 'hono';

import { dialogueApp } from './handlers/dialogue';
import { healthApp } from './handlers/health';
import { screenshotsApp } from './handlers/screenshots';
import type { Env } from './lib/env';
import { toErrorResponse } from './lib/errors';

const app = new Hono<{ Bindings: Env }>();

app.route('/', healthApp);
app.route('/screenshots', screenshotsApp);
app.route('/dialogue', dialogueApp);

app.notFound((c) =>
  c.json({ error: 'not_found', message: 'Route not registered' }, 404),
);

app.onError((err) => toErrorResponse(err));

export default app;
