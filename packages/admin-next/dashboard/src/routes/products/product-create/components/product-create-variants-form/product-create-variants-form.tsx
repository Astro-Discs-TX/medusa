import { ProductVariantDTO } from "@medusajs/types"
import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ProductCreateSchemaType } from "../../types"
import { useStore } from "../../../../../hooks/api/store"
import { useCurrencies } from "../../../../../hooks/api/currencies"
import { DataGridRoot } from "../../../../../components/data-grid/data-grid-root"
import { DataGridReadOnlyCell } from "../../../../../components/data-grid/data-grid-cells/data-grid-readonly-cell.tsx"
import { DataGridTextCell } from "../../../../../components/data-grid/data-grid-cells/data-grid-text-cell.tsx"
import { createDataGridHelper } from "../../../../../components/data-grid/utils.ts"
import { DataGridCurrencyCell } from "../../../../../components/data-grid/data-grid-cells/data-grid-currency-cell.tsx"
import { DataGridBooleanCell } from "../../../../../components/data-grid/data-grid-cells/data-grid-boolean-cell.tsx"
import { DataGridCountrySelectCell } from "../../../../../components/data-grid/data-grid-cells/data-grid-country-select-cell.tsx"

type ProductCreateVariantsFormProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateVariantsForm = ({
  form,
}: ProductCreateVariantsFormProps) => {
  const { store, isLoading: isStoreLoading } = useStore()
  const { currencies = [], isLoading: isCurrenciesLoading } = useCurrencies(
    {
      code: store?.supported_currency_codes,
      limit: store?.supported_currency_codes?.length,
    },
    {
      enabled: !!store,
    }
  )

  const options = useWatch({
    control: form.control,
    name: "options",
    defaultValue: [],
  })

  const columns = useColumns({
    options,
    currencies: currencies.map((c) => c.code),
  })

  const variants = useWatch({
    control: form.control,
    name: "variants",
  }) as any

  return (
    <div className="flex size-full flex-col divide-y overflow-hidden">
      <DataGridRoot columns={columns} data={variants} state={form} />
    </div>
  )
}

const columnHelper = createDataGridHelper<ProductVariantDTO>()

const useColumns = ({
  options,
  currencies = [],
}: {
  options: any // CreateProductOptionSchemaType[]
  currencies?: string[]
}) => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.column({
        id: "options",
        header: () => (
          <div className="flex size-full items-center overflow-hidden">
            <span className="truncate">
              {options.map((o) => o.title).join(" / ")}
            </span>
          </div>
        ),
        cell: ({ row }) => {
          return (
            <DataGridReadOnlyCell>
              {options.map((o) => row.original.options[o.title]).join(" / ")}
            </DataGridReadOnlyCell>
          )
        },
        disableHidding: true,
      }),
      columnHelper.column({
        id: "title",
        name: t("fields.title"),
        header: t("fields.title"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.title`}
            />
          )
        },
      }),
      columnHelper.column({
        id: "sku",
        name: t("fields.sku"),
        header: t("fields.sku"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.sku`}
            />
          )
        },
      }),
      columnHelper.column({
        id: "ean",
        name: t("fields.ean"),
        header: t("fields.ean"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.ean`}
            />
          )
        },
      }),
      columnHelper.column({
        id: "upc",
        name: t("fields.upc"),
        header: t("fields.upc"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.upc`}
            />
          )
        },
      }),
      columnHelper.column({
        id: "barcode",
        name: t("fields.barcode"),
        header: t("fields.barcode"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.barcode`}
            />
          )
        },
      }),

      columnHelper.column({
        id: "manage_inventory",
        name: t("fields.managedInventory"),
        header: t("fields.managedInventory"),
        cell: (context) => {
          return (
            <DataGridBooleanCell
              context={context}
              field={`variants.${context.row.index}.manage_inventory`}
            />
          )
        },
        type: "boolean",
      }),
      columnHelper.column({
        id: "allow_backorder",
        name: t("fields.allowBackorder"),
        header: t("fields.allowBackorder"),
        cell: (context) => {
          return (
            <DataGridBooleanCell
              context={context}
              field={`variants.${context.row.index}.allow_backorder`}
            />
          )
        },
        type: "boolean",
      }),

      columnHelper.column({
        id: "inventory_kit",
        name: t("fields.allowBackorder"),
        header: t("fields.inventoryKit"),
        cell: (context) => {
          return (
            <DataGridBooleanCell
              context={context}
              field={`variants.${context.row.index}.inventory_kit`}
              disabled={!context.row.original.manage_inventory}
            />
          )
        },
        type: "boolean",
      }),

      ...currencies.map((currency) => {
        return columnHelper.column({
          id: `price_${currency}`,
          name: `Price ${currency.toUpperCase()}`,
          header: `Price ${currency.toUpperCase()}`,
          cell: (context) => {
            return (
              <DataGridCurrencyCell
                code={currency}
                context={context}
                field={`variants.${context.row.index}.price.${currency}`}
              />
            )
          },
        })
      }),

      columnHelper.column({
        id: "mid_code",
        name: t("fields.midCode"),
        header: t("fields.midCode"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.mid_code`}
            />
          )
        },
      }),
      columnHelper.column({
        id: "hs_code",
        name: t("fields.hsCode"),
        header: t("fields.hsCode"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.hs_code`}
            />
          )
        },
      }),
      columnHelper.column({
        id: "width",
        name: t("fields.width"),
        header: t("fields.width"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.width`}
            />
          )
        },
      }),
      columnHelper.column({
        id: "length",
        name: t("fields.length"),
        header: t("fields.length"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.length`}
            />
          )
        },
      }),
      columnHelper.column({
        id: "height",
        name: t("fields.height"),
        header: t("fields.height"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.height`}
            />
          )
        },
      }),
      columnHelper.column({
        id: "weight",
        name: t("fields.weight"),
        header: t("fields.weight"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.weight`}
            />
          )
        },
      }),
      columnHelper.column({
        id: "material",
        name: t("fields.material"),
        header: t("fields.material"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.material`}
            />
          )
        },
      }),
      columnHelper.column({
        id: "origin_country",
        name: t("fields.countryOfOrigin"),
        header: t("fields.countryOfOrigin"),
        cell: (context) => {
          return (
            <DataGridCountrySelectCell
              context={context}
              field={`variants.${context.row.index}.origin_country`}
            />
          )
        },
      }),
    ],
    [currencies, options, t]
  )
}

