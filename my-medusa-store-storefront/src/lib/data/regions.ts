"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"

export const listRegions = async () => {
  const next = {
    revalidate: 60 * 60, // Revalidate every hour (regions change infrequently)
    tags: ['regions'], // Tag for cache invalidation
  }

  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    revalidate: 60 * 60, // Revalidate every hour
    tags: ['regions', `region-${id}`], // Tags for cache invalidation
  }

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

// In-memory cache for regions by country code
const regionMap = new Map<string, HttpTypes.StoreRegion>()
// Timestamp to track when the in-memory cache was last refreshed
let regionCacheTimestamp = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour in milliseconds

export const getRegion = async (countryCode: string) => {
  try {
    const now = Date.now();
    
    // If cache is stale or empty, refresh it
    if (now - regionCacheTimestamp > CACHE_TTL || regionMap.size === 0) {
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
