"use server"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { listTags } from "@lib/data/tags"
import ProductPreview from "@modules/products/components/product-preview"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

interface ProductsPageProps {
  params: {
    countryCode: string
  }
  searchParams: {
    sortBy?: SortOptions
    categories?: string
    tags?: string
    price_min?: string
    price_max?: string
  }
}

// Helper function to safely get product price
const getProductPrice = (product: HttpTypes.StoreProduct): number => {
  if (!product.variants || product.variants.length === 0) {
    return 0
  }
  
  return product.variants[0]?.calculated_price?.calculated_amount || 0
}

export default async function ProductsPage(props: ProductsPageProps) {
  const params = await props.params
  const countryCode = params.countryCode
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  // Get search params
  const { sortBy = "created_at", categories, tags, price_min, price_max } = props.searchParams

  // Build query params for product API
  const queryParams: Record<string, any> = {}
  
  // Add category filter
  if (categories) {
    queryParams.category_id = categories.split(",")
  }
  
  // Add tag filter
  if (tags) {
    queryParams.tags = tags.split(",")
  }
  
  // Add price range filter
  if (price_min || price_max) {
    queryParams.price = {}
    if (price_min) queryParams.price.gte = parseInt(price_min)
    if (price_max) queryParams.price.lte = parseInt(price_max)
  }

  // Fetch products with filters
  const {
    response: { products, count },
  } = await listProducts({
    regionId: region.id,
    queryParams,
  })
  
  // Sort products if needed
  let sortedProducts = [...products]
  if (sortBy) {
    if (sortBy === "price_asc") {
      sortedProducts.sort((a, b) => {
        return getProductPrice(a) - getProductPrice(b)
      })
    } else if (sortBy === "price_desc") {
      sortedProducts.sort((a, b) => {
        return getProductPrice(b) - getProductPrice(a)
      })
    } else if (sortBy === "created_at") {
      sortedProducts.sort((a, b) => {
        return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      })
    }
  }
  
  // Fetch categories for filtering
  const categories_list = await listCategories()
  
  // Fetch tags for filtering
  const tags_list = await listTags()
  
  // Calculate min and max prices for the price range filter
  const prices = products.map(product => getProductPrice(product)).filter(price => price > 0)
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000
  
  return (
    <div className="content-container py-12">
      <div className="flex flex-col">
        <h1 className="font-display text-4xl text-luxury-charcoal mb-2">
          Our Collection
        </h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-serif-regular text-luxury-charcoal/80 max-w-xl mb-12">
          Discover our handcrafted marble masterpieces, each one a testament to generations of 
          artisanal tradition and meticulous attention to detail.
        </p>
      </div>

      {/* Refinement list with advanced filtering */}
      <RefinementList 
        sortBy={sortBy}
        categories={categories_list}
        tags={tags_list}
        minPrice={minPrice}
        maxPrice={maxPrice}
        currencyCode={region.currency_code}
        productCount={count}
        region={region}
      />

      {count > 0 ? (
        <ul className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-x-8 gap-y-12">
          {sortedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center">
          <h2 className="font-display text-xl text-luxury-gold mb-4">No products found</h2>
          <p className="text-serif-regular text-luxury-charcoal/80 text-center max-w-lg">
            We're currently updating our collection. Please check back soon for our latest creations.
          </p>
        </div>
      )}
    </div>
  )
} 