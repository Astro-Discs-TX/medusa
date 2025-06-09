"use client"

import { XMarkMini } from "@medusajs/icons"
import { Button } from "@medusajs/ui"

type FilterTagProps = {
  label: string
  onClick: () => void
  "data-testid"?: string
}

const FilterTag = ({
  label,
  onClick,
  "data-testid": dataTestId,
}: FilterTagProps) => {
  return (
    <Button
      variant="secondary"
      className="flex items-center gap-x-1 px-3 py-1.5 border border-luxury-gold/30 bg-luxury-cream/10 text-luxury-charcoal hover:border-luxury-gold/60 transition-colors"
      onClick={onClick}
      data-testid={dataTestId}
    >
      <span className="text-xs">{label}</span>
      <XMarkMini className="w-3 h-3" />
    </Button>
  )
}

export default FilterTag 