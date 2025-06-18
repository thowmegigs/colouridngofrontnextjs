"use client"

import { formatCurrency } from "@/app/lib/utils"
import { useCart } from "@/app/providers/cart-provider"
import { useWishlist } from "@/app/providers/wishlist-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { image_base_url } from "@/contant"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { showToast } from "../components/show-toast"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({})

  const handleRemoveFromWishlist = (id: number, variantId?: number) => {
    removeItem(id, variantId)
  }

  const handleAddToCart = (item: any) => {
   if(addItem({
      id: item.id,
      name: item.name,
      sale_price: item.sale_price,
      price: item.price,
      image: item.image,
      quantity: 1,
      color: item.color,
      size: item.size,
      vendorId: item.vendorId,
      vendorName: item.vendorName,
      maxQuantityAllowed: item.maxQuantityAllowed,
      slug: item.slug,
      stock: item.stock,
      variantId: item.variantId
    })){

    // Show "Added to cart" status
    setAddedToCart((prev) => ({ ...prev, [item.id]: true }))
    removeItem(item.id, item.variantId)
    // Reset after 2 seconds
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [item.id]: false }))
    }, 2000)
  }
  }

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      if(addItem({
        id: item.id,
        name: item.name,
        sale_price: item.sale_price,
        price: item.price,
        image: item.image,
        quantity: 1,
        color: item.color,
        size: item.size,

        variantId: item.variantId,
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        slug: item.slug,
        stock: item.stock,
        maxQuantityAllowed: item.maxQuantityAllowed
      })){
       removeItem(item.id, item.variantId)
      }
      else{
        showToast({description:"Failed to add "+item.name,variant:'destructive'})
      }
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
    showToast({description:"Items added to cart "})
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
            <div className="flex gap-4">
              <Button variant="outline"   onClick={clearWishlist}>
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

          <div className="grid grid-cols-2  md:grid-cols-5 gap-1">
            {items.map((item) => {
              const  src=item.image.includes('https')?item.image:(item.variantId
                ? `${image_base_url}/storage/products/${item.id}/variants/${item.image}`
                : `${image_base_url}/storage/products/${item.id}/${item.image}`)
              
             return  <div key={item.variantId ?? item.id} className="border  overflow-hidden bg-white group">
                <div className="relative">
                  <Link href={`/product/${item.slug}`}>
                     <Image
                       src={src}
                       alt={item.name}
                        width={300}
                        height={300}
                      
                        className="h-[300px] md:h-[350px]object-fit transition-transform group-hover:scale-105"
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
                    <h3 className="truncate text-sm w-full font-medium mb-1 hover:text-pink-600 transition-colors">{item.name}</h3>
                  </Link>
                  {/* <p className="text-sm text-muted-foreground mb-2">Sold by {item.vendorName}</p> */}
 <div className="flex gap-2 mb-2 h-[30px]">
                  {(item.color || item.size) && (
                   <>
                      {item.color && <span className="text-xs bg-gray-100 px-2 py-1 rounded">Color: {item.color}</span>}
                      {item.size && <span className="text-xs bg-gray-100 px-2 py-1 rounded">Size: {item.size}</span>}
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

                 <Button
                  className="w-full border  rounded-none border-primary bg-white text-primary hover:bg-primary hover:text-white"
                  onClick={() => handleAddToCart(item)}
                  disabled={addedToCart[item.id]}
                >
                  Move to Cart
                
                </Button>
                </div>
              </div>
})}
          </div>
        </div>
      )}
    </div>
  )
}
