"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { deduplicateRequest } from "@lib/util/request-cache"
import { HttpTypes } from "@medusajs/types"
import { getStaticDataCacheOptions } from "./optimize-fetching"

export const listRegions = async () => {
  const cacheOptions = getStaticDataCacheOptions()

  return deduplicateRequest(
    "/store/regions",
    () => sdk.client
      .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
        method: "GET",
        next: cacheOptions.next,
      })
      .then(({ regions }) => regions)
      .catch(medusaError),
    undefined,
    60 * 1000 // 1 minute TTL
  )
}

export const retrieveRegion = async (id: string) => {
  const cacheOptions = getStaticDataCacheOptions()

  return deduplicateRequest(
    `/store/regions/${id}`,
    () => sdk.client
      .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
        method: "GET",
        next: cacheOptions.next,
      })
      .then(({ region }) => region)
      .catch(medusaError),
    undefined,
    60 * 1000 // 1 minute TTL
  )
}

// In-memory cache for regions by country code
const regionMap = new Map<string, HttpTypes.StoreRegion>()
// Timestamp to track when the in-memory cache was last refreshed
let regionCacheTimestamp = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour in milliseconds

// Store a promise for the ongoing fetch to avoid duplicate requests
let ongoingFetch: Promise<void> | null = null;

export const getRegion = async (countryCode: string) => {
  try {
    const now = Date.now();
    
    // If cache is stale or empty, refresh it
    if ((now - regionCacheTimestamp > CACHE_TTL || regionMap.size === 0) && !ongoingFetch) {
      // Create a fetch promise that updates the cache
      ongoingFetch = (async () => {
        try {
          const regions = await listRegions();
          
          if (regions) {
            // Clear existing cache
            regionMap.clear();
            
            // Populate cache with fresh data
            regions.forEach((region) => {
              region.countries?.forEach((c) => {
                regionMap.set(c?.iso_2 ?? "", region);
              });
            });
            
            // Update timestamp
            regionCacheTimestamp = now;
          }
        } finally {
          // Clear the ongoing fetch reference
          ongoingFetch = null;
        }
      })();
      
      // Wait for the fetch to complete
      await ongoingFetch;
    } else if (ongoingFetch) {
      // If there's an ongoing fetch, wait for it to complete
      await ongoingFetch;
    }

    // Get region from cache
    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("us");

    return region;
  } catch (e: any) {
    console.error("Error fetching region:", e);
    return null;
  }
}
