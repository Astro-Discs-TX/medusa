import { FieldValues } from "react-hook-form"

import {
  DataGridBooleanCell,
  DataGridCurrencyCell,
  DataGridNumberCell,
  DataGridReadOnlyCell,
  DataGridTextCell,
} from "./data-grid-cells"
import { DataGridRoot, DataGridRootProps } from "./data-grid-root"
import { DataGridSkeleton } from "./data-grid-skeleton"

interface DataGridProps<TData, TFieldValues extends FieldValues = FieldValues>
  extends DataGridRootProps<TData, TFieldValues> {
  isLoading?: boolean
}

const _DataGrid = <TData, TFieldValues extends FieldValues = FieldValues>({
  isLoading,
  ...props
}: DataGridProps<TData, TFieldValues>) => {
  return isLoading ? (
    <DataGridSkeleton columns={props.columns} />
  ) : (
    <DataGridRoot {...props} />
  )
}

export const DataGrid = Object.assign(_DataGrid, {
  BooleanCell: DataGridBooleanCell,
  TextCell: DataGridTextCell,
  NumberCell: DataGridNumberCell,
  CurrencyCell: DataGridCurrencyCell,
  ReadonlyCell: DataGridReadOnlyCell,
})
