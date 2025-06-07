"use server"

import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { batchFetch } from "@lib/util/batch-fetch"
import ProductPreview from "@modules/products/components/product-preview/server"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import ProductListSkeleton from "@modules/skeletons/components/product-list-skeleton"
import { Suspense } from "react"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

// Pre-fetch data outside of the component
async function fetchProductData(
  countryCode: string,
  page: number,
  queryParams: PaginatedProductsParams,
  sortBy?: SortOptions
) {
  // Fetch region using batchFetch
  const responses = await batchFetch([
    {
      path: `/store/regions`,
      cacheTags: ["regions"],
      cacheRevalidate: 60
    }
  ])

  const regionResponse = (responses[0].data as any)
  const regions = regionResponse?.regions || []
  const region = regions.find((r: any) => r.countries.some((c: any) => c.iso_2 === countryCode))
  
  if (!region) {
    return { region: null, productsData: { response: { products: [], count: 0 }, nextPage: null } }
  }
  
  // Now use the region to fetch products
  const productsData = await listProductsWithSort({
    page,
    queryParams: {
      ...queryParams,
      region_id: region.id
    },
    sortBy,
    countryCode,
  })
  
  return { region, productsData }
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  // Fetch data using optimized function
  const { region, productsData } = await fetchProductData(
    countryCode, 
    page, 
    queryParams, 
    sortBy
  )

  if (!region) {
    return null
  }

  const { response: { products, count } } = productsData
  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <Suspense fallback={<ProductListSkeleton count={PRODUCT_LIMIT} />}>
        <ul
          className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
          data-testid="products-list"
        >
          {products.map((p) => {
            return (
              <li key={p.id}>
                <ProductPreview product={p} region={region} />
              </li>
            )
          })}
        </ul>
      </Suspense>
      
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
