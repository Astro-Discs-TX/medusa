"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { deduplicateRequest } from "@lib/util/request-cache"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams = {},
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams & {
    category_id?: string | string[]
    tags?: string | string[]
    price?: { gte?: number; lte?: number }
  }
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = (_pageParam === 1) ? 0 : (_pageParam - 1) * limit;

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    revalidate: 60,
    tags: ['products'],
  }

  // Process query parameters
  const processedQueryParams: Record<string, any> = {
    limit,
    offset,
    region_id: region?.id,
    fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
    ...queryParams,
  }

  // Process category filter
  if (queryParams.category_id) {
    processedQueryParams.category_id = Array.isArray(queryParams.category_id) 
      ? queryParams.category_id 
      : [queryParams.category_id]
  }

  // Process tag filter
  if (queryParams.tags) {
    processedQueryParams.tags = Array.isArray(queryParams.tags) 
      ? queryParams.tags 
      : [queryParams.tags]
  }

  // Process price filter
  if (queryParams.price) {
    if (queryParams.price.gte !== undefined) {
      processedQueryParams.price_from = queryParams.price.gte
    }
    if (queryParams.price.lte !== undefined) {
      processedQueryParams.price_to = queryParams.price.lte
    }
    // Remove the original price object as it's not compatible with the API
    delete processedQueryParams.price
  }

  // Use request deduplication
  return await deduplicateRequest(
    `/store/products`,
    () => sdk.client
      .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
        `/store/products`,
        {
          method: "GET",
          query: processedQueryParams,
          headers,
          next,
          cache: "force-cache",
        }
      )
      .then(({ products, count }) => {
        const nextPage = count > offset + limit ? pageParam + 1 : null

        return {
          response: {
            products,
            count,
          },
          nextPage: nextPage,
          queryParams,
        }
      }),
    processedQueryParams,
    30 * 1000 // 30 seconds TTL
  )
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams & {
    category_id?: string | string[]
    tags?: string | string[]
    price?: { gte?: number; lte?: number }
  }
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}
