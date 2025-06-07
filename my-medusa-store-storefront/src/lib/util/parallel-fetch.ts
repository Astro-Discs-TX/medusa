/**
 * Utility function to fetch multiple resources in parallel
 * @param fetchers Array of fetcher functions to execute in parallel
 * @returns Promise that resolves with the results of all fetcher functions
 */
export async function parallelFetch<T>(fetchers: (() => Promise<T>)[]): Promise<T[]> {
  return Promise.all(fetchers.map(fetcher => fetcher()))
}

/**
 * Utility function to fetch data with a timeout
 * @param fetchFn The fetch function to execute
 * @param timeoutMs Timeout in milliseconds
 * @param fallback Optional fallback value if the fetch times out
 * @returns Promise that resolves with the fetched data or fallback value
 */
export async function fetchWithTimeout<T>(
  fetchFn: () => Promise<T>,
  timeoutMs: number = 5000,
  fallback?: T
): Promise<T> {
  return Promise.race([
    fetchFn(),
    new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        if (fallback !== undefined) {
          return resolve(fallback)
        }
        reject(new Error(`Fetch timed out after ${timeoutMs}ms`))
      }, timeoutMs)
    })
  ])
} 