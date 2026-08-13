import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const useRedis = process.env.USE_REDIS !== 'false';

let isRedisConnected = false;
export const redisClient = useRedis 
  ? createClient({ 
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.warn('Redis reconnection failed 3 times. Disabling Redis caching.');
            isRedisConnected = false;
            return false; // Stop reconnecting
          }
          return Math.min(retries * 100, 3000);
        }
      }
    })
  : null;

if (redisClient) {
  redisClient.on('error', (err) => {
    // Only log once to avoid console flooding
    if (isRedisConnected) {
      console.warn('Redis Client Error:', err.message || err);
      isRedisConnected = false;
    }
  });

  redisClient.on('connect', () => {
    console.log('Redis connecting...');
  });

  redisClient.on('ready', () => {
    console.log('Redis connected and ready');
    isRedisConnected = true;
  });

  // Connect to redis
  (async () => {
    try {
      await redisClient.connect();
    } catch (error) {
      console.warn('Could not establish connection to Redis. Caching is disabled.');
      isRedisConnected = false;
    }
  })();
} else {
  console.log('Redis is explicitly disabled via USE_REDIS config.');
}

/**
 * Get item from cache
 */
export async function getCache(key: string): Promise<string | null> {
  try {
    if (!useRedis || !redisClient || !isRedisConnected) return null;
    return await redisClient.get(key);
  } catch (error) {
    return null;
  }
}

/**
 * Set item in cache with TTL
 */
export async function setCache(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
  try {
    if (!useRedis || !redisClient || !isRedisConnected) return;
    const valStr = typeof value === 'string' ? value : JSON.stringify(value);
    await redisClient.setEx(key, ttlSeconds, valStr);
  } catch (error) {
    // Silent fail
  }
}

/**
 * Invalidate/delete cache keys starting with a specific pattern
 */
export async function clearCachePattern(pattern: string): Promise<void> {
  try {
    if (!useRedis || !redisClient || !isRedisConnected) return;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Cleared cache for keys: ${keys.join(', ')}`);
    }
  } catch (error) {
    // Silent fail
  }
}
