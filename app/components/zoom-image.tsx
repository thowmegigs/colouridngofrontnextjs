"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, ZoomIn } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"

interface ZoomImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export function ZoomImage({ src, alt, width, height, className }: ZoomImageProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [showFullScreen, setShowFullScreen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    setIsZoomed(true)
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return

    const { left, top, width, height } = imageRef.current.getBoundingClientRect()

    // Calculate position as percentage
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100))

    setPosition({ x, y })
    setZoomPosition({ x, y })
  }

  const handleFullScreenMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.currentTarget) return

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()

    // Calculate position as percentage
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100))

    setZoomPosition({ x, y })
  }

  const openFullScreen = () => {
    setShowFullScreen(true)
  }

  return (
    <>
      <div
        className={`relative overflow-hidden cursor-zoom-in ${className}`}
        ref={imageRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={openFullScreen}
      >
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-contain transition-transform duration-200"
          style={{
            transform: isZoomed ? "scale(1.5)" : "scale(1)",
            transformOrigin: `${position.x}% ${position.y}%`,
          }}
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-2 right-2 bg-white/80 hover:bg-white/90"
          onClick={(e) => {
            e.stopPropagation()
            openFullScreen()
          }}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showFullScreen} onOpenChange={setShowFullScreen}>
        <DialogContent className="max-w-screen-lg w-[90vw] h-[90vh] p-0">
        
          <div className="relative w-full h-full overflow-hidden">
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white/90"
              onClick={() => setShowFullScreen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="w-full h-full cursor-zoom-in" onMouseMove={handleFullScreenMouseMove}>
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "200%",
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
