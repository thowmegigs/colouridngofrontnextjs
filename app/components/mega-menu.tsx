"use client"

import { Category } from "@/interfaces"
import Link from "next/link"
import { useLayoutEffect, useMemo, useState } from "react"

type MegaMenuProps = {
  categories: Category[]
  slug: string
  onClose: () => void
  className?: string
}

export default function MegaMenu({ categories, slug, onClose, className = "" }: MegaMenuProps) {
  const [width, setWidth] = useState(200)
  const menuCategory = categories.find((cat) => cat.slug === slug)

  if (!menuCategory) return null

  const maxMenuHeight = 600 // px
  const rowHeight = 40 // px
  const maxRows = Math.floor(maxMenuHeight / rowHeight)
  const perColumnWidth = 250

  // ✅ Use useMemo to compute columns only when category children change
  const columns = useMemo(() => {
    const result: any[] = []
    let currentColumn: any[] = []
    let currentHeight = 0

    for (const sub of menuCategory.children) {
      const groupHeight = 1 + sub.children.length

      if (currentHeight + groupHeight > maxRows) {
        result.push(currentColumn)
        currentColumn = []
        currentHeight = 0
      }

      currentColumn.push(sub)
      currentHeight += groupHeight
    }

    if (currentColumn.length > 0) {
      result.push(currentColumn)
    }

    return result
  }, [menuCategory.children])

  // ✅ Set width based on computed columns
  useLayoutEffect(() => {
    setWidth(perColumnWidth * columns.length)
  }, [columns.length])
 
  return (
    <div
      className={`absolute bg-background border-t border-b shadow-lg z-50 md:min-w-[1000px] ${className}`}
      onMouseLeave={onClose}
      style={{ maxHeight: maxMenuHeight, overflowY: "auto", left: 120 }}
    >
      <div className="container py-6">
        <div className="flex gap-8">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="menu-column" style={{ height: "100%", flex: "1" }}>
              {column.map((subcat: any) => (
                <ul key={subcat.id} className="mb-4">
                  <li>
                    <Link
                      href={`/category/${subcat.slug}`}
                      className="text-2sm font-medium text-primary hover:underline"
                      onClick={onClose}
                    >
                      {subcat.name}
                    </Link>
                  </li>
                  {subcat.children.map((child: any) => (
                    <li key={child.id}>
                      <Link
                        href={`/category/${child.slug}`}
                        className="text-sm  hover:text-primary"
                        onClick={onClose}
                      >
                        &nbsp;&nbsp;{child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
