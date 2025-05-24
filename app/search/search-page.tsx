"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Mock products data
const mockProducts = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    image: "/wireless-headphones-flatlay.png",
    category: "Electronics",
    slug: "wireless-bluetooth-headphones",
  },
  {
    id: "2",
    name: "Premium Leather Wallet",
    price: 49.99,
    image: "/classic-brown-wallet.png",
    category: "Fashion",
    slug: "premium-leather-wallet",
  },
  {
    id: "3",
    name: "Smart Fitness Tracker",
    price: 129.99,
    image: "/wrist-activity-monitor.png",
    category: "Electronics",
    slug: "smart-fitness-tracker",
  },
  {
    id: "4",
    name: "Portable Bluetooth Speaker",
    price: 59.99,
    image: "/portable-speaker-outdoor.png",
    category: "Electronics",
    slug: "portable-bluetooth-speaker",
  },
  {
    id: "5",
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    image: "/clear-hydration.png",
    category: "Home & Kitchen",
    slug: "stainless-steel-water-bottle",
  },
  {
    id: "6",
    name: "Designer Sunglasses",
    price: 89.99,
    image: "/modern-commute-audio.png",
    category: "Fashion",
    slug: "designer-sunglasses",
  },
]

// Mock categories
const mockCategories = [
  { name: "Electronics", count: 245 },
  { name: "Fashion", count: 189 },
  { name: "Home & Kitchen", count: 156 },
  { name: "Beauty", count: 98 },
]

// Mock recent searches
const initialRecentSearches = ["headphones", "wallet", "fitness tracker", "water bottle"]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState(initialRecentSearches)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef(null)

  // Group products by category for the dropdown
  const filteredProducts = searchQuery
    ? mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  // Group products by category
  const productsByCategory = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
    acc[product.category].push(product)
    return acc
  }, {})

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    // Add to recent searches
    if (!recentSearches.includes(searchQuery)) {
      const updatedSearches = [searchQuery, ...recentSearches.slice(0, 3)]
      setRecentSearches(updatedSearches)
    }

    // In a real app, you would navigate to search results page
    setShowDropdown(false)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setShowDropdown(false)
  }

  return (
    <div className="container py-4 pb-20 md:pb-4">
      <div className="mb-6 relative" ref={searchRef}>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products, brands, categories..."
            className="pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowDropdown(e.target.value.length > 0)
            }}
            onFocus={() => {
              if (searchQuery.length > 0) setShowDropdown(true)
            }}
          />
          {searchQuery && (
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={clearSearch}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </form>

        {/* Search dropdown */}
        {showDropdown && (
          <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border overflow-hidden">
            {filteredProducts.length > 0 ? (
              <div className="max-h-[70vh] overflow-y-auto">
                {Object.entries(productsByCategory).map(([category, products]) => (
                  <div key={category}>
                    <div className="px-4 py-2 bg-gray-50 font-medium text-sm">{category}</div>
                    <ul>
                      {products.map((product) => (
                        <li key={product.id}>
                          <Link
                            href={`/product/${product.slug}`}
                            className="flex items-center px-4 py-2 hover:bg-gray-50"
                            onClick={() => setShowDropdown(false)}
                          >
                            <div className="w-10 h-10 relative flex-shrink-0 mr-3">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{product.name}</p>
                              <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="p-2 border-t">
                  <Button variant="outline" className="w-full text-sm" onClick={handleSearch}>
                    See all results for "{searchQuery}"
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">No products found for "{searchQuery}"</div>
            )}
          </div>
        )}
      </div>

      {!searchQuery && (
        <div>
          {recentSearches.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium">Recent Searches</h2>
                <Button variant="ghost" size="sm" onClick={() => setRecentSearches([])}>
                  Clear All
                </Button>
              </div>
              <ul className="space-y-2">
                {recentSearches.map((search, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <button
                      className="text-sm hover:text-pink-600"
                      onClick={() => {
                        setSearchQuery(search)
                        setShowDropdown(true)
                      }}
                    >
                      {search}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setRecentSearches(recentSearches.filter((s) => s !== search))
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="text-sm font-medium mb-3">Popular Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mockCategories.map((category) => (
                <Link
                  key={category.name}
                  href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex flex-col items-center p-3 border rounded-lg hover:border-pink-600 transition-colors"
                >
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                    <Image
                      src={`/abstract-geometric-shapes.png?key=p9iap&height=64&width=64&query=${category.name}`}
                      alt={category.name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-xs text-muted-foreground">{category.count} items</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
