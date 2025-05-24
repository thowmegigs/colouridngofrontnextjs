"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type MasonryItem = {
  id: string
  title: string
  description: string
  image: string
  link: string
  height: "small" | "medium" | "large"
}

const items: MasonryItem[] = [
  {
    id: "1",
    title: "Summer Collection",
    description: "Discover our latest summer styles",
    image: "/placeholder.svg?height=600&width=400&query=summer%20fashion",
    link: "/category/summer-collection",
    height: "large",
  },
  {
    id: "2",
    title: "Accessories",
    description: "Complete your look",
    image: "/placeholder.svg?height=300&width=400&query=fashion%20accessories",
    link: "/category/accessories",
    height: "small",
  },
  {
    id: "3",
    title: "Footwear",
    description: "Step into style",
    image: "/placeholder.svg?height=400&width=400&query=stylish%20shoes",
    link: "/category/footwear",
    height: "medium",
  },
  {
    id: "4",
    title: "Home Decor",
    description: "Transform your space",
    image: "/placeholder.svg?height=300&width=400&query=home%20decor",
    link: "/category/home-decor",
    height: "small",
  },
  {
    id: "5",
    title: "Electronics",
    description: "The latest tech",
    image: "/placeholder.svg?height=400&width=400&query=modern%20electronics",
    link: "/category/electronics",
    height: "medium",
  },
  {
    id: "6",
    title: "Winter Essentials",
    description: "Stay warm in style",
    image: "/placeholder.svg?height=600&width=400&query=winter%20fashion",
    link: "/category/winter-essentials",
    height: "large",
  },
]

export default function MasonryGrid() {
  const [columns, setColumns] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setColumns(3)
      } else if (window.innerWidth >= 768) {
        setColumns(2)
      } else {
        setColumns(1)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Distribute items into columns
  const getColumnItems = () => {
    const columnItems: MasonryItem[][] = Array.from({ length: columns }, () => [])

    items.forEach((item, index) => {
      const columnIndex = index % columns
      columnItems[columnIndex].push(item)
    })

    return columnItems
  }

  const getHeightClass = (height: MasonryItem["height"]) => {
    switch (height) {
      case "small":
        return "h-[250px]"
      case "medium":
        return "h-[350px]"
      case "large":
        return "h-[450px]"
      default:
        return "h-[350px]"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {getColumnItems().map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-4">
          {column.map((item) => (
            <div key={item.id} className={`relative rounded-lg overflow-hidden ${getHeightClass(item.height)} group`}>
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/80 mb-4">{item.description}</p>
                <Link href={item.link}>
                  <Button variant="outline" className="bg-white/20 text-white border-white/40 hover:bg-white/30">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
