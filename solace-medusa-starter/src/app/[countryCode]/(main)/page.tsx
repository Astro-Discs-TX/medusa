import { Suspense } from 'react'
import { Metadata } from 'next'

import { getCollectionsList, getCollectionsWithProducts } from '@lib/data/collections'
import {
  getHeroBannerData,
  getExploreBlogData,
  getMidBannerData,
  getCollectionsData
} from '@lib/data/fetch'
import { getProductsList } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import { Banner } from '@modules/home/components/banner'
import Collections from '@modules/home/components/collections'
import { ExploreBlog } from '@modules/home/components/explore-blog'
import Hero from '@modules/home/components/hero'
import { ProductCarousel } from '@modules/products/components/product-carousel'
import SkeletonProductsCarousel from '@modules/skeletons/templates/skeleton-products-carousel'
import DebugPanel from '@modules/home/components/debug-panel'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Discover a marketplace for sustainable technology. Find eco-friendly gadgets and sustainable electronics.',
}

// Simple error component to show diagnostic information
function DiagnosticError({ error, details }: { error: string, details?: Record<string, any> }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Page</h2>
      <p className="mb-4">{error}</p>
      {details && (
        <div className="bg-gray-100 p-4 rounded text-left max-w-lg overflow-auto">
          <h3 className="font-semibold mb-2">Diagnostic Information:</h3>
          <pre className="text-xs">{JSON.stringify(details, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  try {
    // Get region data first
    const region = await getRegion(countryCode)
    
    if (!region) {
      throw new Error("Region not found")
    }

    const regionData = {
      regionId: region.id,
      currencyCode: region.currency_code,
    }

    // Get collections and products
    const [{ collections }, productsData] = await Promise.all([
      getCollectionsList(),
      getProductsList({ countryCode }),
    ])

    const { products } = productsData.response

    // Try to get the CMS data, but don't fail if it's not available
    let heroBanner, midBanner, posts, collectionsData;
    try {
      const [heroBannerData, midBannerData, blogData, cmsCollectionsData] = await Promise.all([
        getHeroBannerData().catch(() => null),
        getMidBannerData().catch(() => null),
        getExploreBlogData().catch(() => null),
        getCollectionsData().catch(() => null)
      ]);
      
      heroBanner = heroBannerData?.data?.HeroBanner;
      midBanner = midBannerData?.data?.MidBanner;
      posts = blogData?.data || [];
      collectionsData = cmsCollectionsData;
    } catch (error) {
      console.error('Error fetching CMS data:', error);
      // Continue without CMS data
    }

    return (
      <>
        {heroBanner && <Banner data={heroBanner} />}
        {heroBanner && <Hero data={heroBanner} />}
        <Suspense fallback={<SkeletonProductsCarousel />}>
          {products.length > 0 && (
            <ProductCarousel
              products={products}
              title="Latest Products"
              regionId={region.id}
            />
          )}
        </Suspense>
        {collectionsData && collections && (
          <Collections 
            cmsCollections={collectionsData}
            medusaCollections={collections} 
          />
        )}
        {midBanner && <Banner data={midBanner} />}
        {posts && posts.length > 0 && <ExploreBlog posts={posts} />}
        
        {/* Debug panel */}
        <DebugPanel region={region} products={products} />
      </>
    )
  } catch (error) {
    console.error('Error loading homepage:', error);
    return (
      <DiagnosticError 
        error={error instanceof Error ? error.message : "Failed to load page content"}
        details={{
          countryCode,
          environment: {
            BACKEND_URL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
            API_KEY_PREVIEW: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ? 
              `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY.substring(0, 6)}...` : 
              "Not set",
            STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || "Not set"
          }
        }}
      />
    );
  }
}
