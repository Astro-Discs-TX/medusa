import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { storeSortOptions } from '@lib/constants'
import { getProductsList, getStoreFilters } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import { Box } from '@modules/common/components/box'
import { Container } from '@modules/common/components/container'
import DebugPanel from '@modules/common/components/debug-panel'
import RefinementList from '@modules/common/components/sort'
import { Text } from '@modules/common/components/text'
import { ProductCarousel } from '@modules/products/components/product-carousel'
import { search } from '@modules/search/actions'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import SkeletonProductsCarousel from '@modules/skeletons/templates/skeleton-products-carousel'
import { ProductFilters as ProductFiltersType } from 'types/global'

import ProductFilters from '../components/filters'
import ActiveProductFilters from '../components/filters/active-filters'
import ProductFiltersDrawer from '../components/filters/filters-drawer'
import PaginatedProducts from './paginated-products'

export const runtime = 'edge'

// Default filters structure when API fails
const DEFAULT_FILTERS: ProductFiltersType = {
  collection: [],
  type: [],
  material: []
}

export default async function StoreTemplate({
  searchParams,
  params,
}: {
  searchParams: Record<string, string>
  params?: { countryCode?: string }
}) {
  const { countryCode } = await params
  const { sortBy, page, collection, type, material, price } = await searchParams
  const region = await getRegion(countryCode)

  if (!region) {
    return notFound()
  }

  const pageNumber = page ? parseInt(page) : 1
  
  // Get filters with fallback
  let filters: ProductFiltersType = DEFAULT_FILTERS;
  try {
    const fetchedFilters = await getStoreFilters();
    if (fetchedFilters && 'attributes' in fetchedFilters) {
      // Convert API response to expected format if needed
      // This is a simplified conversion - adjust based on actual API response
      const collections = fetchedFilters.attributes.find(attr => attr.id === 'collection')?.values || [];
      const types = fetchedFilters.attributes.find(attr => attr.id === 'type')?.values || [];
      const materials = fetchedFilters.attributes.find(attr => attr.id === 'material')?.values || [];
      
      filters = {
        collection: collections,
        type: types,
        material: materials
      };
    }
  } catch (error) {
    console.error("Failed to fetch store filters:", error);
    // Use default filters
  }

  // Get search results with error handling
  let results = [], count = 0;
  try {
    const searchResults = await search({
      currency_code: region.currency_code,
      order: sortBy,
      page: pageNumber,
      collection: collection?.split(','),
      type: type?.split(','),
      material: material?.split(','),
      price: price?.split(','),
    });
    results = searchResults.results || [];
    count = searchResults.count || 0;
  } catch (error) {
    console.error("Failed to search products:", error);
  }

  // Get recommended products with error handling
  let recommendedProducts = [];
  try {
    const productsResponse = await getProductsList({
      pageParam: 0,
      queryParams: { limit: 9 },
      countryCode: countryCode,
    }).then(({ response }) => response);
    recommendedProducts = productsResponse.products || [];
  } catch (error) {
    console.error("Failed to fetch recommended products:", error);
  }

  // Prepare debug data
  const debugData = {
    region,
    filters,
    searchResults: {
      count,
      resultsCount: results.length,
      resultsPreview: results.slice(0, 2).map(p => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
        variantsCount: p.variants?.length || 0
      }))
    },
    recommendedProducts: {
      count: recommendedProducts.length,
      preview: recommendedProducts.slice(0, 2).map(p => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
        variantsCount: p.variants?.length || 0
      }))
    }
  };

  return (
    <>
      <Container className="flex flex-col gap-8 !pb-8 !pt-4">
        <Box className="flex flex-col gap-4">
          <Text className="text-md text-secondary">
            {count === 1 ? `${count} product` : `${count} products`}
          </Text>
          <Box className="grid w-full grid-cols-2 items-center justify-between gap-2 small:flex small:flex-wrap">
            <Box className="hidden small:flex">
              <ProductFilters filters={filters} />
            </Box>
            <ProductFiltersDrawer>
              <ProductFilters filters={filters} />
            </ProductFiltersDrawer>
            <RefinementList
              options={storeSortOptions}
              sortBy={sortBy || 'relevance'}
            />
          </Box>
        </Box>
        <ActiveProductFilters countryCode={countryCode} filters={filters} />
        <Suspense fallback={<SkeletonProductGrid />}>
          {results && results.length > 0 ? (
            <PaginatedProducts
              products={results}
              page={pageNumber}
              total={count}
              countryCode={countryCode}
            />
          ) : (
            <p className="py-10 text-center text-lg text-secondary">
              No products found. Try adjusting your filters.
            </p>
          )}
        </Suspense>
      </Container>
      {recommendedProducts.length > 0 && (
        <Suspense fallback={<SkeletonProductsCarousel />}>
          <ProductCarousel
            products={recommendedProducts}
            regionId={region.id}
            title="Recommended products"
          />
        </Suspense>
      )}
      
      {/* Debug Panel */}
      <DebugPanel data={debugData} title="Product Data Debug" />
    </>
  )
}
