// In-memory sliding window rate limiter
// Note: resets on server restart; sufficient for demo/single-instance deployment

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    entry.timestamps = entry.timestamps.filter((t: number) => now - t < 120_000);
    if (entry.timestamps.length === 0) store.delete(key);
  });
}, 300_000);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // ms until window resets
}

export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(identifier) || { timestamps: [] };

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    return {
      success: false,
      remaining: 0,
      reset: oldest + windowMs - now,
    };
  }

  entry.timestamps.push(now);
  store.set(identifier, entry);

  return {
    success: true,
    remaining: limit - entry.timestamps.length,
    reset: windowMs,
  };
}
