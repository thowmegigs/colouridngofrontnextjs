"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

const brands = [
  { id: 1, name: "Nike", logo: "/swoosh-on-white.png", url: "/brand/nike" },
  { id: 2, name: "Apple", logo: "/bitten-fruit-silhouette.png", url: "/brand/apple" },
  { id: 3, name: "Samsung", logo: "/samsung-wordmark.png", url: "/brand/samsung" },
  { id: 4, name: "Adidas", logo: "/three-stripes-abstract.png", url: "/brand/adidas" },
  { id: 5, name: "Sony", logo: "/sony-logo-display.png", url: "/brand/sony" },
  { id: 6, name: "Nike", logo: "/swoosh-on-white.png", url: "/brand/nike-2" },
  { id: 7, name: "Apple", logo: "/bitten-fruit-silhouette.png", url: "/brand/apple-2" },
  { id: 8, name: "Samsung", logo: "/samsung-wordmark.png", url: "/brand/samsung-2" },
]

export default function BrandCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount = direction === "left" ? -current.clientWidth / 2 : current.clientWidth / 2
      current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <section className="!my-5">
      <h2 className="text-2sm md:text-xl mbb-2 font-bold sm:text-center">Shop by Brand</h2>

      <div className="relative">
        {/* Left Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-background shadow-md rounded-full flex w-8 h-8 md:w-10 md:h-10"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
        </Button>

        {/* Scrollable brand list */}
        <div
          ref={scrollRef}
          className="bg-gray-50  flex overflow-x-auto gap-6 py-3 px-2 scrollbar-hide snap-x"
        >
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={brand.url}
              className="flex-shrink-0 snap-start bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex items-center justify-center min-w-[160px] h-[100px]"
            >
              <Image
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                width={120}
                height={60}
                className="max-h-[60px] w-auto object-contain"
              />
            </Link>
          ))}
        </div>

        {/* Right Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-background shadow-md rounded-full flex w-8 h-8 md:w-10 md:h-10"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
    </section>
  )
}
