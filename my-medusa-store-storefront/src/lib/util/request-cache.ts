"use server"

// A simple in-memory cache for server-side request deduplication
// This helps reduce redundant API calls during server rendering

type CacheRecord = {
  timestamp: number;
  data: any;
}

// Cache with expiration
const requestCache = new Map<string, CacheRecord>();
const DEFAULT_TTL = 60 * 1000; // 60 seconds in milliseconds

/**
 * Generate a cache key from a URL and optional query parameters
 */
export async function generateCacheKey(url: string, params?: Record<string, any>): Promise<string> {
  if (!params) {
    return url;
  }
  
  // Sort keys to ensure consistent cache keys regardless of object property order
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {} as Record<string, any>);
  
  return `${url}:${JSON.stringify(sortedParams)}`;
}

/**
 * Deduplicate requests by caching responses
 * @param url The URL to fetch
 * @param fetcher The function that performs the actual fetch
 * @param ttl Time to live in milliseconds
 * @returns The cached or fresh response
 */
export async function deduplicateRequest<T>(
  url: string,
  fetcher: () => Promise<T>,
  params?: Record<string, any>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const cacheKey = await generateCacheKey(url, params);
  const now = Date.now();
  
  // Check if we have a valid cached response
  const cached = requestCache.get(cacheKey);
  if (cached && now - cached.timestamp < ttl) {
    console.log(`Cache hit for ${cacheKey}`);
    return cached.data as T;
  }
  
  // If not cached or expired, fetch fresh data
  console.log(`Cache miss for ${cacheKey}`);
  const result = await fetcher();
  
  // Cache the result
  requestCache.set(cacheKey, {
    timestamp: now,
    data: result
  });
  
  return result;
}

/**
 * Clear the entire request cache
 */
export async function clearRequestCache(): Promise<void> {
  requestCache.clear();
}

/**
 * Clear a specific entry from the cache
 * @param url The URL to clear from cache
 * @param params Optional query parameters
 */
export async function clearCacheEntry(url: string, params?: Record<string, any>): Promise<void> {
  const cacheKey = await generateCacheKey(url, params);
  requestCache.delete(cacheKey);
} 