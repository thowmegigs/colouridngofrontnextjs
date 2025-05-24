"use client"

import { AuthModal } from "@/app/components/auth-modal"
import { AvailableCouponsModal } from "@/app/components/available-coupons-modal"
import { ReviewForm } from "@/app/components/review-form"
import { ReviewImageGallery } from "@/app/components/review-image-gallery"
import { ShareDialog } from "@/app/components/share-dialog"
import { ZoomImage } from "@/app/components/zoom-image"
import { formatCurrency } from "@/app/lib/utils"
import { useCart } from "@/app/providers/cart-provider"
import { useWishlist } from "@/app/providers/wishlist-provider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { fetchProductDetail, type ProductReview } from "@/lib/api"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  AlertCircle,
  Box,
  Clock,
  Heart,
  ImageIcon,
  Info,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  Shield,
  Star,
  Store,
  Tag,
  Truck,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type ProductDetailProps = {
  slug: string
}

export default function ProductDetail({ slug }: ProductDetailProps) {
  const queryClient = useQueryClient()

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductDetail(slug),
  })

  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showCouponsModal, setShowCouponsModal] = useState(false)
  const [availableCoupons, setAvailableCoupons] = useState([])
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showReviewGallery, setShowReviewGallery] = useState(false)
  const [selectedReviewImages, setSelectedReviewImages] = useState<string[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    if (product) setAvailableCoupons(product.related_coupons)
  }, [product])

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)
  }, [])

  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  // Get the current URL for sharing
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  // Extract available colors and sizes from attributes
  const availableColors = useMemo(() => {
    if (!product?.attributes?.Color) return []
    return product.attributes.Color.map((color: string) => ({
      id: color.toLowerCase(),
      name: color,
      value: getColorHex(color),
    }))
  }, [product])

  const availableSizes = useMemo(() => {
    if (!product?.attributes?.Size) return []
    return product.attributes.Size.map((size: string) => ({
      id: size,
      name: size,
    }))
  }, [product])

  // Parse variant name to extract color and size
  const parseVariantName = (variantName: string) => {
    const parts = variantName.split("-")
    if (parts.length !== 2) return { color: null, size: null }

    // Check if first part is a color
    const firstPartLower = parts[0].toLowerCase()
    const secondPartLower = parts[1].toLowerCase()

    const isFirstPartColor = availableColors.some((c) => c.name.toLowerCase() === firstPartLower)
    const isSecondPartColor = availableColors.some((c) => c.name.toLowerCase() === secondPartLower)

    if (isFirstPartColor) {
      return { color: firstPartLower, size: parts[1] }
    } else if (isSecondPartColor) {
      return { color: secondPartLower, size: parts[0] }
    }

    // If we can't determine, make a best guess
    if (availableSizes.some((s) => s.id === parts[0])) {
      return { color: secondPartLower, size: parts[0] }
    } else {
      return { color: firstPartLower, size: parts[1] }
    }
  }

  // Get all available variants for a product
  const allVariants = useMemo(() => {
    if (!product?.variants) return []

    return product.variants.map((variant: any) => {
      const { color, size } = parseVariantName(variant.name)
      return {
        ...variant,
        parsedColor: color,
        parsedSize: size,
      }
    })
  }, [product])

  // Set initial color, size, and variant when product data is loaded
  useEffect(() => {
    if (product && allVariants.length > 0) {
      // Find the first variant with both color and size
      const firstCompleteVariant = allVariants.find((v) => v.parsedColor && v.parsedSize)

      if (firstCompleteVariant) {
        setSelectedColor(firstCompleteVariant.parsedColor)
        setSelectedSize(firstCompleteVariant.parsedSize)
      } else if (allVariants[0].parsedColor) {
        setSelectedColor(allVariants[0].parsedColor)
      } else if (allVariants[0].parsedSize) {
        setSelectedSize(allVariants[0].parsedSize)
      }

      setQuantity(1)
      setActiveImage(0)
    }
  }, [product, allVariants])

  // Find the selected variant based on color and size
  const selectedVariant = useMemo(() => {
    if (!product || allVariants.length === 0) return null

    // If no color or size is selected yet, return the first variant
    if (!selectedColor && !selectedSize) {
      return allVariants[0]
    }

    // Try to find an exact match for both color and size
    if (selectedColor && selectedSize) {
      const exactMatch = allVariants.find((v) => v.parsedColor === selectedColor && v.parsedSize === selectedSize)
      if (exactMatch) return exactMatch
    }

    // If only color is selected, find a variant with that color
    if (selectedColor && !selectedSize) {
      return allVariants.find((v) => v.parsedColor === selectedColor)
    }

    // If only size is selected, find a variant with that size
    if (!selectedColor && selectedSize) {
      return allVariants.find((v) => v.parsedSize === selectedSize)
    }

    // Fallback to first variant
    return allVariants[0]
  }, [product, allVariants, selectedColor, selectedSize])

  // Get available sizes for the selected color
  const availableSizesForColor = useMemo(() => {
    if (!product || !selectedColor) return []

    // Find all variants with the selected color
    const variantsWithColor = allVariants.filter((v) => v.parsedColor === selectedColor)

    // Extract unique sizes from these variants
    const sizesForColor = [...new Set(variantsWithColor.map((v) => v.parsedSize))]

    // Map to the format needed for the UI
    return sizesForColor
      .filter(Boolean) // Remove null/undefined
      .map((size) => ({
        id: size,
        name: size,
        available: variantsWithColor.some((v) => v.parsedSize === size && v.quantity > 0),
      }))
  }, [product, allVariants, selectedColor])

  // Get available colors for the selected size
  const availableColorsForSize = useMemo(() => {
    if (!product || !selectedSize)
      return availableColors.map((color) => ({
        ...color,
        available: true,
      }))

    // Find all variants with the selected size
    const variantsWithSize = allVariants.filter((v) => v.parsedSize === selectedSize)

    // Extract unique colors from these variants
    const colorsForSize = [...new Set(variantsWithSize.map((v) => v.parsedColor))]

    // Map to the format needed for the UI
    return availableColors.map((color) => ({
      ...color,
      available:
        colorsForSize.includes(color.id) && variantsWithSize.some((v) => v.parsedColor === color.id && v.quantity > 0),
    }))
  }, [product, allVariants, selectedSize, availableColors])

  // Get images for the selected variant or fallback to product images
  const variantImages = useMemo(() => {
    // If we have a selected variant with images, use those
    if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
      return selectedVariant.images.map((img: string) => getImageUrl(img))
    }

    // Otherwise fall back to product images
    return product?.images.map((img: string) => getImageUrl(img)) || []
  }, [selectedVariant, product])

  const handleQuantityChange = (newQuantity: number) => {
    const maxQuantity = selectedVariant ? selectedVariant.quantity : product?.quantity || 1
    setQuantity(Math.max(1, Math.min(newQuantity, maxQuantity)))
  }

  const handleColorChange = (colorId: string) => {
    if (colorId === selectedColor) return
    setSelectedColor(colorId)

    // Check if the current size is available for the new color
    const sizesForNewColor = allVariants
      .filter((v) => v.parsedColor === colorId)
      .map((v) => v.parsedSize)
      .filter(Boolean)

    if (!sizesForNewColor.includes(selectedSize)) {
      // If current size is not available, select the first available size
      setSelectedSize(sizesForNewColor[0] || "")
    }

    // Reset active image
    setActiveImage(0)
  }

  const handleSizeChange = (sizeId: string) => {
    if (sizeId === selectedSize) return
    setSelectedSize(sizeId)

    // Check if the current color is available for the new size
    const colorsForNewSize = allVariants
      .filter((v) => v.parsedSize === sizeId)
      .map((v) => v.parsedColor)
      .filter(Boolean)

    if (!colorsForNewSize.includes(selectedColor)) {
      // If current color is not available, select the first available color
      setSelectedColor(colorsForNewSize[0] || "")
    }

    // Reset active image
    setActiveImage(0)
  }

  const handleAddToCart = () => {
    if (!product) return

    if (selectedVariant) {
      // Add variant to cart
      addItem({
        id: selectedVariant.id.toString(),
        name: product.name,
        price: Number.parseFloat(selectedVariant.sale_price || selectedVariant.price),
        originalPrice: Number.parseFloat(selectedVariant.price),
        image: selectedVariant.image || product.images[0],
        quantity,
        color: selectedVariant.parsedColor
          ? selectedVariant.parsedColor.charAt(0).toUpperCase() + selectedVariant.parsedColor.slice(1)
          : undefined,
        size: selectedVariant.parsedSize || undefined,
        vendorId: "v1", // This would come from the API in a real implementation
        vendorName: product.brand, // Using brand as vendor name
        discountMessage: Number.parseFloat(product.discount) > 0 ? `${product.discount}% OFF` : undefined,
      })

      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} added to your cart`,
      })
    } else {
      // Add product to cart (no variant)
      addItem({
        id: product.id.toString(),
        name: product.name,
        price: Number.parseFloat(product.sale_price || product.price),
        originalPrice: Number.parseFloat(product.price),
        image: product.images[0],
        quantity,
        vendorId: "v1",
        vendorName: product.brand,
        discountMessage: Number.parseFloat(product.discount) > 0 ? `${product.discount}% OFF` : undefined,
      })

      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} added to your cart`,
      })
    }
  }

  const handleWishlistToggle = () => {
    if (!product || !selectedVariant) return

    const inWishlist = isInWishlist(selectedVariant.id.toString())

    if (inWishlist) {
      removeFromWishlist(selectedVariant.id.toString())
      toast({
        title: "Removed from wishlist",
        description: `${product.name} removed from your wishlist`,
      })
    } else {
      addToWishlist({
        id: selectedVariant.id.toString(),
        name: product.name,
        slug: slug,
        price: Number.parseFloat(selectedVariant.sale_price || selectedVariant.price),
        originalPrice: Number.parseFloat(selectedVariant.price),
        image: selectedVariant.image || product.images[0],
        vendorId: "v1",
        vendorName: product.brand,
        color: selectedVariant.parsedColor
          ? selectedVariant.parsedColor.charAt(0).toUpperCase() + selectedVariant.parsedColor.slice(1)
          : undefined,
        size: selectedVariant.parsedSize || undefined,
      })

      toast({
        title: "Added to wishlist",
        description: `${product.name} added to your wishlist`,
      })
    }
  }

  const handleApplyCoupon = (code: string) => {
    toast({
      title: "Coupon copied",
      description: "Apply this coupon during checkout to get your discount",
    })
  }

  const handleReviewSuccess = (newReview: ProductReview) => {
    // Close the review form
    setShowReviewForm(false)

    // Update the product data in the cache with the new review
    if (product) {
      const updatedProduct = {
        ...product,
        reviews: [...product.reviews, newReview],
        // Recalculate the average rating
        ratings: calculateAverageRating([...product.reviews, newReview]),
      }

      // Update the query cache
      queryClient.setQueryData(["product", slug], updatedProduct)
    }
  }

  const calculateAverageRating = (reviews: ProductReview[]): number => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((total, review) => total + review.rating, 0)
    return Number((sum / reviews.length).toFixed(1))
  }

  const handleWriteReviewClick = () => {
    if (isLoggedIn) {
      setShowReviewForm(true)
    } else {
      setIsAuthModalOpen(true)
    }
  }

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false)
    setIsLoggedIn(true)
    setShowReviewForm(true)
  }

  const handleOpenReviewGallery = (images: string[], initialIndex = 0) => {
    setSelectedReviewImages(images)
    setSelectedImageIndex(initialIndex)
    setShowReviewGallery(true)
  }

  // Helper function to get color hex values
  function getColorHex(colorName: string): string {
    const colorMap: Record<string, string> = {
      red: "#ff0000",
      black: "#000000",
      white: "#ffffff",
      blue: "#0000ff",
      "navy blue": "#000080",
      pink: "#FFC0CB",
      green: "#008000",
      yellow: "#FFFF00",
      purple: "#800080",
      orange: "#FFA500",
      brown: "#A52A2A",
      gray: "#808080",
      // Add more colors as needed
    }

    return colorMap[colorName.toLowerCase()] || "#cccccc"
  }

  // Helper function to get full image URL
  function getImageUrl(imagePath: string): string {
    // If the image path already starts with http or https, return it as is
    if (imagePath.startsWith("http")) {
      return imagePath
    }

    // If the image path starts with a slash, it's already a relative path
    if (imagePath.startsWith("/")) {
      return imagePath
    }

    // Otherwise, prepend a slash to make it a relative path
    return `/${imagePath}`
  }

  const inWishlist = selectedVariant ? isInWishlist(selectedVariant.id.toString()) : false

  // Get the current product price for coupon eligibility
  const currentPrice = selectedVariant
    ? Number.parseFloat(selectedVariant.sale_price || selectedVariant.price)
    : product
      ? Number.parseFloat(product.sale_price || product.price)
      : 0

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  if (isError || !product) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load product details. Please try again later.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-6 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="border rounded-sm overflow-hidden bg-white">
            <ZoomImage
              src={variantImages[activeImage] || "/placeholder.svg?height=600&width=600&query=product"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full aspect-square"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {variantImages.map((image, index) => (
              <button
                key={index}
                className={`border rounded-sm overflow-hidden flex-shrink-0 ${
                  activeImage === index ? "border-primary" : "border-border"
                }`}
                onClick={() => setActiveImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg?height=80&width=80&query=product+thumbnail"}
                  alt={`${product.name} - Image ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs font-normal">
                {product.category}
              </Badge>
              {product.brand && (
                <Badge variant="outline" className="text-xs font-normal">
                  {product.brand}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            {product.short_description && <p className="text-muted-foreground mt-2">{product.short_description}</p>}

            <div className="flex items-center mt-2">
              <div className="flex items-center text-amber-500 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.ratings) ? "fill-current" : ""}`} />
                ))}
                <span className="text-sm ml-1">{product.ratings}</span>
              </div>
              <Link href="#reviews" className="text-sm text-muted-foreground hover:text-primary">
                {product.reviews.length} reviews
              </Link>
            </div>
          </div>

          {/* Product price display */}
          <div className="flex items-baseline">
            {selectedVariant ? (
              // Show variant price
              <>
                <div className="text-3xl font-bold">
                  {formatCurrency(Number.parseFloat(selectedVariant.sale_price || selectedVariant.price))}
                </div>
                {selectedVariant.sale_price &&
                  Number.parseFloat(selectedVariant.price) > Number.parseFloat(selectedVariant.sale_price) && (
                    <>
                      <div className="text-lg text-muted-foreground line-through ml-2">
                        {formatCurrency(Number.parseFloat(selectedVariant.price))}
                      </div>
                      {Number.parseFloat(product.discount) > 0 && (
                        <div className="ml-2 text-sm font-medium text-green-600">{product.discount}% OFF</div>
                      )}
                    </>
                  )}
              </>
            ) : (
              // Fallback to product price
              <>
                <div className="text-3xl font-bold">
                  {formatCurrency(Number.parseFloat(product.sale_price || product.price))}
                </div>
                {product.sale_price && Number.parseFloat(product.price) > Number.parseFloat(product.sale_price) && (
                  <>
                    <div className="text-lg text-muted-foreground line-through ml-2">
                      {formatCurrency(Number.parseFloat(product.price))}
                    </div>
                    {Number.parseFloat(product.discount) > 0 && (
                      <div className="ml-2 text-sm font-medium text-green-600">{product.discount}% OFF</div>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Available Coupons Link */}
          {availableCoupons.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setShowCouponsModal(true)}
                className="text-primary text-sm font-medium flex items-center hover:underline"
              >
                <Tag className="h-4 w-4 mr-1" />
                {availableCoupons.length} {availableCoupons.length === 1 ? "coupon" : "coupons"} available
              </button>
            </div>
          )}

          {/* Product Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {product.fabric && (
              <div className="flex items-center">
                <Box className="h-4 w-4 mr-1" />
                <span>Fabric: {product.fabric}</span>
              </div>
            )}
            <div className="flex items-center">
              <Store className="h-4 w-4 mr-1" />
              <span>Brand: {product.brand}</span>
            </div>
            {selectedVariant && (
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                <span>SKU: {selectedVariant.id}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {availableColorsForSize.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="color" className="text-base font-medium">
                    Color:{" "}
                    <span className="font-normal">
                      {selectedColor
                        ? selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)
                        : "Select a color"}
                    </span>
                  </Label>
                </div>
                <RadioGroup
                  id="color"
                  value={selectedColor}
                  onValueChange={handleColorChange}
                  className="flex flex-wrap gap-2"
                >
                  {availableColorsForSize.map((color) => (
                    <div key={color.id} className="relative">
                      <Label
                        htmlFor={`color-${color.id}`}
                        className={`relative w-10 h-10 rounded-full cursor-pointer flex items-center justify-center border-2 ${
                          !color.available
                            ? "opacity-50"
                            : selectedColor === color.id
                              ? "border-primary ring-2 ring-primary/30"
                              : "border-transparent"
                        }`}
                      >
                        <RadioGroupItem
                          id={`color-${color.id}`}
                          value={color.id}
                          className="sr-only"
                          disabled={!color.available}
                        />
                        <span
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                        <span className="sr-only">{color.name}</span>
                      </Label>
                      {!color.available && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <X className="h-6 w-6 text-red-500 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {availableSizesForColor.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="size" className="text-base font-medium">
                    Size: <span className="font-normal">{selectedSize || "Select a size"}</span>
                  </Label>
                  {product.size_chart_image && (
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => setShowSizeChart(true)}
                    >
                      Size Chart
                    </button>
                  )}
                </div>
                <RadioGroup
                  id="size"
                  value={selectedSize}
                  onValueChange={handleSizeChange}
                  className="flex flex-wrap gap-2"
                >
                  {availableSizesForColor.map((size) => (
                    <div key={size.id} className="relative">
                      <Label
                        htmlFor={`size-${size.id}`}
                        className={`border rounded-md px-4 py-2 cursor-pointer text-sm ${
                          !size.available
                            ? "bg-gray-100 text-gray-400 border-gray-200"
                            : selectedSize === size.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-input hover:bg-muted"
                        }`}
                      >
                        <RadioGroupItem
                          id={`size-${size.id}`}
                          value={size.id}
                          className="sr-only"
                          disabled={!size.available}
                        />
                        {size.name}
                        {!size.available && <span className="ml-1">(Out of stock)</span>}
                      </Label>
                      {!size.available && (
                        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 border-t border-gray-400" />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Stock information */}
            <div className="mt-4 p-3 bg-muted/30 rounded-md">
              <div className="text-sm">
                <span className="font-medium">Selected Variant:</span>{" "}
                {selectedVariant ? selectedVariant.name : "Default"}
              </div>
              <div className="text-sm mt-1">
                <span className="font-medium">Stock:</span>{" "}
                {selectedVariant ? selectedVariant.quantity : product.quantity || "Unknown"} available
              </div>
              {selectedVariant && selectedVariant.quantity <= 5 && selectedVariant.quantity > 0 && (
                <div className="text-sm mt-1 text-amber-600">
                  <span className="font-medium">Low Stock!</span> Only {selectedVariant.quantity} left
                </div>
              )}
              {selectedVariant && selectedVariant.quantity <= 0 && (
                <div className="text-sm mt-1 text-red-600">
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="quantity" className="text-base font-medium mb-2 block">
                Quantity
              </Label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedVariant?.quantity || 1}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                  className="w-16 text-center border-y border-input py-2"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={!selectedVariant || quantity >= selectedVariant.quantity}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-primary text-white flex-1"
                onClick={handleAddToCart}
                disabled={selectedVariant ? selectedVariant.quantity <= 0 : product?.quantity <= 0}
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className={`border-primary flex-1 ${inWishlist ? "bg-pink-50 text-pink-600" : "text-primary"}`}
                onClick={handleWishlistToggle}
                disabled={!selectedVariant}
              >
                <Heart className={`h-5 w-5 mr-2 ${inWishlist ? "fill-current" : ""}`} />
                {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </div>

            {/* Return Policy */}
            <div className="border rounded-lg overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="return-policy" className="border-none">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center">
                      <RotateCcw className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Return & Refund Policy</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="font-medium w-32">Return Eligibility:</span>
                        <span>30 days from delivery</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Condition:</span>
                        <span>Unused and in original packaging</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Return Process:</span>
                        <span>Initiate return from your order history</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Refund:</span>
                        <span>Original payment method within 5-7 business days</span>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <Link href="/returns" className="text-primary flex items-center hover:underline">
                          <Info className="h-4 w-4 mr-1" />
                          View detailed return policy
                        </Link>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-b">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => setShowShareDialog(true)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <div className="flex space-x-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Truck className="h-4 w-4 mr-2" />
                  Free Shipping
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  Delivery: 3-5 days
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 mr-2" />
                  Warranty
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full border-b">
            <TabsTrigger value="description" className="flex-1">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" className="flex-1">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" id="reviews" className="flex-1">
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="space-y-4 mt-6">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <tbody className="divide-y divide-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">Brand</th>
                    <td className="px-4 py-3 text-sm">{product.brand}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">Category</th>
                    <td className="px-4 py-3 text-sm">{product.category}</td>
                  </tr>
                  {Object.entries(product.attributes).map(([key, values], index) => (
                    <tr key={index}>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">{key}</th>
                      <td className="px-4 py-3 text-sm">{values.join(", ")}</td>
                    </tr>
                  ))}
                  {product.fabric && (
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">Fabric</th>
                      <td className="px-4 py-3 text-sm">{product.fabric}</td>
                    </tr>
                  )}
                  {product.fit && (
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">Fit</th>
                      <td className="px-4 py-3 text-sm">{product.fit}</td>
                    </tr>
                  )}

                  {product.neck_type && (
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">Neck Type</th>
                      <td className="px-4 py-3 text-sm">{product.neck_type}</td>
                    </tr>
                  )}

                  {product.sleeve_type && (
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">
                        Sleeve Type
                      </th>
                      <td className="px-4 py-3 text-sm">{product.sleeve_type}</td>
                    </tr>
                  )}

                  {product.pattern && (
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">Pattern</th>
                      <td className="px-4 py-3 text-sm">{product.pattern}</td>
                    </tr>
                  )}

                  {product.occasion && (
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">Occasion</th>
                      <td className="px-4 py-3 text-sm">{product.occasion}</td>
                    </tr>
                  )}

                  {product.length && (
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">Length</th>
                      <td className="px-4 py-3 text-sm">{product.length}</td>
                    </tr>
                  )}

                  {product.waist_rise && (
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">
                        Waist Rise
                      </th>
                      <td className="px-4 py-3 text-sm">{product.waist_rise}</td>
                    </tr>
                  )}

                  {product.closure && (
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">Closure</th>
                      <td className="px-4 py-3 text-sm">{product.closure}</td>
                    </tr>
                  )}

                  {product.hemline && (
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">Hemline</th>
                      <td className="px-4 py-3 text-sm">{product.hemline}</td>
                    </tr>
                  )}

                  {product.wash_care && (
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">Wash Care</th>
                      <td className="px-4 py-3 text-sm">{product.wash_care}</td>
                    </tr>
                  )}

                  {product.surface_style && (
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">
                        Surface Style
                      </th>
                      <td className="px-4 py-3 text-sm">{product.surface_style}</td>
                    </tr>
                  )}

                  {product.stretch && (
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">Stretch</th>
                      <td className="px-4 py-3 text-sm">{product.stretch}</td>
                    </tr>
                  )}

                  {product.transparency && (
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">
                        Transparency
                      </th>
                      <td className="px-4 py-3 text-sm">{product.transparency}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="space-y-6 mt-6">
            {product.reviews.length > 0 ? (
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="border rounded-lg p-6 space-y-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold">{product.ratings}</div>
                      <div className="flex justify-center my-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.ratings) ? "text-amber-500 fill-current" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">Based on {product.reviews.length} reviews</div>
                    </div>

                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = product.reviews.filter((r) => Math.floor(r.rating) === star).length
                        const percentage = (count / product.reviews.length) * 100 || 0

                        return (
                          <div key={star} className="flex items-center">
                            <div className="flex items-center w-12">
                              <span className="text-sm">{star}</span>
                              <Star className="h-4 w-4 text-amber-500 fill-current ml-1" />
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 ml-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-sm text-muted-foreground ml-2 w-12 text-right">{count}</span>
                          </div>
                        )
                      })}
                    </div>

                    <Button className="bg-primary text-white" onClick={handleWriteReviewClick}>
                      Write a Review
                    </Button>
                  </div>
                </div>

                <div className="md:w-2/3 space-y-6">
                  {product.reviews.map((review:any) => (
                    <div key={review.id} className="border rounded-lg p-6">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium text-primary">{review.user_name??'Genuine User'}</div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-amber-500 fill-current" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>

                      <p className="text-sm mb-4">{review.comment}</p>

                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2">
                            {review.images.map((image, index) => (
                              <button
                                key={index}
                                className="relative w-16 h-16 md:w-20 md:h-20 border rounded-md overflow-hidden hover:opacity-90 transition-opacity"
                                onClick={() => handleOpenReviewGallery(review.images, index)}
                              >
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`Review image ${index + 1}`}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                            {review.images.length > 4 && (
                              <button
                                className="relative w-16 h-16 md:w-20 md:h-20 border rounded-md overflow-hidden bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                                onClick={() => handleOpenReviewGallery(review.images)}
                              >
                                <div className="flex flex-col items-center justify-center text-sm font-medium">
                                  <ImageIcon className="h-5 w-5 mb-1 text-muted-foreground" />
                                  <span>View all</span>
                                </div>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No reviews yet. Be the first to review this product!</p>
                <Button className="bg-primary text-white" onClick={handleWriteReviewClick}>
                  Write a Review
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Similar Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        {/* <ProductCarousel type="featured" /> */}
      </div>

      {/* Size Chart Modal */}
      {product.size_chart_image && (
        <Dialog open={showSizeChart} onOpenChange={setShowSizeChart}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Size Chart</DialogTitle>
            </DialogHeader>
            <div className="overflow-hidden rounded-md">
              <Image
                src={product.size_chart_image || "/placeholder.svg"}
                alt="Size Chart"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Review Form Modal */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ReviewForm
              productId={product.id}
              onSuccess={handleReviewSuccess}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <ShareDialog open={showShareDialog} onOpenChange={setShowShareDialog} title={product.name} url={shareUrl} />

      {/* Coupons Modal */}
      <AvailableCouponsModal
        open={showCouponsModal}
        onOpenChange={setShowCouponsModal}
        coupons={availableCoupons}
        productPrice={currentPrice * quantity}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        title="Login Required"
        description="Please login to write a review"
      />

      {/* Review Image Gallery */}
      <ReviewImageGallery
        images={selectedReviewImages}
        open={showReviewGallery}
        onOpenChange={setShowReviewGallery}
        initialIndex={selectedImageIndex}
      />
    </div>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="container py-6 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square rounded-sm" />
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-sm" />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-24 w-full rounded-lg" />

          <div className="space-y-4">
            <div>
              <Skeleton className="h-6 w-20 mb-2" />
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="w-12 h-12 rounded-full" />
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-6 w-20 mb-2" />
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="w-20 h-10 rounded-md" />
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-6 w-20 mb-2" />
              <div className="flex items-center">
                <Skeleton className="w-10 h-10" />
                <Skeleton className="w-16 h-10" />
                <Skeleton className="w-10 h-10" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>

            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="mt-12">
          <Skeleton className="h-12 w-full mb-6" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
