"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ReviewImageGalleryProps {
  images: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
  initialIndex?: number
}

export function ReviewImageGallery({ images, open, onOpenChange, initialIndex = 0 }: ReviewImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious()
    } else if (e.key === "ArrowRight") {
      handleNext()
    } else if (e.key === "Escape") {
      onOpenChange(false)
    }
  }

  if (!images || images.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 bg-black/95 border-none" onKeyDown={handleKeyDown} tabIndex={0}>
        <div className="relative flex flex-col items-center justify-center h-full">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-white z-10 hover:bg-white/10"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>

          {/* Main image */}
          <div className="relative w-full h-[70vh] flex items-center justify-center p-4">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`Review image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          </div>

          {/* Navigation controls */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 ml-2"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-8 w-8" />
              <span className="sr-only">Previous image</span>
            </Button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 mr-2"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
              <span className="sr-only">Next image</span>
            </Button>
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-10 left-0 right-0">
              <div className="flex justify-center gap-2 px-4 overflow-x-auto py-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                      index === currentIndex ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
