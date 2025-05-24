"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export type WishlistItem = {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  vendorId: string
  vendorName: string
  color?: string
  size?: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      try {
        setItems(JSON.parse(storedWishlist))
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error)
        localStorage.removeItem("wishlist")
      }
    }
    setMounted(true)
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("wishlist", JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (item: WishlistItem) => {
    setItems((prevItems) => {
      // Check if item already exists in wishlist
      if (prevItems.some((existingItem) => existingItem.id === item.id)) {
        return prevItems
      }
      return [...prevItems, item]
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id)
  }

  const clearWishlist = () => {
    setItems([])
  }

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
