"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Eye, Heart, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { formatCurrency, getDiscountPercentage } from "../lib/utils"
import { useCart } from "../providers/cart-provider"

// Mock data
const featuredProducts = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    originalPrice: 129.99,
    image: "/modern-commute-audio.png",
    rating: 4.5,
    reviewCount: 128,
    vendorId: "v1",
    vendorName: "Audio Tech",
    link: "/product/wireless-bluetooth-headphones",
  },
  {
    id: "2",
    name: "Smart Fitness Tracker",
    price: 49.99,
    originalPrice: 69.99,
    image: "/wrist-activity-monitor.png",
    rating: 4.2,
    reviewCount: 95,
    vendorId: "v2",
    vendorName: "FitGear",
    link: "/product/smart-fitness-tracker",
  },
  {
    id: "3",
    name: "Premium Leather Wallet",
    price: 39.99,
    originalPrice: null,
    image: "/classic-brown-wallet.png",
    rating: 4.8,
    reviewCount: 67,
    vendorId: "v3",
    vendorName: "Luxury Accessories",
    link: "/product/premium-leather-wallet",
  },
  {
    id: "4",
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    originalPrice: 34.99,
    image: "/clear-hydration.png",
    rating: 4.6,
    reviewCount: 112,
    vendorId: "v4",
    vendorName: "EcoLife",
    link: "/product/stainless-steel-water-bottle",
  },
  {
    id: "5",
    name: "Portable Bluetooth Speaker",
    price: 59.99,
    originalPrice: 89.99,
    image: "/portable-speaker-outdoor.png",
    rating: 4.4,
    reviewCount: 78,
    vendorId: "v1",
    vendorName: "Audio Tech",
    link: "/product/portable-bluetooth-speaker",
  },
  {
    id: "6",
    name: "Organic Cotton T-Shirt",
    price: 19.99,
    originalPrice: null,
    image: "/placeholder.svg?height=400&width=400&query=cotton%20tshirt",
    rating: 4.3,
    reviewCount: 45,
    vendorId: "v5",
    vendorName: "Eco Apparel",
    link: "/product/organic-cotton-t-shirt",
  },
  {
    id: "7",
    name: "Ceramic Coffee Mug",
    price: 14.99,
    originalPrice: 19.99,
    image: "/placeholder.svg?height=400&width=400&query=coffee%20mug",
    rating: 4.7,
    reviewCount: 89,
    vendorId: "v6",
    vendorName: "Home Essentials",
    link: "/product/ceramic-coffee-mug",
  },
  {
    id: "8",
    name: "Wireless Charging Pad",
    price: 29.99,
    originalPrice: 39.99,
    image: "/placeholder.svg?height=400&width=400&query=charging%20pad",
    rating: 4.1,
    reviewCount: 56,
    vendorId: "v7",
    vendorName: "Tech Accessories",
    link: "/product/wireless-charging-pad",
  },
]

