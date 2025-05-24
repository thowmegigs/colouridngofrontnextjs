"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      price: 79.99,
      originalPrice: 99.99,
      image: "/portable-speaker-outdoor.png",
      inStock: true,
      category: "Electronics",
    },
    {
      id: "2",
      name: "Smart Watch Series 5",
      price: 249.99,
      originalPrice: 299.99,
      image: "/cracked-earbud-case.png",
      inStock: true,
      category: "Electronics",
    },
    {
      id: "3",
      name: "Premium Cotton T-Shirt",
      price: 24.99,
      originalPrice: 24.99,
      image: "/tangled-headphones.png",
      inStock: false,
      category: "Fashion",
    },
  ])

  const removeFromWishlist = (id: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id))
  }

  const categories = [...new Set(wishlistItems.map((item) => item.category))]

  return (
    <div className="mobile-app">
      <div className="mobile-header">
        <h1 className="text-xl font-bold">My Wishlist</h1>
        <Badge variant="outline" className="bg-gray-100">
          {wishlistItems.length} items
        </Badge>
      </div>

      <div className="mobile-content pb-20">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 text-center mb-6">
              Add items to your wishlist to keep track of products you love.
            </p>
            <Button asChild>
              <Link href="/categories">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Input type="search" placeholder="Search wishlist..." className="w-full" />
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full mb-4 overflow-x-auto flex-nowrap scrollbar-hide">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="flex-1">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="space-y-4">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="mobile-card">
                      <div className="flex items-start">
                        <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 ml-4">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium">{item.name}</h3>
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
                            {item.originalPrice > item.price && (
                              <span className="text-xs text-gray-500 line-through ml-2">
                                ${item.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            {item.inStock ? (
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                                In Stock
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-200">
                                Out of Stock
                              </Badge>
                            )}
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => removeFromWishlist(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                              <Button size="sm" className="h-8 w-8 p-0" disabled={!item.inStock}>
                                <ShoppingCart className="h-4 w-4" />
                                <span className="sr-only">Add to cart</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="space-y-4">
                    {wishlistItems
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <div key={item.id} className="mobile-card">
                          <div className="flex items-start">
                            <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0 ml-4">
                              <div className="flex justify-between">
                                <h3 className="text-sm font-medium">{item.name}</h3>
                                <button
                                  onClick={() => removeFromWishlist(item.id)}
                                  className="text-gray-400 hover:text-gray-500"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                              <div className="flex items-center mt-1">
                                <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
                                {item.originalPrice > item.price && (
                                  <span className="text-xs text-gray-500 line-through ml-2">
                                    ${item.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                {item.inStock ? (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-green-100 text-green-800 border-green-200"
                                  >
                                    In Stock
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-200">
                                    Out of Stock
                                  </Badge>
                                )}
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => removeFromWishlist(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Remove</span>
                                  </Button>
                                  <Button size="sm" className="h-8 w-8 p-0" disabled={!item.inStock}>
                                    <ShoppingCart className="h-4 w-4" />
                                    <span className="sr-only">Add to cart</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-6 flex flex-col space-y-2">
              <Button className="mobile-button">Add All to Cart</Button>
              <Button variant="outline" className="mobile-button" asChild>
                <Link href="/categories">Continue Shopping</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
