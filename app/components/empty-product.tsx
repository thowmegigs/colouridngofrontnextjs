"use client"

import { Package } from "lucide-react"

export default function EmptyProductState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Package className="h-12 w-12 text-muted-foreground" />
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>

      <p className="text-muted-foreground max-w-sm">There are no products available in this category at the moment.</p>
    </div>
  )
}
