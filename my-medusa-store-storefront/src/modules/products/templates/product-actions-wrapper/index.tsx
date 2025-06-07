import { listProducts } from "@lib/data/products"
import { fetchWithTimeout } from "@lib/util/parallel-fetch"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
}: {
  id: string
  region: HttpTypes.StoreRegion
}) {
  try {
    const product = await fetchWithTimeout(
      async () => {
        const result = await listProducts({
          queryParams: { id: [id] },
          regionId: region.id,
        })
        return result.response.products[0]
      },
      5000, // 5 second timeout
      null
    )

    if (!product) {
      // Return a fallback UI if the product data couldn't be fetched
      return (
        <div className="p-4 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-500">Product information could not be loaded. Please try again later.</p>
        </div>
      )
    }

    return <ProductActions product={product} region={region} />
  } catch (error) {
    console.error("Error loading product actions:", error)
    
    // Return a fallback UI on error
    return (
      <div className="p-4 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-500">Product information could not be loaded. Please try again later.</p>
      </div>
    )
  }
}
