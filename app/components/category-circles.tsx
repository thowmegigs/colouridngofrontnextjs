"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: 1,
    name: "Fashion",
    image: "/placeholder.svg?height=200&width=200",
    link: "/category/fashion",
  },
  {
    id: 2,
    name: "Electronics",
    image: "/placeholder.svg?height=200&width=200",
    link: "/category/electronics",
  },
  {
    id: 3,
    name: "Home",
    image: "/placeholder.svg?height=200&width=200",
    link: "/category/home",
  },
  {
    id: 4,
    name: "Beauty",
    image: "/placeholder.svg?height=200&width=200",
    link: "/category/beauty",
  },
  {
    id: 5,
    name: "Sports",
    image: "/placeholder.svg?height=200&width=200",
    link: "/category/sports",
  },
  {
    id: 6,
    name: "Toys",
    image: "/placeholder.svg?height=200&width=200",
    link: "/category/toys",
  },
  {
    id: 7,
    name: "Books",
    image: "/placeholder.svg?height=200&width=200",
    link: "/category/books",
  },
  {
    id: 8,
    name: "Jewelry",
    image: "/placeholder.svg?height=200&width=200",
    link: "/category/jewelry",
  },
]

export default function CategoryCircles() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let scrollInterval: NodeJS.Timeout

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          scrollContainer.scrollLeft += 1

          // Reset scroll position when reaching the end
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
            scrollContainer.scrollLeft = 0
          }
        }
      }, 30)
    }

    startAutoScroll()

    // Pause auto-scroll when user interacts
    const handleInteraction = () => {
      clearInterval(scrollInterval)
    }

    // Resume auto-scroll after user stops interacting
    const handleInteractionEnd = () => {
      setTimeout(startAutoScroll, 3000)
    }

    scrollContainer.addEventListener("mousedown", handleInteraction)
    scrollContainer.addEventListener("touchstart", handleInteraction)
    scrollContainer.addEventListener("mouseup", handleInteractionEnd)
    scrollContainer.addEventListener("touchend", handleInteractionEnd)

    return () => {
      clearInterval(scrollInterval)
      if (scrollContainer) {
        scrollContainer.removeEventListener("mousedown", handleInteraction)
        scrollContainer.removeEventListener("touchstart", handleInteraction)
        scrollContainer.removeEventListener("mouseup", handleInteractionEnd)
        scrollContainer.removeEventListener("touchend", handleInteractionEnd)
      }
    }
  }, [])

  return (
    <div ref={scrollRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
      {categories.map((category) => (
        <Link key={category.id} href={category.link} className="flex-shrink-0 snap-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-border hover:border-primary transition-colors">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-center mt-2">{category.name}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
