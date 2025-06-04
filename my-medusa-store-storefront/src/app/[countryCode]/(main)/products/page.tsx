"use server"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { notFound } from "next/navigation"

interface ProductsPageProps {
  params: {
    countryCode: string
  }
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const {
    response: { products, count },
  } = await listProducts({
    regionId: region.id,
  })

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

      {count > 0 ? (
        <ul className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-x-8 gap-y-12">
          {products.map((product) => (
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