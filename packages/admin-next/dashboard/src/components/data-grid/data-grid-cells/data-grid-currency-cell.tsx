import CurrencyInput, { formatValue } from "react-currency-input-field"
import { Controller, ControllerRenderProps } from "react-hook-form"

import { useCallback, useEffect, useState } from "react"
import { useCombinedRefs } from "../../../hooks/use-combined-refs"
import { CurrencyInfo, currencies } from "../../../lib/data/currencies"
import { useDataGridCell } from "../hooks"
import { DataGridCellProps, InputProps } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

interface DataGridCurrencyCellProps<TData, TValue = any>
  extends DataGridCellProps<TData, TValue> {
  code: string
}

export const DataGridCurrencyCell = <TData, TValue = any>({
  field,
  context,
  code,
}: DataGridCurrencyCellProps<TData, TValue>) => {
  const { control, renderProps } = useDataGridCell({
    field,
    context,
    type: "number",
  })

  const { container, input } = renderProps

  const currency = currencies[code.toUpperCase()]

  return (
    <Controller
      control={control}
      name={field}
      render={({ field }) => {
        return (
          <DataGridCellContainer {...container}>
            <Inner field={field} inputProps={input} currencyInfo={currency} />
          </DataGridCellContainer>
        )
      }}
    />
  )
}

const Inner = ({
  field,
  inputProps,
  currencyInfo,
}: {
  field: ControllerRenderProps<any, string>
  inputProps: InputProps
  currencyInfo: CurrencyInfo
}) => {
  const { value, onChange: _, onBlur, ref, ...rest } = field
  const {
    ref: inputRef,
    onBlur: onInputBlur,
    onFocus,
    onChange,
    ...attributes
  } = inputProps

  const formatter = useCallback(
    (value: string) => {
      return formatValue({
        value,
        decimalScale: currencyInfo.decimal_digits,
      })
    },
    [currencyInfo]
  )

  const [localValue, setLocalValue] = useState(formatter(value))

  useEffect(() => {
    setLocalValue(formatter(value))
  }, [value, formatter])

  const combinedRed = useCombinedRefs(inputRef, ref)

  return (
    <div className="relative flex size-full items-center">
      <span
        className="txt-compact-small text-ui-fg-muted pointer-events-none absolute left-4 w-fit min-w-4"
        aria-hidden
      >
        {currencyInfo.symbol_native}
      </span>
      <CurrencyInput
        {...rest}
        {...attributes}
        ref={combinedRed}
        className="txt-compact-small w-full flex-1 cursor-default appearance-none bg-transparent py-2.5 pl-12 pr-4 text-right outline-none"
        value={localValue}
        onValueChange={(_value, _name, values) => {
          setLocalValue(values?.value || "")
        }}
        onBlur={() => {
          onBlur()
          onInputBlur()

          onChange(localValue, value)
        }}
        onFocus={onFocus}
        decimalScale={currencyInfo.decimal_digits}
        decimalsLimit={currencyInfo.decimal_digits}
        autoComplete="off"
        tabIndex={-1}
      />
    </div>
  )
}
