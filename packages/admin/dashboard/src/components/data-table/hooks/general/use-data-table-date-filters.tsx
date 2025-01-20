import { createDataTableFilterHelper } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDate } from "../../../../hooks/use-date"

const filterHelper = createDataTableFilterHelper<any>()

const useDateFilterOptions = () => {
  const { t } = useTranslation()

  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  return useMemo(() => {
    return [
      {
        label: t("filters.date.today"),
        value: {
          $gte: today.toISOString(),
        },
      },
      {
        label: t("filters.date.lastSevenDays"),
        value: {
          $gte: new Date(
            today.getTime() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 7 days ago
        },
      },
      {
        label: t("filters.date.lastThirtyDays"),
        value: {
          $gte: new Date(
            today.getTime() - 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 days ago
        },
      },
      {
        label: t("filters.date.lastNinetyDays"),
        value: {
          $gte: new Date(
            today.getTime() - 90 * 24 * 60 * 60 * 1000
          ).toISOString(), // 90 days ago
        },
      },
      {
        label: t("filters.date.lastTwelveMonths"),
        value: {
          $gte: new Date(
            today.getTime() - 365 * 24 * 60 * 60 * 1000
          ).toISOString(), // 365 days ago
        },
      },
    ]
  }, [today, t])
}

export const useDataTableDateFilters = (disableRangeOption?: boolean) => {
  const { t } = useTranslation()
  const { getFullDate } = useDate()
  const dateFilterOptions = useDateFilterOptions()

  const rangeOptions = useMemo(() => {
    if (disableRangeOption) {
      return {
        disableRangeOption: true,
      }
    }

    return {
      rangeOptionStartLabel: t("filters.date.starting"),
      rangeOptionEndLabel: t("filters.date.ending"),
      rangeOptionLabel: t("filters.date.custom"),
      options: dateFilterOptions,
    }
  }, [disableRangeOption, t, dateFilterOptions])

  return useMemo(() => {
    return [
      filterHelper.accessor("created_at", {
        type: "date",
        label: t("fields.createdAt"),
        format: "date",
        formatDateValue: (date) => getFullDate({ date }),
        options: dateFilterOptions,
        ...rangeOptions,
      }),
      filterHelper.accessor("updated_at", {
        type: "date",
        label: t("fields.updatedAt"),
        format: "date",
        formatDateValue: (date) => getFullDate({ date }),
        options: dateFilterOptions,
        ...rangeOptions,
      }),
    ]
  }, [t, dateFilterOptions, getFullDate, rangeOptions])
}
