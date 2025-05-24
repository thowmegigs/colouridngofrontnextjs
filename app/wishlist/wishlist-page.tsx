"use client"

import { formatCurrency } from "@/app/lib/utils"
import { useCart } from "@/app/providers/cart-provider"
import { useWishlist } from "@/app/providers/wishlist-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({})

  const handleRemoveFromWishlist = (id: string) => {
    removeItem(id)
  }

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      quantity: 1,
      color: item.color,
      size: item.size,
      vendorId: item.vendorId,
      vendorName: item.vendorName,
    })

    // Show "Added to cart" status
    setAddedToCart((prev) => ({ ...prev, [item.id]: true }))

    // Reset after 2 seconds
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [item.id]: false }))
    }, 2000)
  }

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        quantity: 1,
        color: item.color,
        size: item.size,
        vendorId: item.vendorId,
        vendorName: item.vendorName,
      })
    })

    // Show alert or notification
    const newAddedState: Record<string, boolean> = {}
    items.forEach((item) => {
      newAddedState[item.id] = true
    })
    setAddedToCart(newAddedState)

    // Reset after 2 seconds
    setTimeout(() => {
      setAddedToCart({})
    }, 2000)
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My Wishlist</h1>

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
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">{items.length} items in your wishlist</p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={clearWishlist}>
                Clear Wishlist
              </Button>
              <Button onClick={handleAddAllToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add All to Cart
              </Button>
            </div>
          </div>

          {Object.keys(addedToCart).some((key) => addedToCart[key]) && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <ShoppingCart className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Added to cart</AlertTitle>
              <AlertDescription>Item(s) successfully added to your cart.</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden bg-white group">
                <div className="relative">
                  <Link href={`/product/${item.slug}`}>
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-pink-500 hover:bg-pink-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-4">
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="font-medium mb-1 hover:text-pink-600 transition-colors">{item.name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">Sold by {item.vendorName}</p>

                  {(item.color || item.size) && (
                    <div className="flex gap-2 mb-2">
                      {item.color && <span className="text-xs bg-gray-100 px-2 py-1 rounded">Color: {item.color}</span>}
                      {item.size && <span className="text-xs bg-gray-100 px-2 py-1 rounded">Size: {item.size}</span>}
                    </div>
                  )}

                  <div className="flex items-center mb-3">
                    <span className="font-medium text-lg">{formatCurrency(item.price)}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        {formatCurrency(item.originalPrice)}
                      </span>
                    )}
                  </div>

                  <Button className="w-full" onClick={() => handleAddToCart(item)} disabled={addedToCart[item.id]}>
                    {addedToCart[item.id] ? (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
