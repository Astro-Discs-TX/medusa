import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink 
      href={`/products/${product.handle}`} 
      className="group block relative luxury-image-hover"
    >
      <div data-testid="product-wrapper" className="overflow-hidden">
        <div className="relative">
          {/* Product thumbnail */}
          <div className="w-full h-full overflow-hidden">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
              className="transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          
          {/* Gold gradient overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
            background: 'linear-gradient(to bottom, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.25))'
          }}></div>
          
          {/* "View Details" text appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 transform translate-y-4 group-hover:translate-y-0">
            <span className="bg-luxury-ivory/90 border border-luxury-gold px-5 py-2 text-luxury-charcoal text-small-semi uppercase tracking-wider">
              View Details
            </span>
          </div>
          
          {/* Product tag - if on sale */}
          {cheapestPrice?.price_type === "sale" && (
            <div className="absolute top-4 right-4 z-10">
              <span className="bg-luxury-gold px-3 py-1 text-luxury-ivory text-[10px] uppercase tracking-wider font-medium">
                Sale
              </span>
            </div>
          )}
          
          {/* Handcrafted tag */}
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-luxury-ivory/90 border border-luxury-gold/50 px-3 py-1 text-luxury-charcoal text-[10px] uppercase tracking-wider font-medium">
              Handcrafted
            </span>
          </div>
        </div>
        
        <div className="mt-6 pb-2 px-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display text-lg group-hover:text-luxury-gold transition-colors duration-300 pr-4" data-testid="product-title">
              {product.title}
            </h3>
            
            <div className="flex items-center">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
          
          <div className="flex justify-between items-end">
            <p className="text-serif-italic text-sm text-luxury-charcoal/70 max-w-[75%]">
              {product.description?.substring(0, 50)?.split(' ').slice(0, 6).join(' ')}
              {product.description && product.description.length > 50 ? '...' : ''}
            </p>
            
            <div className="w-8 h-8 rounded-full border border-luxury-gold/30 flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-45">
              <svg className="w-4 h-4 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </div>
          </div>
          
          {/* Decorative line */}
          <div className="w-12 h-px bg-luxury-gold mt-4 group-hover:w-full transition-all duration-500"></div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
