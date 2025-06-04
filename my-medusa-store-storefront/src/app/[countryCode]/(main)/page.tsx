"use server"

import { redirect } from "next/navigation"
import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import TestimonialSection from "@modules/home/components/testimonial-section"
import CraftmanshipSection from "@modules/home/components/craftmanship-section"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Marble Luxe - Fine Marble Handicrafts",
  description:
    "Discover exquisite handcrafted marble artifacts. Each piece is meticulously crafted by master artisans.",
}

export default async function MainRedirect(props: {
  params: { countryCode: string }
}) {
  const { countryCode } = props.params
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Redirect to the home page outside of the (main) route group
  redirect(`/${countryCode}`)
}
