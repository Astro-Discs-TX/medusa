import { safeDecodeURIComponent } from '@lib/util/safe-decode-uri'
import { SearchedProducts } from 'types/global'

export const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
export const PUBLISHABLE_API_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export const PRODUCT_LIMIT = 12

type SearchParams = {
  currency_code: string
  page?: number
  order?: string
  category_id?: string
  collection?: string[]
  type?: string[]
  material?: string[]
  price?: string[]
  query?: string
}

export async function search({
  currency_code,
  page,
  order = 'relevance',
  category_id,
  collection,
  type,
  material,
  price,
  query,
}: SearchParams): Promise<SearchedProducts> {
  try {
    const sortBy =
      order === 'price_asc'
        ? 'calculated_price'
        : order === 'price_desc'
          ? '-calculated_price'
          : order === 'created_at'
            ? '-created_at'
            : order

    const searchParams = new URLSearchParams({
      currency_code,
      order: sortBy,
      offset: ((page ? page - 1 : 0) * PRODUCT_LIMIT).toString(),
      limit: PRODUCT_LIMIT.toString(),
    })

    if (category_id) {
      searchParams.append('category_id[]', category_id)
    }

    if (collection && Array.isArray(collection)) {
      collection.forEach((id) => {
        searchParams.append('collection_id[]', id)
      })
    }

    if (type && Array.isArray(type)) {
      type.forEach((id) => {
        searchParams.append('type_id[]', id)
      })
    }

    if (material && Array.isArray(material)) {
      material.forEach((id) => {
        searchParams.append('materials[]', id)
      })
    }

    if (price && Array.isArray(price)) {
      price.forEach((range) => {
        switch (range) {
          case 'under-100':
            searchParams.append('price_to', '100')
            break
          case '100-500':
            searchParams.append('price_from', '100')
            searchParams.append('price_to', '500')
            break
          case '501-1000':
            searchParams.append('price_from', '501')
            searchParams.append('price_to', '1000')
            break
          case 'more-than-1000':
            searchParams.append('price_from', '1000')
            break
        }
      })
    }

    if (query) {
      searchParams.append('q', safeDecodeURIComponent(query))
    }
    
    const apiUrl = `${BACKEND_URL}/store/search?${searchParams.toString()}`;
    console.log(`DEBUG SEARCH - API URL: ${apiUrl}`);
    console.log(`DEBUG SEARCH - Headers: ${JSON.stringify({
      'x-publishable-api-key': PUBLISHABLE_API_KEY!,
    })}`);

    const response = await fetch(
      apiUrl,
      {
        headers: {
          'x-publishable-api-key': PUBLISHABLE_API_KEY!,
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      console.error(`Search API error. Status: ${response.status}`);
      return {
        results: [],
        count: 0,
      }
    }

    const data = await response.json()
    console.log(`DEBUG SEARCH - Response data: ${JSON.stringify({
      count: data.count || 0,
      productCount: data.products?.length || 0,
      productIds: data.products?.slice(0, 3).map(p => p.id) || [] // Show first 3 product IDs
    }, null, 2)}`);

    return {
      results: data.products || [],
      count: data.count || 0,
    }
  } catch (error) {
    console.error('Error during search:', error);
    return {
      results: [],
      count: 0,
    }
  }
}
