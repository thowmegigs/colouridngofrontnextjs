"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { capitalize } from "../lib/utils"
import SafeImage from "./SafeImage"

export default function CategoryCircles({ categories }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startAutoScroll = () => {
    if (scrollIntervalRef.current) return // Prevent multiple intervals
    scrollIntervalRef.current = setInterval(() => {
      const scrollContainer = scrollRef.current
      if (!scrollContainer) return

      scrollContainer.scrollLeft += 1

      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollContainer.scrollLeft = 0
      }
    }, 30)
  }

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
      scrollIntervalRef.current = null
    }
  }

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    startAutoScroll()

    const handleUserInteraction = () => {
      stopAutoScroll()
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    }

    const handleInteractionEnd = () => {
      resumeTimeoutRef.current = setTimeout(() => {
        startAutoScroll()
      }, 3000)
    }

    scrollContainer.addEventListener("touchstart", handleUserInteraction)
    scrollContainer.addEventListener("touchend", handleInteractionEnd)
    scrollContainer.addEventListener("mousedown", handleUserInteraction)
    scrollContainer.addEventListener("mouseup", handleInteractionEnd)
    scrollContainer.addEventListener("scroll", handleUserInteraction)

    return () => {
      stopAutoScroll()
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)

      scrollContainer.removeEventListener("touchstart", handleUserInteraction)
      scrollContainer.removeEventListener("touchend", handleInteractionEnd)
      scrollContainer.removeEventListener("mousedown", handleUserInteraction)
      scrollContainer.removeEventListener("mouseup", handleInteractionEnd)
      scrollContainer.removeEventListener("scroll", handleUserInteraction)
    }
  }, [])

  return (
    <div ref={scrollRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
      {categories.map((category) => (
        <Link key={category.id} href={`/category/${category.slug}`} className="flex-shrink-0 snap-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 md:w-50 md:h-50 rounded-full overflow-hidden border border-border hover:border-primary transition-colors">
              <SafeImage
                src={category.image}
                alt={category.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-center mt-2">{capitalize(category.name)}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
