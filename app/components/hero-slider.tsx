"use client"

import { fetchTopSlider } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { SliderSkeleton } from "./skeleton"

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Use the dynamic api_url in the queryFn
  const { data, isLoading, error } = useQuery<[]>({
    queryKey: ["slider"],
    queryFn: fetchTopSlider
  })

  const nextSlide = () => {
    if (data?.length) {
      setCurrentSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1))
    }
  }

  const prevSlide = () => {
    if (data?.length) {
      setCurrentSlide((prev) => (prev === 0 ? data.length - 1 : prev - 1))
    }
  }

  useEffect(() => {
    if (data?.length) {
      const interval = setInterval(nextSlide, 5000)
      return () => clearInterval(interval)
    }
  }, [data]) // Depend on `data` to reset the interval when data changes

  if (isLoading) {
    return <SliderSkeleton />
  }

  if (error) {
    return <div>Error loading slider data</div>
  }

  if (!data?.length) {
    return <div>No slides available</div>
  }

  return (
    <div className="relative h-[180px] sm:h-[70vh] overflow-hidden">
      {data.map((slide:any, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Link href="/category/summer-collection">
          <div className="relative w-full h-full">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={`Slide ${index + 1}`}
                layout="fill"
                objectFit="cover"
                objectPosition="center top"
                priority
                 className="object-cover object-top"
              />
            </div>
          </Link>
        </div>
      ))}

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous slide</span>
      </button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next slide</span>
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {data.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
