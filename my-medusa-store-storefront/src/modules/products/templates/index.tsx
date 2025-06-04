import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div
        className="content-container py-12"
        data-testid="product-container"
      >
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-1">
            <ImageGallery images={product?.images || []} />
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-4">
              <h1 className="font-display text-3xl text-luxury-charcoal">{product.title}</h1>
              <div className="h-px w-16 bg-luxury-gold"></div>
              <p className="text-serif-regular text-luxury-charcoal/80">{product.description}</p>
              
              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
              
              <div className="mt-8">
                <ProductTabs product={product} />
              </div>
              
              <div className="mt-8">
                <ProductInfo product={product} />
              </div>
              
              <ProductOnboardingCta />
            </div>
          </div>
        </div>
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <div className="mb-8">
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">You May Also Like</h2>
          <div className="h-px w-20 bg-luxury-gold"></div>
        </div>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
