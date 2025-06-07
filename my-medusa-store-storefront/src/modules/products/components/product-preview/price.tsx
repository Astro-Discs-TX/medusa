"use client"

import { Text } from "@medusajs/ui"
import { CalculatedVariant } from "@lib/util/get-product-price"

export default function PreviewPrice({
  price,
}: {
  price: CalculatedVariant
}) {
  return (
    <div className="font-serif flex flex-col items-end">
      {price.price_type === "sale" && price.original_price && (
        <Text className="text-ui-fg-muted line-through text-small-regular">
          {price.original_price}
        </Text>
      )}
      <Text className="text-luxury-gold font-medium text-base-regular">
        {price.calculated_price || "Price unavailable"}
      </Text>
    </div>
  )
}
