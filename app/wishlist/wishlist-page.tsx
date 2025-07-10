"use client"

import { formatCurrency } from "@/app/lib/utils"
import { useWishlist } from "@/app/providers/wishlist-provider"
import { Button } from "@/components/ui/button"
import { image_base_url } from "@/contant"
import { Heart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()

  const handleRemoveFromWishlist = (id: number, variantId?: number) => {
    removeItem(id, variantId)
  }

  return (
    <div className="container pb-20 pt-5 px-2">
      <h1 className="hidden md:block text-2xl md:text-3xl font-bold mb-6">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-50 flex items-center justify-center">
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6">
            Add items to your wishlist to keep track of products you're interested in.
          </p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-muted-foreground">{items.length} item(s)</p>
            <Button variant="outline" onClick={clearWishlist}>
              Clear Wishlist
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
            {items.map((item) => {
              const src = item.image.includes("https")
                ? item.image
                : item.variantId
                  ? `${image_base_url}/storage/products/${item.id}/variants/${item.image}`
                  : `${image_base_url}/storage/products/${item.id}/${item.image}`

              return (
                <div key={item.variantId ?? item.id} className="border overflow-hidden bg-white group">
                  <div className="relative">
                    <Link href={`/product/${item.slug}`}>
                      <Image
                        src={src}
                        alt={item.name}
                        width={300}
                        height={300}
                        className="h-[280px] md:h-[350px] object-fit transition-transform group-hover:scale-105"
                      />
                    </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id, item.variantId)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-pink-500 hover:bg-pink-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-0 rounded-none">
                    <div className="p-2">
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="truncate text-sm w-full font-medium mb-1 hover:text-pink-600 transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex gap-2 mb-2 h-[30px]">
                        {(item.color || item.size) && (
                          <>
                            {item.color && (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Color: {item.color}</span>
                            )}
                            {item.size && (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Size: {item.size}</span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="font-medium text-sm">{formatCurrency(item.sale_price)}</span>
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>

                    <Link href={`/product/${item.slug}`}>
                      <Button className="w-full border rounded-none border-primary bg-white text-primary hover:bg-primary hover:text-white">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
