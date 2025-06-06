"use client"

import { Text } from "@medusajs/ui"

import { CalculatedVariant } from "@lib/util/get-product-price"
import { getRegion } from "@lib/data/regions"
import React, { useEffect, useState } from "react"
import { formatAmount } from "medusa-react"

export default function PreviewPrice({
  price,
  regionCode = "us"
}: {
  price: CalculatedVariant
  regionCode?: string
}) {
  const [region, setRegion] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRegion = async () => {
      try {
        setIsLoading(true)
        const regionData = await getRegion(regionCode)
        setRegion(regionData)
      } catch (error) {
        console.error("Error fetching region:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRegion()
  }, [regionCode])

  if (isLoading || !region) {
    return <div className="font-serif text-luxury-gold font-medium text-base-regular">Loading...</div>
  }

  // Ensure we have valid numbers to prevent NaN
  const calculatedPrice = typeof price.calculated_price === 'number' ? price.calculated_price : 0
  const originalPrice = typeof price.original_price === 'number' ? price.original_price : 0

  return (
    <div className="font-serif flex flex-col items-end">
      {price.price_type === "sale" && originalPrice > 0 && (
        <Text className="text-ui-fg-muted line-through text-small-regular">
          {formatAmount({
            amount: originalPrice,
            region: region,
          })}
        </Text>
      )}
      <Text className="text-luxury-gold font-medium text-base-regular">
        {calculatedPrice > 0 ? formatAmount({
          amount: calculatedPrice,
          region: region,
        }) : "Price unavailable"}
      </Text>
    </div>
  )
}
