import { NextRequest, NextResponse } from 'next/server';

type ApiHandler = (request: NextRequest) => Promise<NextResponse>;

/**
 * Wraps an API route handler with consistent error handling.
 * Catches SyntaxError (malformed JSON) and returns 400.
 * Catches all other errors and returns 500.
 */
export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error) {
      if (error instanceof SyntaxError) {
        return NextResponse.json(
          { error: 'Invalid JSON in request body' },
          { status: 400 }
        );
      }

      console.error(`[API Error] ${request.method} ${request.nextUrl.pathname}:`, error);

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Safe JSON parser for request bodies.
 * Returns null if body is empty or invalid.
 */
export async function safeParseBody<T = unknown>(request: NextRequest): Promise<T | null> {
  try {
    return await request.json() as T;
  } catch {
    return null;
  }
}
