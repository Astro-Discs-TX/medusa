import { InformationCircle } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Switch, Tooltip } from "@medusajs/ui"
import { useCallback, useMemo } from "react"
import { createDataGridHelper } from "../../../../components/data-grid"
import { DataGridReadOnlyCell } from "../../../../components/data-grid/components"
import { DataGridDuplicateCell } from "../../../../components/data-grid/components/data-grid-duplicate-cell"
import { DataGridTogglableNumberCell } from "../../../../components/data-grid/components/data-grid-toggleable-number-cell"
import { ProductInventorySchema } from "../schema"
import { ProductVariantInventoryItemLink } from "../types"
import { isProductVariant } from "../utils"

const helper = createDataGridHelper<
  HttpTypes.AdminProductVariant | ProductVariantInventoryItemLink,
  ProductInventorySchema
>()

type DisabledItem = { id: string; title: string; sku: string }
type DisabledResult =
  | {
      isDisabled: true
      item: DisabledItem
    }
  | {
      isDisabled: false
      item: undefined
    }

export const useProductInventoryColumns = (
  locations: HttpTypes.AdminStockLocation[] = [],
  disabled: Record<string, DisabledItem> = {}
) => {
  const getIsDisabled = useCallback(
    (item: ProductVariantInventoryItemLink): DisabledResult => {
      const disabledItem = disabled[item.inventory_item_id]
      const isDisabled = !!disabledItem && disabledItem.id !== item.variant_id

      if (!isDisabled) {
        return {
          isDisabled: false,
          item: undefined,
        }
      }

      return {
        isDisabled,
        item: disabledItem,
      }
    },
    [disabled]
  )

  return useMemo(
    () => [
      helper.column({
        id: "title",
        name: "Title",
        header: "Title",
        cell: (context) => {
          const item = context.row.original

          if (isProductVariant(item)) {
            return (
              <DataGridReadOnlyCell context={context}>
                {item.title || "-"}
              </DataGridReadOnlyCell>
            )
          }

          const { isDisabled, item: disabledItem } = getIsDisabled(item)

          if (isDisabled) {
            return (
              <DataGridReadOnlyCell context={context}>
                <div className="flex size-full items-center justify-between gap-x-2">
                  <span
                    title={item.inventory.title || undefined}
                    className="opacity-30"
                  >
                    {item.inventory.title || "-"}
                  </span>
                  <Tooltip
                    content={`This inventory item is already editable under ${
                      disabledItem.title
                    }${disabledItem.sku ? ` (${disabledItem.sku})` : ""}`}
                  >
                    <InformationCircle />
                  </Tooltip>
                </div>
              </DataGridReadOnlyCell>
            )
          }

          return (
            <DataGridReadOnlyCell context={context}>
              {item.inventory.title || "-"}
            </DataGridReadOnlyCell>
          )
        },
        disableHiding: true,
      }),
      helper.column({
        id: "sku",
        name: "SKU",
        header: "SKU",
        cell: (context) => {
          const item = context.row.original

          if (isProductVariant(item)) {
            return (
              <DataGridReadOnlyCell context={context}>
                {item.sku || "-"}
              </DataGridReadOnlyCell>
            )
          }

          const { isDisabled } = getIsDisabled(item)

          if (isDisabled) {
            return (
              <DataGridReadOnlyCell context={context}>
                <span className="opacity-30">{item.inventory.sku || "-"}</span>
              </DataGridReadOnlyCell>
            )
          }

          return (
            <DataGridReadOnlyCell context={context}>
              {item.inventory.sku || "-"}
            </DataGridReadOnlyCell>
          )
        },
        disableHiding: true,
      }),
      ...locations.map((location) =>
        helper.column({
          id: `location_${location.id}`,
          name: location.name,
          header: location.name,
          field: (context) => {
            const item = context.row.original

            if (isProductVariant(item)) {
              return null
            }

            const { isDisabled, item: disabledItem } = getIsDisabled(item)

            if (isDisabled) {
              return `variants.${disabledItem.id}.inventory_items.${item.inventory_item_id}.locations.${location.id}` as const
            }

            return `variants.${item.variant_id}.inventory_items.${item.inventory_item_id}.locations.${location.id}` as const
          },
          type: "togglable-number",
          cell: (context) => {
            const item = context.row.original

            if (isProductVariant(item)) {
              return <DataGridReadOnlyCell context={context} />
            }

            const { isDisabled } = getIsDisabled(item)

            if (isDisabled) {
              return (
                <DataGridDuplicateCell context={context}>
                  {({ value }) => {
                    const { checked, quantity } = value as {
                      checked: boolean
                      quantity: number | string
                    }

                    return (
                      <div className="flex size-full items-center gap-x-2 opacity-30">
                        <Switch
                          className="shrink-0 cursor-not-allowed"
                          tabIndex={-1}
                          size="small"
                          checked={checked}
                        />
                        <span className="flex size-full items-center justify-end">
                          {quantity}
                        </span>
                      </div>
                    )
                  }}
                </DataGridDuplicateCell>
              )
            }

            // Depending on how we want to handle the checked state, we might need
            // to move this to the form state.
            // const locationLevel = item.inventory.location_levels?.find(
            //   (level) => level.location_id === location.id
            // )

            // const disableToggle = Boolean(
            //   locationLevel &&
            //     (locationLevel.reserved_quantity > 0 ||
            //       locationLevel.incoming_quantity > 0)
            // )

            return <DataGridTogglableNumberCell context={context} />
          },
        })
      ),
    ],
    [locations, getIsDisabled]
  )
}
