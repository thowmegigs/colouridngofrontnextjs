"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Mock search results
const searchResults = {
  categories: [
    {
      name: "Electronics",
      products: [
        {
          id: "e1",
          name: "Wireless Bluetooth Headphones",
          price: 79.99,
          image: "/modern-commute-audio.png",
          link: "/product/wireless-bluetooth-headphones",
        },
        {
          id: "e2",
          name: "Smart Fitness Tracker",
          price: 49.99,
          image: "/wrist-activity-monitor.png",
          link: "/product/smart-fitness-tracker",
        },
      ],
    },
    {
      name: "Fashion",
      products: [
        {
          id: "f1",
          name: "Premium Leather Wallet",
          price: 39.99,
          image: "/classic-brown-wallet.png",
          link: "/product/premium-leather-wallet",
        },
      ],
    },
    {
      name: "Home",
      products: [
        {
          id: "h1",
          name: "Stainless Steel Water Bottle",
          price: 24.99,
          image: "/clear-hydration.png",
          link: "/product/stainless-steel-water-bottle",
        },
      ],
    },
  ],
}

export default function SearchDropdown() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (e.target.value.length > 2) {
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for products..."
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => {
            if (searchQuery.length > 2) setShowResults(true)
          }}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-[70vh] overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Search Results</h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowResults(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {searchResults.categories.map((category) => (
              <div key={category.name} className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">{category.name}</h4>
                <div className="space-y-3">
                  {category.products.map((product) => (
                    <Link
                      key={product.id}
                      href={product.link}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                      onClick={() => setShowResults(false)}
                    >
                      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium">{product.name}</div>
                        <div className="text-sm text-pink-600 font-medium">${product.price.toFixed(2)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center mt-2">
              <Link
                href={`/search?q=${encodeURIComponent(searchQuery)}`}
                className="text-sm text-pink-600 hover:underline"
                onClick={() => setShowResults(false)}
              >
                View all results
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
