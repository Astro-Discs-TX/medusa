"use server"

import { redirect } from "next/navigation"
import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import Collections from "@modules/home/components/collections"
import Craftsmanship from "@modules/home/components/craftsmanship"
import Testimonials from "@modules/home/components/testimonials"
import Newsletter from "@modules/home/components/newsletter"
import { Suspense } from "react"
import FeaturedProductsSkeleton from "@modules/skeletons/components/featured-products-skeleton"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Marble Luxe - Fine Marble Handicrafts",
  description:
    "Discover exquisite handcrafted marble artifacts. Each piece is meticulously crafted by master artisans.",
}

// Set dynamic rendering options for this page
export const dynamic = "force-static" // Force static generation
export const revalidate = 60 * 60 // Revalidate every hour

export default async function Home(props: {
  params: { countryCode: string }
}) {
  const { countryCode } = props.params
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProducts countryCode={countryCode} />
        </Suspense>
      </section>
      
      {/* Collections Section */}
      <Collections />
      
      {/* Craftsmanship Section */}
      <Craftsmanship />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Newsletter Section */}
      <Newsletter />
    </div>
  )
}
