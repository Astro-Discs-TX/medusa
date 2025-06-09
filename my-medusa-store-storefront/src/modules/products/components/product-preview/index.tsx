"use client"

import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default function ProductPreviewClient({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // The product should already have price data from the server component
  // Get the cheapest price from all variants
  const { cheapestPrice } = getProductPrice({
    product,
  })
  
  // Check for product tags to display appropriate badges
  const isLimitedEdition = product.tags?.some(tag => 
    tag.value?.toLowerCase().includes("limited") || 
    tag.value?.toLowerCase().includes("edition")
  )
  
  const isHandcrafted = true // All our products are handcrafted

  return (
    <LocalizedClientLink 
      href={`/products/${product.handle}`} 
      className="group block relative luxury-image-hover"
      aria-label={`View ${product.title}`}
    >
      <div data-testid="product-wrapper" className="overflow-hidden rounded-sm border border-luxury-gold/10 bg-luxury-ivory/10 transition-all duration-300 group-hover:shadow-md group-hover:border-luxury-gold/30 group-hover:-translate-y-1">
        <div className="relative">
          {/* Product thumbnail - slightly reduced in height */}
          <div className="w-full overflow-hidden relative" style={{ height: '320px' }}>
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
              className="transition-transform duration-700 group-hover:scale-110 object-cover w-full h-full"
            />
          </div>
          
          {/* Gold gradient overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
            background: 'linear-gradient(to bottom, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.3))'
          }}></div>
          
          {/* "View Details" button appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 transform translate-y-4 group-hover:translate-y-0">
            <span className="bg-luxury-ivory/95 border border-luxury-gold px-6 py-2.5 text-luxury-charcoal text-small-semi uppercase tracking-wider hover:bg-luxury-gold hover:text-luxury-ivory transition-colors duration-300 shadow-sm">
              View Details
            </span>
          </div>
          
          {/* Product badges container */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {/* Handcrafted badge */}
            {isHandcrafted && (
              <div className="badge-container">
                <span className="bg-luxury-ivory/95 border border-luxury-gold/60 px-3 py-1.5 text-luxury-charcoal text-[10px] uppercase tracking-wider font-medium flex items-center">
                  <svg className="w-3 h-3 mr-1.5 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"></path>
                  </svg>
                  Handcrafted
                </span>
              </div>
            )}
            
            {/* Limited Edition badge */}
            {isLimitedEdition && (
              <div className="badge-container">
                <span className="bg-luxury-gold/90 px-3 py-1.5 text-luxury-ivory text-[10px] uppercase tracking-wider font-medium flex items-center">
                  <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                  Limited Edition
                </span>
              </div>
            )}
          </div>
          
          {/* Sale badge */}
          {cheapestPrice?.price_type === "sale" && (
            <div className="absolute top-4 right-4 z-10">
              <span className="bg-luxury-gold/90 px-3 py-1.5 text-luxury-ivory text-[10px] uppercase tracking-wider font-medium flex items-center">
                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Sale
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4 pb-4 px-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display text-lg text-luxury-charcoal group-hover:text-luxury-gold transition-colors duration-300 pr-4" data-testid="product-title">
              {product.title}
            </h3>
            
            <div className="flex items-center">
              {cheapestPrice && (
                <Text className="text-luxury-gold font-medium text-base-regular">
                  {cheapestPrice.calculated_price}
                </Text>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-end">
            <p className="text-serif-italic text-sm text-luxury-charcoal/70 max-w-[75%]">
              {product.description?.substring(0, 60)?.split(' ').slice(0, 7).join(' ')}
              {product.description && product.description.length > 60 ? '...' : ''}
            </p>
            
            <div className="w-8 h-8 rounded-full border border-luxury-gold/30 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:border-luxury-gold group-hover:bg-luxury-cream/20">
              <svg className="w-4 h-4 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </div>
          </div>
          
          {/* Decorative underline that animates on hover */}
          <div className="h-px bg-luxury-gold/30 mt-4 w-0 group-hover:w-full transition-all duration-700 ease-in-out"></div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
