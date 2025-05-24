"use client"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

export interface ColorOption {
  name: string
  code: string
  
}

interface ColorSelectorProps {
  colors: ColorOption[]
  selectedColor: ColorOption | null
  onSelectColor: (color: ColorOption) => void
  currentColor?: string
  outOfStockColors?: string[]
}

export function ColorSelector({
  colors,
  selectedColor,
  onSelectColor,
  currentColor,
  outOfStockColors = [],
}: ColorSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => {
        const isSelected = selectedColor?.name === color.name
        const isCurrent = currentColor === color.name
        const isOutOfStock = outOfStockColors.includes(color.name)
        const isDisabled = isCurrent || isOutOfStock

        return (
          <div key={color.name} className="flex flex-col items-center gap-1">
            <button
              type="button"
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                isSelected && "ring-2 ring-primary ring-offset-2",
                isCurrent && "ring-2 ring-dashed ring-primary",
                isDisabled && "opacity-50 cursor-not-allowed",
              )}
              style={{ backgroundColor: color.code }}
              disabled={isDisabled}
              onClick={() => onSelectColor(color)}
              aria-label={`Select color ${color.name}`}
            >
              {isSelected && (
                <CheckIcon className={cn("h-4 w-4", isLightColor(color.code) ? "text-black" : "text-white")} />
              )}
            </button>
            <span className="text-xs text-center">
              {color.name}
              {isCurrent && " (Current)"}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Helper function to determine if a color is light or dark
function isLightColor(hex: string): boolean {
  // Convert hex to RGB
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)

  // Calculate brightness (using the formula for relative luminance)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  // Return true if the color is light (brightness > 128)
  return brightness > 128
}
