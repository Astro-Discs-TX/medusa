"use client"

import { useState, useEffect } from "react"
import { Text } from "@medusajs/ui"

type PriceRangeProps = {
  min: number
  max: number
  value: [number, number]
  handleChange: (value: [number, number]) => void
  currencyCode: string
  "data-testid"?: string
}

const PriceRange = ({
  min,
  max,
  value,
  handleChange,
  currencyCode,
  "data-testid": dataTestId,
}: PriceRangeProps) => {
  const [localValue, setLocalValue] = useState<[number, number]>(value)
  
  // Update local state when props change
  useEffect(() => {
    setLocalValue(value)
  }, [value])
  
  // Format price based on currency code
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }
  
  // Only show if min and max are different
  if (min === max) {
    return null
  }

  // Handle min input change
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(parseInt(e.target.value), localValue[1] - 10)
    setLocalValue([newMin, localValue[1]])
  }
  
  // Handle max input change
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(parseInt(e.target.value), localValue[0] + 10)
    setLocalValue([localValue[0], newMax])
  }

  // Handle blur event to commit changes
  const handleBlur = () => {
    handleChange(localValue)
  }
  
  return (
    <div className="flex flex-col gap-y-4" data-testid={dataTestId}>
      <Text className="txt-compact-small-plus text-luxury-charcoal/80">Price Range</Text>
      
      <div className="flex gap-x-4 items-center">
        <div className="flex flex-col gap-y-1">
          <Text className="text-xs text-luxury-charcoal/80">Min</Text>
          <input 
            type="number" 
            min={min} 
            max={localValue[1] - 10}
            value={localValue[0]}
            onChange={handleMinChange}
            onBlur={handleBlur}
            className="w-20 bg-transparent border border-luxury-gold/30 p-2 text-luxury-charcoal text-sm rounded"
          />
        </div>
        <div className="h-px w-4 bg-luxury-gold/30"></div>
        <div className="flex flex-col gap-y-1">
          <Text className="text-xs text-luxury-charcoal/80">Max</Text>
          <input 
            type="number" 
            min={localValue[0] + 10}
            max={max}
            value={localValue[1]}
            onChange={handleMaxChange}
            onBlur={handleBlur}
            className="w-20 bg-transparent border border-luxury-gold/30 p-2 text-luxury-charcoal text-sm rounded"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-1 px-2">
        <Text className="text-xs text-luxury-charcoal/70">{formatPrice(min)}</Text>
        <Text className="text-xs text-luxury-charcoal/70">{formatPrice(max)}</Text>
      </div>
    </div>
  )
}

export default PriceRange 