// export const useVariantPriceGridColumns = ({
//   currencies = [],
// }: {
//   currencies?: CurrencyDTO[]
// }) => {
//   const { t } = useTranslation()
//
//   const colDefs: ColumnDef<ProductVariantDTO>[] = useMemo(() => {
//     return [
//       columnHelper.display({
//         id: t("fields.title"),
//         header: t("fields.title"),
//         cell: ({ row }) => {
//           const entity = row.original
//
//           return (
//             <DataGridReadOnlyCell>
//               <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
//                 <span className="truncate">{entity.title}</span>
//               </div>
//             </DataGridReadOnlyCell>
//           )
//         },
//       }),
//       columnHelper.display({
//         id: t("fields.customTitle"),
//         header: t("fields.customTitle"),
//         cell: (context) => {
//           return (
//             <DataGridTextCell
//               context={context}
//               field={`variants.${context.row.index}.custom_title`}
//               placeholder={t("fields.title")}
//             />
//           )
//         },
//       }),
//       columnHelper.display({
//         id: t("fields.sku"),
//         header: t("fields.sku"),
//         cell: (context) => {
//           return (
//             <DataGridTextCell
//               context={context}
//               field={`variants.${context.row.index}.sku`}
//               placeholder="SKU-123"
//             />
//           )
//         },
//       }),
//       columnHelper.display({
//         id: t("fields.manageInventory"),
//         header: t("fields.manageInventory"),
//         cell: (context) => {
//           return (
//             <DataGridSelectCell
//               context={context}
//               options={[
//                 { value: true, label: "True" },
//                 { value: false, label: "False" },
//               ]}
//               field={`variants.${context.row.index}.manage_inventory`}
//             />
//           )
//         },
//       }),
//       columnHelper.display({
//         id: t("fields.allowBackorder"),
//         header: t("fields.allowBackorder"),
//         cell: (context) => {
//           return (
//             <DataGridSelectCell
//               context={context}
//               options={[
//                 { value: true, label: "True" },
//                 { value: false, label: "False" },
//               ]}
//               field={`variants.${context.row.index}.allow_backorder`}
//               disabled={!context.row.original.manage_inventory}
//             />
//           )
//         },
//       }),
//       columnHelper.display({
//         id: t("fields.inventoryKit"),
//         header: t("fields.inventoryKit"),
//         cell: (context) => {
//           return (
//             <DataGridSelectCell
//               context={context}
//               options={[
//                 { value: true, label: "True" },
//                 { value: false, label: "False" },
//               ]}
//               field={`variants.${context.row.index}.inventory_kit`}
//               disabled={!context.row.original.manage_inventory}
//             />
//           )
//         },
//       }),
//       ...currencies.map((currency) => {
//         return columnHelper.display({
//           header: `Price ${currency.code.toUpperCase()}`,
//           cell: ({ row, table }) => {
//             return (
//               <CurrencyCell
//                 currency={currency}
//                 meta={table.options.meta as DataGridMeta}
//                 field={`variants.${row.index}.prices.${currency.code}`}
//               />
//             )
//           },
//         })
//       }),
//     ]
//   }, [t, currencies])
//
//   return colDefs
// }
