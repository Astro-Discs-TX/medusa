import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import { parallelFetch } from "@lib/util/parallel-fetch"
import ProductTemplate from "@modules/products/templates"
import { Suspense } from "react"
import SkeletonProductPage from "@modules/skeletons/templates/skeleton-product-page"

type Props = {
  params: { countryCode: string; handle: string }
}

// Set dynamic rendering options for this page
export const dynamic = "force-static" // Force static generation
export const revalidate = 60 * 5 // Revalidate every 5 minutes

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    // For each country, fetch product handles in parallel
    const countryProducts = await Promise.all(
      countryCodes.map(async (country) => {
        const { response } = await listProducts({
          countryCode: country,
          queryParams: { limit: 100, fields: "handle" },
        })

        return {
          country,
          products: response.products,
        }
      })
    )

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle, countryCode } = params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Marble Luxe`,
    description: product.description?.substring(0, 160) || `Discover the exquisite ${product.title}, a handcrafted marble piece from our luxury collection.`,
    openGraph: {
      title: `${product.title} | Marble Luxe`,
      description: product.description?.substring(0, 160) || `Discover the exquisite ${product.title}, a handcrafted marble piece from our luxury collection.`,
      images: product.thumbnail ? [product.thumbnail] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { countryCode, handle } = params
  
  // Fetch region and product data in parallel
  const [region, productData] = await parallelFetch([
    () => getRegion(countryCode),
    () => listProducts({
      countryCode: countryCode,
      queryParams: { handle: handle },
    })
  ])

  if (!region) {
    notFound()
  }

  const pricedProduct = productData.response.products[0]

  if (!pricedProduct) {
    notFound()
  }

  return (
    <Suspense fallback={<SkeletonProductPage />}>
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={countryCode}
      />
    </Suspense>
  )
}
