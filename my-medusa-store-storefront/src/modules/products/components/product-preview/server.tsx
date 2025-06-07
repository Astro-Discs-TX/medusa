"use server"

import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import ProductPreviewClient from "./index"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // Fetch the product with complete pricing information
  const { response } = await listProducts({
    regionId: region.id,
    queryParams: { id: [product.id!] },
  })

  const pricedProduct = response.products[0]

  if (!pricedProduct) {
    return null
  }

  return (
    <ProductPreviewClient 
      product={pricedProduct} 
      isFeatured={isFeatured} 
      region={region} 
    />
  )
} 