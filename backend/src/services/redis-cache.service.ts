import { createClient } from "redis";

const PRODUCT_CACHE_TTL_SECONDS = 60;

export const redisClient = createClient({
  url: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
  socket: {
    connectTimeout: 1000,
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
  },
});

redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

redisClient.on("ready", () => {
  console.info("Redis product cache connected.");
});

export function connectRedis(): void {
  void redisClient.connect().catch((error: unknown) => {
    console.error(
      "Redis connection failed; product queries will use the ERP directly.",
      error,
    );
  });
}

export async function getOrLoadProductCache<T>(
  key: string,
  load: () => Promise<T>,
): Promise<T> {
  if (redisClient.isReady) {
    try {
      const cachedValue = await redisClient.get(key);

      if (cachedValue !== null) {
        try {
          return JSON.parse(cachedValue) as T;
        } catch (error) {
          console.error(`Invalid product cache entry for "${key}":`, error);
          await redisClient.del(key);
        }
      }
    } catch (error) {
      console.error(`Redis cache read failed for "${key}":`, error);
    }
  }

  const value = await load();

  if (redisClient.isReady) {
    try {
      await redisClient.set(key, JSON.stringify(value), {
        EX: PRODUCT_CACHE_TTL_SECONDS,
      });
    } catch (error) {
      console.error(`Redis cache write failed for "${key}":`, error);
    }
  }

  return value;
}
