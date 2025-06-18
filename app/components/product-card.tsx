"use client"

import { Button } from "@/components/ui/button"
import { capitalizeWords, generateSlug } from "@/lib/utils"
import { Heart, Star } from "lucide-react"
import Link from "next/link"
import { useCallback, useState } from "react"
import { formatCurrency } from "../lib/utils"
import { useWishlist } from "../providers/wishlist-provider"
import SafeImage from "./SafeImage"
import { showToast } from "./show-toast"

interface ProductCardProps {
  id: number
  name: string
  slug: string
  price: number
  sale_price: number | undefined
  discount?: number
  image: string
  category?: string
  rating?: number
  isNew?: boolean
  isFeatured?: boolean
  vendorId?: number
  vendorName?: string
  variantId?: number
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  sale_price,
  discount,
  image,
  category,
  rating,
  isNew,
  isFeatured,
  vendorId,
  variantId,
  vendorName,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const name_slug = slug ? slug : generateSlug(name)

  const { addItem, isInWishlist, removeItem } = useWishlist()


  // Generate star rating display
  const renderRating = () => {
    if (!rating) return null

    return (
      <div className="flex  justify-center mt-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${star <= Math.round(rating!) ? "text-green-500 fill-green-500" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-xs text-green-600 font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }
  const isInList = isInWishlist(id)
  const handleWishlistToggle = useCallback(() => {


    if (!id) return

    const inWishlist = isInWishlist(id)

    if (inWishlist) {
      removeItem(id)
      showToast({
        title: "Removed from wishlist",
        description: `Product removed from your wishlist`,
      })
    } else {
     
      addItem({
        id,
        name,
        slug,
        price,
        sale_price,
        image,
        vendorId,
        variantId,

      })

      showToast({
        title: "Added to wishlist",
        description: `Product added to your wishlist`,
      })
    }


  }, [id])

  return (<div
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    className="group border  overflow-hidden bg-card h-full transition-all duration-300 hover:shadow-lg 
               w-full"
  >
    <div className="relative">

      <Link href={`/product/${name_slug}`}>
        <div className="w-full relative h-[280px] sm:h-[330px] overflow-hidden">

          <SafeImage
            src={image}
            alt={name}
            width={280}
            height={280}

            className="w-full h-full object-fit transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>
      </Link>

      {/* {price && (
        <div className="absolute top-2 left-2 bg-green-600 text-primary-foreground text-[8px] font-medium px-2 py-1 rounded">
          NEW
        </div>
      )} */}



    </div>

    {renderRating()}

    <div className="py-3 px-2">

      <div className="flex justify-between">
        <p className="font-bold" >{vendorName}</p>
        <Button
          variant="outline"
          size="icon" onClick={handleWishlistToggle}
          className="w-6 h-6 sm:w-8 sm:h-8 bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <Heart className={`h-4 w-4 ${isInList ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
          <span className="sr-only">Add to wishlist</span>
        </Button>
      </div>
      <Link href={`/product/${name_slug}`} className="block">

        <h3 className="font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          <p className="truncate text-sm w-full">

            {capitalizeWords(name)}
          </p>
        </h3>
      </Link>

      <div className="flex items-start justify-between">
        {/* Prices vertically */}
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-semibold text-foreground">{formatCurrency(sale_price)}</span>
          {price && (
            <span className="text-xs line-through text-muted-foreground">
              {formatCurrency(price)}
            </span>
          )}
        </div>

        {/* Discount badge on right */}
        {price && discount > 0 && (
          <div className="text-[10px] sm:text-xs font-medium text-green-600 bg-green-100 px-[3px] py-1 rounded">
            {Math.ceil(discount)}% OFF
          </div>
        )}
      </div>

    </div>
  </div>

  )
}
