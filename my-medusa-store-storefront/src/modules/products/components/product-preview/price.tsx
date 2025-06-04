"use client"

import { Text } from "@medusajs/ui"

import { CalculatedVariant } from "@lib/util/get-product-price"
import { getRegion } from "@lib/data/regions"
import React, { useEffect, useState } from "react"
import { formatAmount } from "medusa-react"

export default function PreviewPrice({
  price,
}: {
  price: CalculatedVariant
}) {
  const [region, setRegion] = useState<any>(null)

  useEffect(() => {
    const fetchRegion = async () => {
      const regionData = await getRegion('us')
      setRegion(regionData)
    }

    fetchRegion()
  }, [])

  if (!region) {
    return null
  }

  return (
    <div className="font-serif flex flex-col items-end">
      {price.price_type === "sale" && (
        <Text className="text-ui-fg-muted line-through text-small-regular">
          {formatAmount({
            amount: price.original_price,
            region: region,
          })}
        </Text>
      )}
      <Text className="text-luxury-gold font-medium text-base-regular">
        {formatAmount({
          amount: price.calculated_price,
          region: region,
        })}
      </Text>
    </div>
  )
}
