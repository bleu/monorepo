/* eslint-disable no-console */
import { kv } from "@vercel/kv";

const memoryCache: Record<string, unknown> = {};

export const MEMORY_CACHE = {
  set(cacheKey: string, data?: Record<string, unknown>) {
    memoryCache[cacheKey] = data;
  },

  get<T>(cacheKey: string) {
    return memoryCache[cacheKey] as T;
  },
};

export const KV = {
  async set(cacheKey: string, data?: Record<string, unknown>) {
    await kv.set(cacheKey, data);
  },

  async get<T>(cacheKey: string) {
    const cached = await kv.get<T>(cacheKey);

    if (cached) {
      console.debug(`KV cache hit cache key: ${cacheKey}`);
      return cached;
    }
  },
};

export const getDataFromCacheOrCompute = async <T>(
  cacheKey: false | string | null,
  computeFn: () => Promise<T>,
): Promise<T> => {
  if (!cacheKey) {
    return computeFn();
  }

  if (MEMORY_CACHE.get(cacheKey)) {
    console.debug(`Memory cache hit for ${cacheKey}`);
    return MEMORY_CACHE.get<T>(cacheKey);
  }

  try {
    const cached = await KV.get<T>(cacheKey);

    if (cached) {
      MEMORY_CACHE.set(cacheKey, cached);
      return cached;
    }
  } catch (error) {
    console.error(`KV cache error: ${error}`);
  }

  console.debug(`Cache miss for ${cacheKey}`);
  const computedData = await computeFn();

  if (computedData) {
    MEMORY_CACHE.set(cacheKey, computedData);
    try {
      KV.set(cacheKey, computedData);
    } catch (error) {
      console.error(`KV cache error: ${error}`);
    }
  }

  return computedData;
};