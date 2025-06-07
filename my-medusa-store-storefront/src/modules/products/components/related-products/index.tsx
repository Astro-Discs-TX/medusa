import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { batchFetch } from "@lib/util/batch-fetch"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "../../components/product-preview/server"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  // Prepare query params for product fetch
  const prepareQueryParams = (regionId: string) => {
    const queryParams: Record<string, any> = {}
    
    queryParams.region_id = regionId
    
    if (product.collection_id) {
      queryParams.collection_id = [product.collection_id]
    }
    
    if (product.tags) {
      queryParams.tags = product.tags
        .map((t) => t.id)
        .filter(Boolean) as string[]
    }
    
    queryParams.is_giftcard = false
    return queryParams
  }

  // Use batchFetch to fetch region data
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
    return null
  }

  const queryParams = prepareQueryParams(region.id)

  // Fetch products after we have the region
  const productsResponse = await listProducts({
    queryParams,
    regionId: region.id,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  if (!productsResponse.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular text-gray-600 mb-6">
          Related products
        </span>
        <p className="text-2xl-regular text-ui-fg-base max-w-lg">
          You might also want to check out these products.
        </p>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {productsResponse.map((product) => (
          <li key={product.id}>
            <ProductPreview region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
