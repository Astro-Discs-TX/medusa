"use server"

import { redirect } from "next/navigation"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import TestimonialSection from "@modules/home/components/testimonial-section"
import CraftmanshipSection from "@modules/home/components/craftmanship-section"

interface HomePageProps {
  params: {
    countryCode: string
  }
}

export default async function Home({ params }: HomePageProps) {
  const region = await getRegion(params.countryCode)

  if (!region) {
    return null
  }

  const { collections } = await listCollections()

  return (
    <>
      <Hero />
      <FeaturedProducts collections={collections} region={region} />
      <TestimonialSection />
      <CraftmanshipSection />
    </>
  )
} 