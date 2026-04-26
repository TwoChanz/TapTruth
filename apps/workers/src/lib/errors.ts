import type { ApiError } from '@truthtap/types';

/**
 * Typed error for handler exits. The top-level Hono `onError` converts these
 * into `ApiError` JSON responses with the appropriate HTTP status.
 */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }

  toBody(): ApiError {
    return {
      error: this.code,
      message: this.message,
      ...(this.details !== undefined ? { details: this.details } : {}),
    };
  }
}

/**
 * Convert any thrown value into a JSON Response. HttpError preserves status
 * and code; everything else becomes a 500 with a generic body. The original
 * error is logged via `console.error` for Cloudflare tail visibility.
 */
export function toErrorResponse(err: unknown): Response {
  if (err instanceof HttpError) {
    return new Response(JSON.stringify(err.toBody()), {
      status: err.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  console.error('Unhandled error:', err);
  const body: ApiError = {
    error: 'internal',
    message: err instanceof Error ? err.message : 'Internal server error',
  };
  return new Response(JSON.stringify(body), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
