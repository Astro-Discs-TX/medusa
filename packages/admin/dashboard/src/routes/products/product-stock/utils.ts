import { HttpTypes } from "@medusajs/types"
import { ProductVariantInventoryItemLink } from "./types"

export function isProductVariant(
  row: HttpTypes.AdminProductVariant | ProductVariantInventoryItemLink
): row is HttpTypes.AdminProductVariant {
  return row.id.startsWith("variant_")
}

export function isProductVariantWithInventoryPivot(
  row: HttpTypes.AdminProductVariant | ProductVariantInventoryItemLink
): row is HttpTypes.AdminProductVariant & {
  inventory_items: ProductVariantInventoryItemLink[]
} {
  return (row as any).inventory_items && (row as any).inventory_items.length > 0
}

export function getDisabledInventoryRows(
  variants: (HttpTypes.AdminProductVariant & {
    inventory_items: ProductVariantInventoryItemLink[]
  })[]
) {
  const seen: Record<string, HttpTypes.AdminProductVariant> = {}
  const disabled: Record<string, { id: string; title: string; sku: string }> =
    {}

  variants.forEach((variant) => {
    const inventoryItems = variant.inventory_items

    inventoryItems.forEach((item) => {
      const existing = seen[item.inventory_item_id]

      if (existing) {
        disabled[item.inventory_item_id] = {
          id: existing.id,
          title: existing.title || "",
          sku: existing.sku || "",
        }

        return
      }

      seen[item.inventory_item_id] = variant
    })
  })

  return disabled
}
