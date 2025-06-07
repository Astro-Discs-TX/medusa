"use server"

import { Heading } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview/server"
import ScrollReveal from "@modules/common/components/scroll-reveal"

export default async function FeaturedProducts({ countryCode }: { countryCode: string }) {
  // Fetch region
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Fetch featured products - we can add a tag or collection filter here
  const { response } = await listProducts({
    countryCode,
    queryParams: {
      limit: 4,
      // You can uncomment this to filter by a specific tag or collection
      // tags: ["featured"],
    },
  })

  const { products } = response

  return (
    <div className="max-w-7xl mx-auto px-4">
      <ScrollReveal>
        <Heading level="h2" className="text-3xl md:text-4xl mb-12 text-center">
          Featured Products
        </Heading>
      </ScrollReveal>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ScrollReveal key={product.id} delay={0.1}>
            <ProductPreview product={product} region={region} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
} 