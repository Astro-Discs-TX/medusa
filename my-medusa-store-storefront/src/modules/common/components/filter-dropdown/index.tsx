"use client"

import { useState } from "react"
import { Popover, Checkbox, Text, Label, Button } from "@medusajs/ui"
import { ChevronUpMini } from "@medusajs/icons"

type FilterItem = {
  id: string
  name: string
  count?: number
}

type FilterDropdownProps = {
  title: string
  items: FilterItem[]
  selectedItems: string[]
  handleChange: (id: string) => void
  "data-testid"?: string
}

const FilterDropdown = ({
  title,
  items,
  selectedItems,
  handleChange,
  "data-testid": dataTestId,
}: FilterDropdownProps) => {
  const [open, setOpen] = useState(false)
  
  // Only show if we have items
  if (!items.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-3">
      <Text className="txt-compact-small-plus text-luxury-charcoal/80">{title}</Text>
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button
            variant="secondary"
            className="px-3 border border-luxury-gold/30 hover:border-luxury-gold/60 bg-transparent w-full flex items-center justify-between"
            data-testid={dataTestId}
          >
            <span className="text-sm text-luxury-charcoal truncate">
              {selectedItems.length > 0
                ? `${selectedItems.length} selected`
                : "Select options"}
            </span>
            <ChevronUpMini
              className={`${open ? "rotate-0" : "rotate-180"} transition-transform duration-200`}
            />
          </Button>
        </Popover.Trigger>
        <Popover.Content
          className="w-full min-w-[240px] p-4 border border-luxury-gold/30"
          side="bottom"
          align="start"
        >
          <div className="flex flex-col gap-y-3 max-h-[300px] overflow-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-x-2">
                <Checkbox
                  id={`filter-${title}-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleChange(item.id)}
                  className="text-luxury-gold border-luxury-gold/50 hover:border-luxury-gold focus:border-luxury-gold"
                />
                <Label
                  htmlFor={`filter-${title}-${item.id}`}
                  className="text-luxury-charcoal text-sm cursor-pointer flex justify-between w-full"
                >
                  <span>{item.name}</span>
                  {item.count !== undefined && (
                    <span className="text-luxury-charcoal/60 ml-2">({item.count})</span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover>
    </div>
  )
}

export default FilterDropdown 