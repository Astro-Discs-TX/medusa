import {
  BigNumberInput,
  ConfirmVariantInventoryWorkflowInputDTO,
} from "@medusajs/framework/types"
import {
  BigNumber,
  MathBN,
  MedusaError,
  deepFlatMap,
} from "@medusajs/framework/utils"

interface ConfirmInventoryPreparationInput {
  product_variant_inventory_items: {
    variant_id: string
    inventory_item_id: string
    required_quantity: number
  }[]
  items: {
    id?: string
    variant_id?: string | null
    quantity: BigNumberInput
  }[]
  variants: {
    id: string
    manage_inventory?: boolean
    allow_backorder?: boolean
  }[]
  location_ids: string[]
  stockAvailability: Map<string, BigNumberInput>
}

interface ConfirmInventoryItem {
  id?: string
  inventory_item_id: string
  required_quantity: number
  allow_backorder: boolean
  quantity: BigNumberInput
  location_ids: string[]
}

export const prepareConfirmInventoryInput = (data: {
  input: ConfirmVariantInventoryWorkflowInputDTO
}) => {
  const productVariantInventoryItems = new Map<string, any>()
  const stockLocationIds = new Set<string>()
  const allVariants = new Map<string, any>()
  const mapLocationAvailability = new Map<string, BigNumberInput>()
  let hasSalesChannelStockLocation = false
  let hasManagedInventory = false

  const salesChannelId = data.input.sales_channel_id

  for (const updateItem of data.input.itemsToUpdate ?? []) {
    const item = data.input.items.find(
      (item) => item.variant_id === updateItem.data.variant_id
    )
    if (item && updateItem.data.quantity) {
      item.quantity = updateItem.data.quantity!
    }
  }

  deepFlatMap(
    data.input,
    "variants.inventory_items.inventory.location_levels.stock_locations.sales_channels",
    ({
      variants,
      inventory_items,
      location_levels,
      stock_locations,
      sales_channels,
    }) => {
      if (!variants) {
        return
      }

      if (
        !hasSalesChannelStockLocation &&
        sales_channels?.id === salesChannelId
      ) {
        hasSalesChannelStockLocation = true
      }

      if (location_levels) {
        const availabilty = MathBN.sub(
          location_levels.raw_stocked_quantity ??
            location_levels.stocked_quantity ??
            0,
          location_levels.raw_reserved_quantity ??
            location_levels.reserved_quantity ??
            0
        )

        mapLocationAvailability.set(
          location_levels.location_id,
          new BigNumber(availabilty)
        )
      }

      if (stock_locations && sales_channels?.id === salesChannelId) {
        stockLocationIds.add(stock_locations.id)
      }

      if (inventory_items) {
        const inventoryItemId = inventory_items.inventory_item_id
        const mapKey = `${inventoryItemId}-${inventory_items.variant_id}`

        if (!productVariantInventoryItems.has(mapKey)) {
          productVariantInventoryItems.set(mapKey, {
            variant_id: inventory_items.variant_id,
            inventory_item_id: inventoryItemId,
            required_quantity: inventory_items.required_quantity,
          })
        }
      }

      if (!allVariants.has(variants.id)) {
        if (!hasManagedInventory && variants.manage_inventory) {
          hasManagedInventory = true
        }

        allVariants.set(variants.id, {
          id: variants.id,
          manage_inventory: variants.manage_inventory,
          allow_backorder: variants.allow_backorder,
        })
      }
    }
  )

  if (!hasManagedInventory) {
    return { items: [] }
  }

  if (salesChannelId && !hasSalesChannelStockLocation) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Sales channel ${salesChannelId} is not associated with any stock location.`
    )
  }

  const items = formatInventoryInput({
    product_variant_inventory_items: Array.from(
      productVariantInventoryItems.values()
    ),
    location_ids: Array.from(stockLocationIds),
    stockAvailability: mapLocationAvailability,
    items: data.input.items,
    variants: Array.from(allVariants.values()),
  })

  return { items }
}

const formatInventoryInput = ({
  product_variant_inventory_items,
  location_ids,
  items,
  stockAvailability,
  variants,
}: ConfirmInventoryPreparationInput) => {
  if (!product_variant_inventory_items.length) {
    return []
  }

  const variantsMap = new Map<
    string,
    ConfirmInventoryPreparationInput["variants"][0]
  >(variants.map((v) => [v.id, v]))

  const itemsToConfirm: ConfirmInventoryItem[] = []

  items.forEach((item) => {
    const variant = variantsMap.get(item.variant_id!)

    if (!variant?.manage_inventory) {
      return
    }

    const variantInventoryItems = product_variant_inventory_items.filter(
      (i) => i.variant_id === item.variant_id
    )

    if (!variantInventoryItems.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Variant ${item.variant_id} does not have any inventory items associated with it.`
      )
    }

    variantInventoryItems.forEach((variantInventoryItem) => {
      const locationsWithAvailability = location_ids.filter((locId) =>
        MathBN.gte(
          stockAvailability.get(locId) ?? 0,
          MathBN.mult(variantInventoryItem.required_quantity, item.quantity)
        )
      )

      itemsToConfirm.push({
        id: item.id,
        inventory_item_id: variantInventoryItem.inventory_item_id,
        required_quantity: variantInventoryItem.required_quantity,
        allow_backorder: !!variant.allow_backorder,
        quantity: item.quantity,
        location_ids: locationsWithAvailability.length
          ? locationsWithAvailability
          : location_ids,
      })
    })
  })

  return itemsToConfirm
}
