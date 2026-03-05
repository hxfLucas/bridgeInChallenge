import { getRedisClient } from '../redis/redis-client';

export const REDIS_KEY_PREFIX = 'token:invalidated:';

/**
 * In-memory map: userId → Unix seconds timestamp.
 * Any JWT whose iat < this value is considered invalidated.
 */
export const invalidationMap = new Map<string, number>();

/**
 * Load all existing invalidation timestamps from Redis into the in-memory map.
 * Call this once on application startup.
 */
export async function loadInvalidationMapFromRedis(): Promise<void> {
  const client = getRedisClient();
  const keys = await client.keys(`${REDIS_KEY_PREFIX}*`);
  if (keys.length === 0) return;

  const values = await client.mget(...keys);
  for (let i = 0; i < keys.length; i++) {
    const userId = keys[i].slice(REDIS_KEY_PREFIX.length);
    const raw = values[i];
    if (raw !== null) {
      invalidationMap.set(userId, Number(raw));
    }
  }
}

/**
 * Invalidate all tokens issued before now for a given user.
 * Persists to Redis and updates the in-memory map.
 */
export async function invalidateUser(userId: string): Promise<void> {
  const timestamp = Math.floor(Date.now() / 1000);
  const client = getRedisClient();
  await client.set(`${REDIS_KEY_PREFIX}${userId}`, String(timestamp));
  invalidationMap.set(userId, timestamp);
}

/**
 * Returns true if the JWT (identified by iat) should be rejected.
 */
export function isTokenInvalidated(userId: string, iat: number): boolean {
  const invalidatedBefore = invalidationMap.get(userId) ?? 0;
  return iat <= invalidatedBefore;
}
