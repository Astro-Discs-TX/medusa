"use server"

/**
 * Fetch data in parallel with timeout and error handling
 * @param fetchers Array of functions that return promises
 * @param timeout Optional timeout in milliseconds
 * @returns Array of results in the same order as the input functions
 */
export async function parallelFetch<T extends any[]>(
  fetchers: Array<() => Promise<any>>,
  timeout?: number
): Promise<T> {
  // Create a promise for each fetcher, wrapped with error handling
  const promises = fetchers.map(async (fetcher, index) => {
    try {
      // If timeout is provided, wrap the fetcher in a race with a timeout
      if (timeout) {
        return await fetchWithTimeout(fetcher, timeout);
      } else {
        return await fetcher();
      }
    } catch (error) {
      console.error(`Error in parallel fetch #${index}:`, error);
      return null;
    }
  });

  // Wait for all promises to resolve
  return Promise.all(promises) as Promise<T>;
}

/**
 * Fetch with timeout
 * @param fetcher Function that returns a promise
 * @param ms Timeout in milliseconds
 * @returns Promise that resolves with the result or rejects with a timeout error
 */
export async function fetchWithTimeout<T>(
  fetcher: () => Promise<T>,
  ms: number
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([fetcher(), timeout]) as Promise<T>;
}

/**
 * Fetch with retry
 * @param fetcher Function that returns a promise
 * @param retries Number of retries
 * @param delay Delay between retries in milliseconds
 * @returns Promise that resolves with the result or rejects after all retries fail
 */
export async function fetchWithRetry<T>(
  fetcher: () => Promise<T>,
  retries: number = 3,
  delay: number = 300
): Promise<T> {
  try {
    return await fetcher();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    // Wait for the specified delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry with one less retry remaining
    return fetchWithRetry(fetcher, retries - 1, delay);
  }
} 