"use client"

import { useMediaQuery } from "@/app/hooks/use-mobile"
import { formatCurrency, getDiscountPercentage } from "@/app/lib/utils"
import { useCart } from "@/app/providers/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter, Heart, Search, ShoppingCart, SlidersHorizontal, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

// Mock categories data
const categories = [
  { id: "1", name: "Electronics", slug: "electronics", icon: "📱" },
  { id: "2", name: "Fashion", slug: "fashion", icon: "👕" },
  { id: "3", name: "Home & Kitchen", slug: "home-kitchen", icon: "🏠" },
  { id: "4", name: "Beauty", slug: "beauty", icon: "💄" },
  { id: "5", name: "Sports", slug: "sports", icon: "⚽" },
  { id: "6", name: "Books", slug: "books", icon: "📚" },
  { id: "7", name: "Toys", slug: "toys", icon: "🧸" },
  { id: "8", name: "Health", slug: "health", icon: "💊" },
  { id: "9", name: "Automotive", slug: "automotive", icon: "🚗" },
  { id: "10", name: "Jewelry", slug: "jewelry", icon: "💍" },
  { id: "11", name: "Garden", slug: "garden", icon: "🌱" },
  { id: "12", name: "Pet Supplies", slug: "pet-supplies", icon: "🐾" },
]

// Mock products generator function
const generateProducts = (categoryId: string, page: number, limit = 10) => {
  const startIndex = (page - 1) * limit
  return Array.from({ length: limit }, (_, i) => ({
    id: `${categoryId}-${startIndex + i + 1}`,
    name: `Product ${startIndex + i + 1} for Category ${categoryId}`,
    price: Math.floor(Math.random() * 200) + 9.99,
    originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 300) + 29.99 : null,
    image: `/placeholder.svg?height=400&width=400`,
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviewCount: Math.floor(Math.random() * 200) + 5,
    vendorId: `v${Math.floor(Math.random() * 10) + 1}`,
    vendorName: `Vendor ${Math.floor(Math.random() * 10) + 1}`,
    link: `/product/product-${categoryId}-${startIndex + i + 1}`,
  }))
}

// Sort options
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
]

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("1")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [sortBy, setSortBy] = useState("featured")
  const [searchQuery, setSearchQuery] = useState("")

  const observer = useRef<IntersectionObserver | null>(null)
  const { addItem } = useCart()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Load initial products
  useEffect(() => {
    setProducts([])
    setPage(1)
    setHasMore(true)
    loadMoreProducts(1, true)
  }, [selectedCategory, sortBy])

  // Function to load more products
  const loadMoreProducts = (pageNum: number, reset = false) => {
    setLoading(true)

    // Simulate API call with setTimeout
    setTimeout(() => {
      const newProducts = generateProducts(selectedCategory, pageNum)

      // Sort products based on sortBy value
      const sortedProducts = [...newProducts]
      switch (sortBy) {
        case "price-low-high":
          sortedProducts.sort((a, b) => a.price - b.price)
          break
        case "price-high-low":
          sortedProducts.sort((a, b) => b.price - a.price)
          break
        case "rating":
          sortedProducts.sort((a, b) => Number.parseFloat(b.rating) - Number.parseFloat(a.rating))
          break
        case "newest":
          // In a real app, you would sort by date
          break
        default:
          // Featured - no specific sorting
          break
      }

      if (reset) {
        setProducts(sortedProducts)
      } else {
        setProducts((prev) => [...prev, ...sortedProducts])
      }

      setLoading(false)
      setHasMore(pageNum < 3) // Limit to 3 pages for demo
    }, 1000)
  }

  // Set up intersection observer for infinite scrolling
  const lastProductRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1
            loadMoreProducts(nextPage)
            return nextPage
          })
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )

  const handleAddToCart = (product: any) => {
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

  // Filter products based on search query
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const selectedCategoryName = categories.find((cat) => cat.id === selectedCategory)?.name || ""

  return (
    <div className="container py-4 md:py-8">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Categories Rail - Left Side */}
        <div className="md:w-64 flex-shrink-0 bg-white rounded-lg border overflow-hidden">
          <div className="p-3 border-b bg-muted/30">
            <h2 className="font-medium">Browse Categories</h2>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="p-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-md flex items-center mb-1 transition-colors ${
                    selectedCategory === category.id ? "bg-pink-100 text-pink-700" : "hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3 text-xl">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products - Right Side */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border overflow-hidden mb-4">
            <div className="p-3 border-b flex flex-col md:flex-row md:items-center justify-between gap-3">
              <h2 className="font-medium">{selectedCategoryName}</h2>

              <div className="flex flex-col md:flex-row gap-3 md:items-center">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 h-9 md:w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Sort & Filter */}
                <div className="flex items-center gap-2">
                  {/* Mobile Filter Button */}
                  <div className="md:hidden">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                          <Filter className="h-4 w-4 mr-2" />
                          Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-full sm:max-w-md">
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="py-4">
                          {/* Filter content would go here */}
                          <p className="text-muted-foreground">Filter options would appear here</p>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center">
                    <div className="flex items-center mr-2 text-sm text-muted-foreground">
                      <span className="hidden sm:inline">Sort by:</span>
                      <SlidersHorizontal className="h-4 w-4 sm:hidden mr-2" />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[160px] h-9 text-sm">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => {
              if (filteredProducts.length === index + 1) {
                // This is the last product, attach ref for infinite scrolling
                return (
                  <div key={product.id} ref={lastProductRef} className="border rounded-lg overflow-hidden bg-card">
                    <div className="relative">
                      <Link href={product.link}>
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-[200px] object-cover"
                        />
                      </Link>

                      {product.originalPrice && (
                        <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
                          {getDiscountPercentage(product.originalPrice, product.price)}% OFF
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background h-8 w-8"
                      >
                        <Heart className="h-4 w-4" />
                        <span className="sr-only">Add to wishlist</span>
                      </Button>
                    </div>

                    <div className="p-4">
                      <Link href={product.link} className="block">
                        <h3 className="font-medium line-clamp-2 mb-1 hover:text-primary transition-colors text-sm">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center mb-2">
                        <div className="flex items-center text-amber-500 mr-2">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs ml-1">{product.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
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

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span className="sr-only">Add to cart</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              } else {
                // Regular product card
                return (
                  <div key={product.id} className="border rounded-lg overflow-hidden bg-card">
                    <div className="relative">
                      <Link href={product.link}>
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-[200px] object-cover"
                        />
                      </Link>

                      {product.originalPrice && (
                        <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
                          {getDiscountPercentage(product.originalPrice, product.price)}% OFF
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background h-8 w-8"
                      >
                        <Heart className="h-4 w-4" />
                        <span className="sr-only">Add to wishlist</span>
                      </Button>
                    </div>

                    <div className="p-4">
                      <Link href={product.link} className="block">
                        <h3 className="font-medium line-clamp-2 mb-1 hover:text-primary transition-colors text-sm">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center mb-2">
                        <div className="flex items-center text-amber-500 mr-2">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs ml-1">{product.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
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

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span className="sr-only">Add to cart</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              }
            })}
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              <span className="ml-2 text-sm text-muted-foreground">Loading more products...</span>
            </div>
          )}

          {/* No products found */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
