import { CellContext } from "@tanstack/react-table"
import {
  FocusEvent,
  MouseEvent,
  PropsWithChildren,
  ReactNode,
  RefObject,
} from "react"

export type CellCoords = {
  row: number
  col: number
}

export type GetCellHandlerProps = {
  coords: CellCoords
  readonly: boolean
}

export interface DataGridCellProps<TData = unknown, TValue = any> {
  field: string
  context: CellContext<TData, TValue>
}

export interface DataGridCellContext<TData = unknown, TValue = any>
  extends CellContext<TData, TValue> {
  /**
   * The index of the column in the grid.
   */
  columnIndex: number
  /**
   * The index of the row in the grid.
   */
  rowIndex: number
  registerCell: (coords: CellCoords) => void
}

export interface DataGridCellRenderProps {
  container: DataGridCellContainerProps
  input: InputProps
}

export interface InputProps {
  ref: RefObject<HTMLElement>
  onMouseDown: (e: MouseEvent<HTMLElement>) => void
  "data-row": number
  "data-col": number
  "data-cell-id": string
  "data-field": string
}

interface InnerProps {
  ref: RefObject<HTMLDivElement>
  onMouseOver: ((e: MouseEvent<HTMLElement>) => void) | undefined
  onFocus: (e: FocusEvent<HTMLElement>) => void
}

interface OverlayProps {
  onMouseDown: (e: MouseEvent<HTMLElement>) => void
}

export interface DataGridCellContainerProps extends PropsWithChildren<{}> {
  innerProps: InnerProps
  overlayProps: OverlayProps
  isAnchor: boolean
  isSelected: boolean
  isDragSelected: boolean
  placeholder?: ReactNode
  showOverlay: boolean
}

export type DataGridColumnType = "string" | "number" | "boolean"
