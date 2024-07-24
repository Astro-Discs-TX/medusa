import { CellContext } from "@tanstack/react-table"
import React, {
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { DataGridContext } from "./context"
import {
  CellCoords,
  DataGridCellContext,
  DataGridCellRenderProps,
} from "./types"
import { generateCellId, isCellMatch } from "./utils"

const useDataGridContext = () => {
  const context = useContext(DataGridContext)

  if (!context) {
    throw new Error(
      "useDataGridContext must be used within a DataGridContextProvider"
    )
  }

  return context
}

type UseDataGridCellProps<TData, TValue> = {
  field: string
  context: CellContext<TData, TValue>
  type: "text" | "number" | "select"
}

const textCharacterRegex = /^.$/u
const numberCharacterRegex = /^[0-9]$/u

export const useDataGridCell = <TData, TValue>({
  field,
  context,
  type,
}: UseDataGridCellProps<TData, TValue>) => {
  const { rowIndex, columnIndex } = context as DataGridCellContext<
    TData,
    TValue
  >

  const coords: CellCoords = useMemo(
    () => ({ row: rowIndex, col: columnIndex }),
    [rowIndex, columnIndex]
  )
  const id = generateCellId(coords)

  const {
    register,
    control,
    anchor,
    selection,
    dragSelection,
    setIsEditing,
    setIsSelecting,
    setRangeEnd,
    getWrapperFocusHandler,
    getWrapperMouseOverHandler,
  } = useDataGridContext()

  const [showOverlay, setShowOverlay] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLElement>(null)

  const handleOverlayMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (e.detail === 2) {
        if (inputRef.current) {
          setShowOverlay(false)

          inputRef.current.focus()

          return
        }
      }

      if (e.shiftKey) {
        setRangeEnd(coords)
        return
      }

      if (containerRef.current) {
        setIsSelecting(true)
        containerRef.current.focus()
      }
    },
    [setIsSelecting, setRangeEnd, coords]
  )

  const handleInputBlur = useCallback(() => {
    setShowOverlay(true)
    setIsEditing(false)
  }, [setIsEditing])

  const handleInputFocus = useCallback(() => {
    setShowOverlay(false)
    setIsEditing(true)
  }, [setIsEditing])

  const validateKeyStroke = useCallback(
    (key: string) => {
      if (type === "number") {
        return numberCharacterRegex.test(key)
      }

      return textCharacterRegex.test(key)
    },
    [type]
  )

  const handleContainerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!inputRef.current || !validateKeyStroke(e.key) || !showOverlay) {
        return
      }

      const event = new KeyboardEvent(e.type, e.nativeEvent)

      inputRef.current.focus()
      setShowOverlay(false)

      // if the inputRef can use .select() then we can use it here
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      }

      inputRef.current.dispatchEvent(event)
    },
    [showOverlay, validateKeyStroke]
  )

  const isAnchor = useMemo(() => {
    return anchor ? isCellMatch(coords, anchor) : false
  }, [anchor, coords])

  const isSelected = useMemo(() => {
    return selection[id] || false
  }, [selection, id])

  const isDragSelected = useMemo(() => {
    return dragSelection[id] || false
  }, [dragSelection, id])

  useEffect(() => {
    if (isAnchor && containerRef.current) {
      containerRef.current.focus()
    }
  }, [isAnchor])

  const renderProps: DataGridCellRenderProps = {
    container: {
      isAnchor,
      isSelected,
      isDragSelected,
      showOverlay,
      innerProps: {
        ref: containerRef,
        onMouseOver: getWrapperMouseOverHandler(coords),
        onKeyDown: handleContainerKeyDown,
        onFocus: getWrapperFocusHandler(coords),
        "data-container-id": id,
      },
      overlayProps: {
        onMouseDown: handleOverlayMouseDown,
      },
    },
    input: {
      ref: inputRef,
      onBlur: handleInputBlur,
      onFocus: handleInputFocus,
      "data-row": coords.row,
      "data-col": coords.col,
      "data-cell-id": id,
      "data-field": field,
    },
  }

  return {
    id,
    register,
    control,
    renderProps,
  }
}
