import { HttpTypes } from "@medusajs/types"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { TFunction } from "i18next"
import { IncludesTaxTooltip } from "../../common/tax-badge/tax-badge"
import { DataGridCurrencyCell } from "../data-grid-cells/data-grid-currency-cell"
import { DataGridReadonlyCell } from "../data-grid-cells/data-grid-readonly-cell"
import { createDataGridHelper } from "../utils"

export const createDataGridPriceColumns = <TData,>({
  currencies,
  regions,
  pricePreferences,
  isReadyOnly,
  getFieldName,
  t,
}: {
  currencies?: string[]
  regions?: HttpTypes.AdminRegion[]
  pricePreferences?: HttpTypes.AdminPricePreference[]
  isReadyOnly?: (context: CellContext<TData, unknown>) => boolean
  getFieldName: (context: CellContext<TData, unknown>, value: string) => string
  t: TFunction
}): ColumnDef<TData, unknown>[] => {
  const columnHelper = createDataGridHelper<TData>()

  return [
    ...(currencies?.map((currency) => {
      const preference = pricePreferences?.find(
        (p) => p.attribute === "currency_code" && p.value === currency
      )

      return columnHelper.column({
        id: `currency_prices.${currency}`,
        name: t("fields.priceTemplate", {
          regionOrCurrency: currency.toUpperCase(),
        }),
        header: () => (
          <div className="flex w-full items-center justify-between gap-3">
            {t("fields.priceTemplate", {
              regionOrCurrency: currency.toUpperCase(),
            })}
            <IncludesTaxTooltip includesTax={preference?.is_tax_inclusive} />
          </div>
        ),
        cell: (context) => {
          if (isReadyOnly?.(context)) {
            return <DataGridReadonlyCell />
          }

          return (
            <DataGridCurrencyCell
              code={currency}
              context={context}
              field={getFieldName(context, currency)}
            />
          )
        },
      })
    }) ?? []),
    ...(regions?.map((region) => {
      const preference = pricePreferences?.find(
        (p) => p.attribute === "region_id" && p.value === region.id
      )

      return columnHelper.column({
        id: `region_prices.${region.id}`,
        name: t("fields.priceTemplate", {
          regionOrCurrency: region.name,
        }),
        header: () => (
          <div className="flex w-full items-center justify-between gap-3">
            {t("fields.priceTemplate", {
              regionOrCurrency: region.name,
            })}
            <IncludesTaxTooltip includesTax={preference?.is_tax_inclusive} />
          </div>
        ),
        cell: (context) => {
          if (isReadyOnly?.(context)) {
            return <DataGridReadonlyCell />
          }

          const currency = currencies?.find((c) => c === region.currency_code)
          if (!currency) {
            return null
          }

          return (
            <DataGridCurrencyCell
              code={region.currency_code}
              context={context}
              field={getFieldName(context, region.id)}
            />
          )
        },
      })
    }) ?? []),
  ]
}
