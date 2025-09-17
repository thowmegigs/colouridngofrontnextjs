"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useCart } from "../providers/cart-provider"
import ProductCard from "./product-card"

type ProductCarouselProps = {
  section: any
}

export default function ProductCarousel({ section }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()
  const [visibleItems, setVisibleItems] = useState(4)
  const [autoScroll, setAutoScroll] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const products = section.products1
  const isHorizontal = section.display === "Horizontal"
  const title = section.section_title
  const sub_title = section.section_subtitle
  let viewAllLink = `/content_section/${section.id}`

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setVisibleItems(5)
      } else if (window.innerWidth >= 1024) {
        setVisibleItems(4)
      } else if (window.innerWidth >= 768) {
        setVisibleItems(3)
      } else if (window.innerWidth >= 640) {
        setVisibleItems(2)
      } else {
        setVisibleItems(1)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!autoScroll) return

    const interval = setInterval(() => {
      scroll("right")
    }, 5000)

    return () => clearInterval(interval)
  }, [autoScroll, currentIndex])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount =
        direction === "left"
          ? -current.clientWidth / visibleItems
          : current.clientWidth / visibleItems

      if (direction === "left" && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1)
      } else if (direction === "right" && currentIndex < products.length - visibleItems) {
        setCurrentIndex(prev => prev + 1)
      }

      current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className="relative">
      {/* Arrows - Desktop Only & Only for Horizontal */}
      {isHorizontal && (
        <>
          <button
            onClick={() => scroll("left")}
            disabled={currentIndex === 0}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-0 bg-background border shadow-sm items-center justify-center hover:bg-muted disabled:opacity-50"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Scroll left</span>
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={currentIndex >= products.length - visibleItems}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-0 bg-background border shadow-sm items-center justify-center hover:bg-muted disabled:opacity-50"
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Scroll right</span>
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        className={`relative overflow-hidden ${
          isHorizontal
            ? "flex gap-0 md:gap-1 pb-4 overflow-x-auto scrollbar-hide"
            : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 md:gap-1"
        }`}
        onMouseEnter={() => setAutoScroll(false)}
        onMouseLeave={() => setAutoScroll(true)}
      >
        {products?.map((product: any) => (
          <div
            key={product.id}
            className={`${
              isHorizontal ? "w-[200px] sm:w-[250px] flex-shrink-0" : ""
            } group`}
          >
            <ProductCard
              {...product}
              vendorName={product.brand ?? "True Color"}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