const bestsellerProducts = [
  {
    id: "9",
    name: "Ultra HD Smart TV",
    price: 499.99,
    originalPrice: 699.99,
    image: "/placeholder.svg?height=400&width=400&query=smart%20tv",
    rating: 4.7,
    reviewCount: 203,
    vendorId: "v8",
    vendorName: "ElectroMax",
    link: "/product/ultra-hd-smart-tv",
  },
  {
    id: "10",
    name: "Professional Chef Knife",
    price: 89.99,
    originalPrice: 119.99,
    image: "/placeholder.svg?height=400&width=400&query=chef%20knife",
    rating: 4.9,
    reviewCount: 178,
    vendorId: "v9",
    vendorName: "Kitchen Pro",
    link: "/product/professional-chef-knife",
  },
  {
    id: "2",
    name: "Smart Fitness Tracker",
    price: 49.99,
    originalPrice: 69.99,
    image: "/wrist-activity-monitor.png",
    rating: 4.2,
    reviewCount: 95,
    vendorId: "v2",
    vendorName: "FitGear",
    link: "/product/smart-fitness-tracker",
  },
  {
    id: "11",
    name: "Ergonomic Office Chair",
    price: 199.99,
    originalPrice: 249.99,
    image: "/placeholder.svg?height=400&width=400&query=office%20chair",
    rating: 4.6,
    reviewCount: 142,
    vendorId: "v10",
    vendorName: "Office Comfort",
    link: "/product/ergonomic-office-chair",
  },
  {
    id: "12",
    name: "Luxury Scented Candle",
    price: 34.99,
    originalPrice: null,
    image: "/placeholder.svg?height=400&width=400&query=scented%20candle",
    rating: 4.8,
    reviewCount: 87,
    vendorId: "v11",
    vendorName: "Aroma Luxe",
    link: "/product/luxury-scented-candle",
  },
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    originalPrice: 129.99,
    image: "/modern-commute-audio.png",
    rating: 4.5,
    reviewCount: 128,
    vendorId: "v1",
    vendorName: "Audio Tech",
    link: "/product/wireless-bluetooth-headphones",
  },
  {
    id: "13",
    name: "Insulated Travel Mug",
    price: 24.99,
    originalPrice: 29.99,
    image: "/placeholder.svg?height=400&width=400&query=travel%20mug",
    rating: 4.4,
    reviewCount: 76,
    vendorId: "v6",
    vendorName: "Home Essentials",
    link: "/product/insulated-travel-mug",
  },
  {
    id: "14",
    name: "Smartphone Gimbal Stabilizer",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=400&width=400&query=gimbal%20stabilizer",
    rating: 4.3,
    reviewCount: 64,
    vendorId: "v7",
    vendorName: "Tech Accessories",
    link: "/product/smartphone-gimbal-stabilizer",
  },
]

type ProductCarouselProps = {
  type: "featured" | "bestsellers" | "horizontal"
  title?: string
  viewAllLink?: string
}

export default function ProductCarouselDetailPage({ type, title, viewAllLink }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()
  const [visibleItems, setVisibleItems] = useState(4)
  const [autoScroll, setAutoScroll] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  const products = type === "featured" ? featuredProducts : bestsellerProducts

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

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || undefined,
      image: product.image,
      quantity: 1,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
    })
  }

  const isHorizontal = type === "horizontal"

  return (
    <div className="relative">
      {title && viewAllLink && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          <Link href={viewAllLink} className="text-sm font-medium text-primary flex items-center">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      )}

      <div
        ref={scrollRef}
        className={`relative overflow-hidden ${isHorizontal ? "flex gap-4 pb-4 overflow-x-auto scrollbar-hide" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"}`}
        onMouseEnter={() => setAutoScroll(false)}
        onMouseLeave={() => setAutoScroll(true)}
      >
        {products.map((product) => (
          <div key={product.id} className={`${isHorizontal ? "min-w-[280px] flex-shrink-0" : ""} group`}>
            <div className="border rounded-lg overflow-hidden bg-card h-full transition-all duration-300 hover:shadow-lg">
              <div className="relative">
                <Link href={product.link}>
                  <div className="relative h-[280px] overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={280}
                      height={280}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                </Link>

                {product.originalPrice && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                    {getDiscountPercentage(product.originalPrice, product.price)}% OFF
                  </div>
                )}

                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm hover:bg-background"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Add to wishlist</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm hover:bg-background"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Quick view</span>
                  </Button>
                </div>

                <div className="absolute -bottom-10 left-0 right-0 bg-primary text-primary-foreground py-2 opacity-0 group-hover:opacity-100 group-hover:bottom-0 transition-all duration-300">
                  <button
                    className="w-full flex items-center justify-center gap-2 font-medium"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="p-4">
                <Link href={product.link} className="block">
                  <h3 className="font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center mb-2">
                  <div className="flex items-center text-amber-500 mr-2">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm ml-1">{product.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{formatCurrency(product.price)}</div>
                    {product.originalPrice && (
                      <div className="text-xs text-muted-foreground line-through">
                        {formatCurrency(product.originalPrice)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
              className={`w-2 h-2 rounded-full transition-all ${
                index === Math.floor(currentIndex / visibleItems) ? "bg-primary w-6" : "bg-gray-300"
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
