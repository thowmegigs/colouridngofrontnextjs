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
  const products = section.products1;
  const type = section.display == 'Horizontal' ? 'horizontal' : 'vertical'
  const title = section.section_title;
  const sub_title = section.section_subtitle;
  let viewAllLink = `/content_section/${section.id}`;

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
        direction === "left" ? -current.clientWidth / visibleItems : current.clientWidth / visibleItems

      if (direction === "left" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      } else if (direction === "right" && currentIndex < products.length - visibleItems) {
        setCurrentIndex(currentIndex + 1)
      }

      current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }


  const isHorizontal = type=='horizontal'?true:false


  return (
    <div className="relative">


      <div
        ref={scrollRef}
        className={`relative overflow-hidden ${isHorizontal ? "flex gap-4 pb-4 overflow-x-auto scrollbar-hide" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"}`}
        onMouseEnter={() => setAutoScroll(false)}
        onMouseLeave={() => setAutoScroll(true)}
      >
        {products && products.map((product: any) => (
          <div key={product.id} className={`${isHorizontal ? "w-[160px] sm:w-[250px] flex-shrink-0" : ""} group`}>
            <ProductCard {...product} />
          </div>
        ))}
      </div>

      {!isHorizontal && (
        <div className="hidden md:block">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border shadow-sm flex items-center justify-center hover:bg-muted disabled:opacity-50"
            onClick={() => scroll("left")}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Scroll left</span>
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border shadow-sm flex items-center justify-center hover:bg-muted disabled:opacity-50"
            onClick={() => scroll("right")}
            disabled={currentIndex >= products.length - visibleItems}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Scroll right</span>
          </button>
        </div>
      )}

      {!isHorizontal && (
        <div className="flex justify-center mt-6 gap-1">
          {Array.from({ length: Math.ceil(products.length / visibleItems) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${index === Math.floor(currentIndex / visibleItems) ? "bg-primary w-6" : "bg-gray-300"
                }`}
              onClick={() => {
                setCurrentIndex(index * visibleItems)
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({
                    left: index * scrollRef.current.clientWidth,
                    behavior: "smooth",
                  })
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
