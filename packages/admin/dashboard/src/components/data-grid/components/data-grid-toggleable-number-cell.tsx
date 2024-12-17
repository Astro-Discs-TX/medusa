import { Switch } from "@medusajs/ui"
import { useEffect, useRef, useState } from "react"
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field"
import { Controller, ControllerRenderProps } from "react-hook-form"
import { useCombinedRefs } from "../../../hooks/use-combined-refs"
import { ConditionalTooltip } from "../../common/conditional-tooltip"
import { useDataGridCell, useDataGridCellError } from "../hooks"
import { DataGridCellProps, InputProps } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

export const DataGridTogglableNumberCell = <TData, TValue = any>({
  context,
  ...rest
}: DataGridCellProps<TData, TValue> & {
  min?: number
  max?: number
  placeholder?: string
}) => {
  const { field, control, renderProps } = useDataGridCell({
    context,
  })
  const errorProps = useDataGridCellError({ context })

  const { container, input } = renderProps

  return (
    <Controller
      control={control}
      name={field}
      render={({ field }) => {
        return (
          <DataGridCellContainer
            {...container}
            {...errorProps}
            outerComponent={
              <OuterComponent
                field={field}
                inputProps={input}
                isAnchor={container.isAnchor}
              />
            }
          >
            <Inner field={field} inputProps={input} {...rest} />
          </DataGridCellContainer>
        )
      }}
    />
  )
}

const OuterComponent = ({
  field,
  inputProps,
  isAnchor,
}: {
  field: ControllerRenderProps<any, string>
  inputProps: InputProps
  isAnchor: boolean
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { value } = field
  const { onChange } = inputProps

  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleCheckedChange = (update: boolean) => {
    const newValue = { ...localValue, checked: update }
    setLocalValue(newValue)
    onChange(newValue, value)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnchor && e.key.toLowerCase() === "x") {
        e.preventDefault()
        buttonRef.current?.click()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isAnchor])

  return (
    <ConditionalTooltip
      showTooltip={localValue.disabledToggle}
      content={`Cannot disable: clear incoming and/or reserved quantities first.`}
    >
      <div className="absolute inset-y-0 left-4 z-[3] flex w-fit items-center justify-center">
        <Switch
          ref={buttonRef}
          size="small"
          className="shrink-0"
          checked={localValue.checked}
          disabled={localValue.disabledToggle}
          onCheckedChange={handleCheckedChange}
        />
      </div>
    </ConditionalTooltip>
  )
}

const Inner = ({
  field,
  inputProps,
  ...props
}: {
  field: ControllerRenderProps<any, string>
  inputProps: InputProps
  min?: number
  max?: number
  placeholder?: string
}) => {
  const { ref, value, onChange: _, onBlur, ...fieldProps } = field
  const {
    ref: inputRef,
    onChange,
    onBlur: onInputBlur,
    onFocus,
    ...attributes
  } = inputProps

  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const combinedRefs = useCombinedRefs(inputRef, ref)

  const handleInputChange: CurrencyInputProps["onValueChange"] = (
    updatedValue,
    _name,
    _values
  ) => {
    const ensuredValue = updatedValue !== undefined ? updatedValue : ""
    const newValue = { ...localValue, quantity: ensuredValue }

    /**
     * If the value is not empty, then the location should be enabled.
     */
    if (ensuredValue !== "") {
      newValue.checked = true
    }

    setLocalValue(newValue)
  }

  return (
    <div className="flex size-full items-center gap-x-2">
      <CurrencyInput
        {...fieldProps}
        {...attributes}
        {...props}
        ref={combinedRefs}
        className="txt-compact-small w-full flex-1 cursor-default appearance-none bg-transparent pl-8 text-right outline-none"
        value={localValue?.quantity}
        onValueChange={handleInputChange}
        formatValueOnBlur
        onBlur={() => {
          onBlur()
          onInputBlur()

          onChange(localValue, value)
        }}
        onFocus={onFocus}
        decimalsLimit={0}
        autoComplete="off"
        tabIndex={-1}
      />
    </div>
  )
}
