import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { createDataTableColumnHelper } from "@medusajs/ui"
import { DataTableStatusCell } from "../../components/data-table-status-cell/data-table-status-cell"

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminSalesChannel>()

export const useSalesChannelTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => t("fields.name"),
        enableSorting: true,
        sortLabel: t("fields.name"),
        sortAscLabel: t("filters.sorting.alphabeticallyAsc"),
        sortDescLabel: t("filters.sorting.alphabeticallyDesc"),
      }),
      columnHelper.accessor("description", {
        header: () => t("fields.description"),
        enableSorting: true,
        sortLabel: t("fields.description"),
        sortAscLabel: t("filters.sorting.alphabeticallyAsc"),
        sortDescLabel: t("filters.sorting.alphabeticallyDesc"),
      }),
      columnHelper.accessor("is_disabled", {
        header: () => t("fields.status"),
        enableSorting: true,
        sortLabel: t("fields.status"),
        sortAscLabel: t("filters.sorting.alphabeticallyAsc"),
        sortDescLabel: t("filters.sorting.alphabeticallyDesc"),
        cell: ({ getValue }) => {
          const value = getValue()
          return (
            <DataTableStatusCell color={value ? "grey" : "green"}>
              {value ? t("general.disabled") : t("general.enabled")}
            </DataTableStatusCell>
          )
        },
      }),
    ],
    [t]
  )
}
