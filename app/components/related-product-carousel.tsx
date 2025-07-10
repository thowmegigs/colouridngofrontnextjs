"use client"

import { useEffect, useRef, useState } from "react"
import { useCart } from "../providers/cart-provider"
import ProductCard from "./product-card"



type ProductCarouselProps = {
  section: any
}

export default function RelatedProductCarousel({ products }: any) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()
  const [visibleItems, setVisibleItems] = useState(4)
  const [autoScroll, setAutoScroll] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  

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
  // useEffect(() => {
  //   if (!autoScroll) return

  //   const interval = setInterval(() => {
  //     scroll("right")
  //   }, 5000)

  //   return () => clearInterval(interval)
  // }, [autoScroll, currentIndex])

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


  const isHorizontal =true


  return (
    <div className="relative">


      <div
        ref={scrollRef}
        className={`relative overflow-hidden ${isHorizontal ? "flex gap-0 md:gap-1 pb-4 overflow-x-auto scrollbar-hide" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 md:gap-1"}`}
        onMouseEnter={() => setAutoScroll(false)}
        onMouseLeave={() => setAutoScroll(true)}
      >
        {products && Array.isArray(products) && products.map((product: any) => (
          <div key={product.id} className={`${isHorizontal ? "w-[220px] flex-shrink-0" : ""} group`}>
            <ProductCard {...product} vendorName={product.brand??'True Color'} />
          </div>
        ))}
      </div>

     

     
    </div>
  )
}
