"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SizeSelectorProps {
  sizes: string[]
  selectedSize: string | null
  onSelectSize: (size: string) => void
  currentSize?: string
  outOfStockSizes?: string[]
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
  currentSize,
  outOfStockSizes = [],
}: SizeSelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {sizes.map((size) => {
        const isSelected = selectedSize === size
        const isCurrent = currentSize === size
        const isOutOfStock = outOfStockSizes.includes(size)
        const isDisabled = isCurrent || isOutOfStock

        return (
          <Button
            key={size}
            type="button"
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "h-12 text-center",
              isCurrent && "border-dashed border-primary text-primary",
              isOutOfStock && "opacity-50",
            )}
            disabled={isDisabled}
            onClick={() => onSelectSize(size)}
          >
            {size}
            {isCurrent && " (Current)"}
            {isOutOfStock && " (Out of Stock)"}
          </Button>
        )
      })}
    </div>
  )
}
