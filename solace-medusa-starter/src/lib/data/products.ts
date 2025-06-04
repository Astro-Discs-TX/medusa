import { unstable_noStore as noStore } from 'next/cache'

import { sdk } from '@lib/config'
import { HttpTypes } from '@medusajs/types'
import { BACKEND_URL, PUBLISHABLE_API_KEY } from '@modules/search/actions'
import { ProductFilters } from 'types/global'

import { getRegion } from './regions'

export const getProductsById = async function ({
  ids,
  regionId,
}: {
  ids: string[]
  regionId: string
}) {
  return sdk.store.product
    .list(
      {
        id: ids,
        region_id: regionId,
        fields:
          '*variants.calculated_price,+variants.inventory_quantity,*variants,*variants.prices,*categories,+metadata',
      },
      { next: { tags: ['products'] } }
    )
    .then(({ products }) => products)
}

export const getProductByHandle = async function (
  handle: string,
  regionId: string
) {
  return sdk.store.product
    .list(
      {
        handle,
        region_id: regionId,
        fields:
          '*variants.calculated_price,+variants.inventory_quantity,*variants,*variants.prices,*categories,+metadata',
      },
      { next: { tags: ['products'] } }
    )
    .then(({ products }) => products[0])
}

export const getProductsList = async function ({
  pageParam = 1,
  queryParams,
  countryCode,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> {
  noStore()

  const limit = queryParams?.limit || 12
  const offset = Math.max(0, (pageParam - 1) * limit)
  
  try {
    const region = await getRegion(countryCode)

    console.log("DEBUG - Region data:", JSON.stringify(region, null, 2))

    if (!region) {
      console.log("DEBUG - No region found for countryCode:", countryCode)
      return {
        response: { products: [], count: 0 },
        nextPage: null,
      }
    }
    
    console.log(`DEBUG - Fetching products with regionId: ${region.id}, limit: ${limit}, offset: ${offset}`)
    
    // Single attempt without sales channel ID
    const response = await sdk.store.product.list(
      {
        limit,
        offset,
        region_id: region.id,
        fields:
          '*variants.calculated_price,+variants.inventory_quantity,*variants,*variants.prices',
        ...queryParams,
      },
      { next: { tags: ['products'] } }
    )
    
    console.log(`DEBUG - Raw API response:`, JSON.stringify({
      count: response.count,
      productCount: response.products?.length || 0,
      productIds: response.products?.map(p => p.id) || []
    }, null, 2))
    
    const { products } = response
    
    if (!products) {
      console.log("DEBUG - No products returned from API")
      return {
        response: { products: [], count: 0 },
        nextPage: null,
        queryParams,
      }
    }
    
    // Show all products regardless of inventory
    const filteredProducts = products;

    console.log(`DEBUG - After filtering: ${filteredProducts.length} products (from original ${products.length})`)
    console.log("DEBUG - Products data:", JSON.stringify(filteredProducts.map(p => ({
      id: p.id,
      title: p.title,
      variants: p.variants.map(v => ({
        id: v.id,
        title: v.title,
        inventory: v.inventory_quantity
      }))
    })), null, 2));

    const filteredCount = filteredProducts.length
    const nextPage = filteredCount > offset + limit ? pageParam + 1 : null

    return {
      response: {
        products: filteredProducts,
        count: filteredCount,
      },
      nextPage: nextPage,
      queryParams,
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    
    // Try to fetch products without specifying region as a fallback
    try {
      console.log("DEBUG - Attempting to fetch products without region");
      
      const response = await sdk.store.product.list(
        {
          limit,
          offset,
          fields: '*variants.calculated_price,+variants.inventory_quantity,*variants,*variants.prices',
          ...queryParams,
        },
        { next: { tags: ['products'] } }
      );
      
      const { products } = response;
      
      if (!products || products.length === 0) {
        console.log("DEBUG - No products returned from fallback API call");
        return {
          response: { products: [], count: 0 },
          nextPage: null,
          queryParams,
        };
      }
      
      const filteredProducts = products;
      const filteredCount = filteredProducts.length;
      const nextPage = filteredCount > offset + limit ? pageParam + 1 : null;
      
      return {
        response: {
          products: filteredProducts,
          count: filteredCount,
        },
        nextPage: nextPage,
        queryParams,
      };
    } catch (fallbackError) {
      console.error("Fallback product fetch also failed:", fallbackError);
      return {
        response: { products: [], count: 0 },
        nextPage: null,
        queryParams,
      };
    }
  }
}

export const getProductsListByCollectionId = async function ({
  collectionId,
  countryCode,
  excludeProductId,
  limit = 12,
  offset = 0,
}: {
  collectionId: string
  countryCode: string
  excludeProductId?: string
  limit?: number
  offset?: number
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
}> {
  const region = await getRegion(countryCode)

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  return sdk.store.product
    .list(
      {
        limit,
        offset,
        collection_id: [collectionId],
        region_id: region.id,
        fields:
          '*variants.calculated_price,+variants.inventory_quantity,*variants,*variants.prices',
      },
      { next: { tags: ['products'] } }
    )
    .then(({ products, count }) => {
      if (excludeProductId) {
        products = products.filter((product) => product.id !== excludeProductId)
      }

      const nextPage = count > offset + limit ? offset + limit : null

      return {
        response: {
          products,
          count,
        },
        nextPage,
      }
    })
    .catch(error => {
      console.error("Error fetching products by collection:", error);
      return {
        response: { products: [], count: 0 },
        nextPage: null,
      }
    })
}

export const getStoreFilters = async function () {
  try {
    const response = await fetch(
      `${BACKEND_URL}/store/filter-product-attributes`,
      {
        headers: {
          'x-publishable-api-key': PUBLISHABLE_API_KEY!,
        },
        next: {
          revalidate: 3600,
        },
      }
    );

    // Check if response is OK before parsing JSON
    if (!response.ok) {
      console.error(`Failed to fetch store filters. Status: ${response.status}`);
      return { attributes: [] };
    }

    // Try to parse the response as JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Expected JSON response but got:', contentType);
      return { attributes: [] };
    }

    const filters: ProductFilters = await response.json();
    return filters;
  } catch (error) {
    console.error('Error fetching store filters:', error);
    // Return a default empty filter structure
    return { attributes: [] };
  }
}
