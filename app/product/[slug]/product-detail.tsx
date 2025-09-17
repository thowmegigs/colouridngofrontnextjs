"use client"

import { AvailableCouponsModal } from "@/app/components/available-coupons-modal"
import ImageGalleryWithZoom from "@/app/components/ImageGalleryWithZoom"
import RelatedProductCarousel from "@/app/components/related-product-carousel"
import ReviewsSection from "@/app/components/review-section"
import SafeImage from "@/app/components/SafeImage"
import { ShareDialog } from "@/app/components/share-dialog"
import { showToast } from "@/app/components/show-toast"
import { ZoomImage } from "@/app/components/zoom-image"
import { cn, formatCurrency } from "@/app/lib/utils"
import { useAuth } from "@/app/providers/auth-provider"
import { useCart } from "@/app/providers/cart-provider"
import { useWishlist } from "@/app/providers/wishlist-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { image_base_url } from "@/contant"
import { useMobile } from "@/hooks/use-mobile"
import { fetchProductDetail, fetchSetting, type ProductReview } from "@/lib/api"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  AlertCircle,
  Box,
  Clock,
  HandCoins,
  RotateCcw,
  Share2,
  ShoppingCart,
  Star,
  Tag
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"

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
    //  staleTime:0

  })
 const { data: setting } = useQuery<any>({
    queryKey: ["setting"],
    queryFn: () => fetchSetting(),
  
  })
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [showSizeChart, setShowSizeChart] = useState(false)

  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showCouponsModal, setShowCouponsModal] = useState(false)
  const [availableCoupons, setAvailableCoupons] = useState([])
 

  const { isAuthenticated } = useAuth()
  const [showAlert, setShowlaert] = useState(false)
  const router = useRouter()
  useEffect(() => {
    if (product) setAvailableCoupons(product.related_coupons)
  }, [product])
  const isMobile = useMobile()


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
  }, [ product])


  const allVariants = useMemo(() => {
    if (!product?.variants) return []

    return product.variants.map((variant: any) => {
      const at = variant.variant_attributes ? JSON.parse(variant.variant_attributes) : null
      //  const { color, size } = parseVariantName(variant.variant_attributes)
      return { 
        ...variant,
        parsedColor: at ? at['Color'] : null,
        parsedSize: at ? at['Size'] : null,
      }
    })
  }, [product])
  //  console.log('product', product)
  //  console.log('allvariant', allVariants)

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
      const exactMatch = allVariants.find((v) => v.parsedColor?.toLowerCase() === selectedColor.toLowerCase() && v.parsedSize?.toString()?.toLowerCase() === selectedSize?.toString()?.toLowerCase())
      if (exactMatch) return exactMatch
    }

    // If only color is selected, find a variant with that color
    if (selectedColor && !selectedSize) {

      return allVariants.find((v) => v.parsedColor.toLowerCase() === selectedColor.toLowerCase())
    }

    // If only size is selected, find a variant with that size
    if (!selectedColor && selectedSize) {
      return allVariants.find((v) => v.parsedSize.toString().toLowerCase() === selectedSize.toString().toLowerCase())
    }

    // Fallback to first variant
    return allVariants[0]
  }, [product, allVariants, selectedColor, selectedSize])

  // Get available sizes for the selected color
  const availableSizesForColor = useMemo(() => {

    if (!product) return []
    if (availableColors.length > 0 && !selectedColor) return []
    const sizes = [...new Set(allVariants.map((v) => v.parsedSize))]
    // console.log('allVariants', allVariants)
    // console.log('sizes', sizes)
    if (availableColors.length === 0) {
      return sizes.map((size: any) => ({
        id: size,
        name: size,
        available: allVariants.some((v) => v.parsedSize.toString().toLowerCase() == size.toString().toLowerCase() && v.quantity > 0),

      }))
    }
    // Find all variants with the selected color



    // Map to the format needed for the UI
    const p = sizes.map((size: any) => ({
      id: size,
      name: size,
      available: allVariants.some((v) => {
        const s = v.parsedSize?.toString().toLowerCase() == size?.toString().toLowerCase()
        const c = v.parsedColor.toString().toLowerCase() == selectedColor.toLowerCase()
        // console.log(s)
        //  console.log(c)
        //  ///   console.log(v.parsedColor,selectedColor,v.parsedColor== selectedColor)
        //     console.log('=================')
        return s && c && v.quantity > 0
      })
    }))
    console.log(p)
    return p
  }, [product, allVariants, selectedColor])

  const availableColorsForSize = useMemo(() => {
    if (!product || !selectedSize) {
      if (availableColors.length === 0) return []
      else {

        return availableColors.map((color: any) => ({
          ...color,
          available: true,
        }))
      }
    }

    const colorsForSize = [...new Set(allVariants.map((v) => v.parsedColor))]
    // console.log('dekho', allVariants)
    const colorsForSize1 = colorsForSize.filter(v => Boolean(v))
    return colorsForSize1.length > 0 ? colorsForSize.map((color: any) => ({
      id: color,
      name: color,
      available: allVariants.some((v) => {
        const s = v.parsedSize && v.parsedSize.toString().toLowerCase() == selectedSize.toString().toLowerCase();
        const c = v.parsedColor.toLowerCase() == color.toLowerCase();
        return s && c && v.quantity > 0
      })
    })) : []
  }, [product, allVariants, selectedSize, availableColors])
  // console.log('avaiable cols for size', availableColorsForSize)
  // Get images for the selected variant or fallback to product images
  const variantImages = useMemo(() => {

    // If we have a selected variant with images, use those
    if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
      return selectedVariant.images
    }

    // Otherwise fall back to product images
    return product?.images || []
  }, [selectedVariant, product])

  const handleQuantityChange = (newQuantity: number) => {

    const maxQuantity = selectedVariant ? selectedVariant.quantity : product?.quantity

    if (maxQuantity + 1 > newQuantity && newQuantity >= 1) {
      setQuantity(newQuantity)


    }
    else {
      showToast({ description: 'More than ' + quantity + ' quantity not allowed', variant: 'destructive' })
      return false
    }


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

  const handleSizeChange = useCallback((sizeId: string) => {
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
  }, [selectedSize, allVariants])
  const handleAddToCart = useCallback(() => {
    if (!product) return
    if(!isAuthenticated){
      router.push('/auth/login')
      return 
    }

    if (selectedVariant.quantity === 0 || quantity === 0) {
      showToast({ title: '', description: "Item is out of stock now ", variant: 'destructive' })
      return
    }
   
    if (selectedVariant) {
      // Add variant to cart
      if (addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        sale_price: Number.parseFloat(selectedVariant.sale_price || selectedVariant.price),
        price: Number.parseFloat(selectedVariant.price),
        image: selectedVariant.image || product.image,
        quantity,
        stock: selectedVariant.quantity,
        color: selectedVariant.parsedColor
          ? selectedVariant.parsedColor.charAt(0).toUpperCase() + selectedVariant.parsedColor.slice(1)
          : undefined,
        size: selectedVariant.parsedSize || undefined,
        vendorId: product.vendor_id,
        vendorName: product.vendor_name,
        discountMessage: Number.parseFloat(product.discount) > 0 ? `${Math.round(product.discount)}% OFF` : undefined,
        maxQuantityAllowed: product.max_quantity_allowed,
        variantId: selectedVariant ? selectedVariant.id : null,
        isReturnable: product.is_returnable == 'Yes' ? true : false
      })) {

        // setShowlaert(true)
        showToast({
          title: "",
          description: `Product added to your cart`,
        })
      }
    } else {
      // Add product to cart (no variant)
      if (addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        sale_price: Number.parseFloat(product.sale_price || product.price),
        price: Number.parseFloat(product.price),
        image: product.image,
        quantity, stock: product.quantity,
        vendorId: product.vendor_id,
        vendorName: product.vendor_name,
        discountMessage: Number.parseFloat(product.discount) > 0 ? `${Math.round(product.discount)}% OFF` : undefined,
        maxQuantityAllowed: product.max_quantity_allowed,
        variantId: null,
        isReturnable: product.is_returnable == 'Yes' ? true : false
      })) {
        // setShowlaert(true)
        showToast({
          title: "Added to cart",
          description: `Product added to your cart`,
        })
      }
    }

  }, [product, selectedVariant, quantity])
  const handleBuyNow = useCallback(() => {
    if (!product) return
    if(!isAuthenticated){
      router.push('/auth/login')
      return 
    }
    if (selectedVariant.quantity === 0 || quantity === 0) {
      showToast({ title: '', description: "Item is out of stock now ", variant: 'destructive' })
      return
    }
  
    if (selectedVariant) {
      // Add variant to cart
      if (addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        sale_price: Number.parseFloat(selectedVariant.sale_price || selectedVariant.price),
        price: Number.parseFloat(selectedVariant.price),
        image: selectedVariant.image || product.image,
        quantity,
        stock: selectedVariant.quantity,
        color: selectedVariant.parsedColor
          ? selectedVariant.parsedColor.charAt(0).toUpperCase() + selectedVariant.parsedColor.slice(1)
          : undefined,
        size: selectedVariant.parsedSize || undefined,
        vendorId: product.vendor_id,
        vendorName: product.vendor_name,
        discountMessage: Number.parseFloat(product.discount) > 0 ? `${Math.round(product.discount)}% OFF` : undefined,
        maxQuantityAllowed: product.max_quantity_allowed,
        variantId: selectedVariant ? selectedVariant.id : null,
        isReturnable: product.is_returnable == 'Yes' ? true : false
      })) {
        router.push('/checkout')

      }
    } else {
      // Add product to cart (no variant)
      if (addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        sale_price: Number.parseFloat(product.sale_price || product.price),
        price: Number.parseFloat(product.price),
        image: product.image,
        quantity, stock: product.quantity,
        vendorId: product.vendor_id,
        vendorName: product.vendor_name,
        discountMessage: Number.parseFloat(product.discount) > 0 ? `${Math.round(product.discount)}% OFF` : undefined,
        maxQuantityAllowed: product.max_quantity_allowed,
        variantId: null,
        isReturnable: product.is_returnable == 'Yes' ? true : false
      })) {
        router.push('/checkout')
      }
    }

  }, [product, selectedVariant, quantity])

  const calculateAverageRating = (reviews: ProductReview[]): number => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((total, review) => total + review.rating, 0)
    return Number((sum / reviews.length).toFixed(1))
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


  const inWishlist = useMemo(() => {
    if (!product) return false
    if (selectedVariant) {
      return isInWishlist(product.id, selectedVariant.id)
    } else
      return isInWishlist(product.id)

  }, [product, selectedVariant])

 // Get the current product price for coupon eligibility
  const currentPrice = selectedVariant
    ? Number.parseFloat(selectedVariant.sale_price || selectedVariant.price)
    : product
      ? Number.parseFloat(product.sale_price || product.price)
      : 0
        const allReviewImages = product ? product.reviews.flatMap((review) => review.images).map((src) => ({ src })) : [];
 
  const avgproductRating = product ? calculateAverageRating(product.reviews) : 5;
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
    <div className="container p-0 m-0">
      <div className="md:hidden grid grid-cols-1 md:grid-cols-[35%_65%]">
        {/* Product Images */}
        <div className="">
          <div className="rounded-sm  bg-transparent ">
            {!isMobile ? <ZoomImage
              src={`${image_base_url}${variantImages[activeImage]}`}
              alt={product.name}
              width={600}
              height={700}
              className="w-full"
            /> :
              <ImageGalleryWithZoom images={variantImages} selectedVariant={selectedVariant} product={product} activeImage={activeImage} />
            }
          </div>

          <div className="md:flex space-x-2 overflow-x-auto pb-2 hidden ">
            {variantImages.map((image, index) => (
              <button
                key={index}
                className={`border rounded-sm overflow-hidden flex-shrink-0 ${activeImage === index ? "border-primary" : "border-border"
                  }`}
                onClick={() => setActiveImage(index)}
              >
                <SafeImage

                  src={`${image_base_url}${image}`}
                  alt={`${product.name} - Image ${index + 1}`}
                  width={100}
                  height={80}
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <div>

            <h1 className="text-lg md:text-3xl font-bold">{product.vendor_name}</h1>
            <p className="text-muted-foreground mt-2">{product.name}</p>

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
                <div className="text-xl font-bold">
                  {formatCurrency(Number.parseFloat(selectedVariant.sale_price || selectedVariant.price))}
                </div>
                {selectedVariant.sale_price &&
                  Number.parseFloat(selectedVariant.price) > Number.parseFloat(selectedVariant.sale_price) && (
                    <>
                      <div className="text-lg text-muted-foreground line-through ml-2">
                        {formatCurrency(Number.parseFloat(selectedVariant.price))}
                      </div>
                      {Number.parseFloat(product.discount) > 0 && (
                        <div className="ml-2 text-sm font-medium text-green-600">{Math.round(product.discount)}% OFF</div>
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
                      <div className="ml-2 text-sm font-medium text-green-600">{Math.round(product.discount)}% OFF</div>
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

            {/* {selectedVariant && (
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-1" />
                      
                        </div>
                      )} */}


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
                  className="flex flex-wrap gap-3"
                >
                  <TooltipProvider>
                    {availableColorsForSize.map((color) => {
                      const isSelected = selectedColor.toLowerCase() === color.id.toLowerCase()
                      const isUnavailable = !color.available

                      return (
                        <div key={color.id} className="flex flex-col items-center space-y-1 relative">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Label
                                htmlFor={`color-${color.id}`}
                                className={cn(
                                  "relative w-11 h-11 flex items-center justify-center border-2  transition-all duration-150 cursor-pointer",
                                  isUnavailable
                                    ? "border-grey-500"
                                    : isSelected
                                      ? "border-primary"
                                      : "border-gray-300 hover:border-gray-500"
                                )}
                              >
                                {/* Hidden radio input */}
                                <RadioGroupItem
                                  id={`color-${color.id}`}
                                  value={color.id}
                                  className="sr-only"
                                />

                                {/* Colored Circle */}
                                <span
                                  className={"w-8 h-8 border border-white rounded-full relative"}
                                  style={{ backgroundColor: color.name }}
                                  title={color.name}
                                  aria-label={color.name}
                                >
                                  {/* Diagonal strike-through */}
                                  {isUnavailable && (
                                    <span className="absolute inset-0 pointer-events-none z-10">
                                      <span className="absolute left-1/2 top-1/2 w-[200%] h-[2px] bg-gray-400 rotate-45 -translate-x-1/2 -translate-y-1/2" />
                                    </span>
                                  )}
                                </span>
                              </Label>
                            </TooltipTrigger>

                            {/* Tooltip only if selected and unavailable */}
                            {isUnavailable && (
                              <TooltipContent side="top" className="text-xs bg-black text-white px-2 py-1 rounded">
                                This color is not available
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </div>
                      )
                    })}
                  </TooltipProvider>
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
                  className="flex flex-wrap gap-3"
                >
                  <TooltipProvider>
                    {availableSizesForColor.map((size) => {
                      const isSelected = selectedSize.toLowerCase() === size.id.toLowerCase()
                      const isUnavailable = !size.available

                      return (
                        <Tooltip key={size.id}>
                          {/* clickable label */}
                          <TooltipTrigger asChild>
                            <Label
                              htmlFor={`size-${size.id}`}
                              className={cn(
                                "relative w-10 h-10 flex items-center justify-center border text-xs font-medium cursor-pointer transition",
                                isUnavailable
                                  ? "border-red-400 text-gray-400 grayscale opacity-50"
                                  : isSelected
                                    ? "ring-2 ring-offset-1 ring-primary text-black"
                                    : "bg-white border-gray-300 text-gray-700 hover:bg-muted"
                              )}
                            >
                              {/* hidden radio button */}
                              <RadioGroupItem
                                id={`size-${size.id}`}
                                value={size.id}

                                className="sr-only"
                              />

                              {/* size text */}
                              {size.name}

                              {/* diagonal strike-through for every unavailable size */}
                              {isUnavailable && (
                                <span className="absolute inset-0 pointer-events-none z-20">
                                  <span className="absolute left-1/2 top-1/2 w-[160%] h-[2px] bg-red-500 rotate-45 -translate-x-1/2 -translate-y-1/2" />
                                </span>
                              )}
                            </Label>
                          </TooltipTrigger>

                          {/* tooltip appears only if user selects an unavailable size */}
                          {isUnavailable && (
                            <TooltipContent side="top" className="text-xs bg-black text-white px-2 py-1 rounded">
                              This size is not available
                            </TooltipContent>
                          )}
                        </Tooltip>
                      )
                    })}
                  </TooltipProvider>
                </RadioGroup>
              </div>
            )}

            {/* Stock information */}
            <div className="mt-4  bg-muted/30 rounded-md">
              <div className="text-sm">

                {selectedVariant ? <span className="font-medium">Selected Variant: <span className="font-bold">{selectedVariant.name}</span></span> : ""}
              </div>
              {/* <div className="text-sm mt-1">
                          <span className="font-medium">Stock:</span>{" "}
                          <span className="font-bold">{selectedVariant ? selectedVariant.quantity : product.quantity} </span> available
                        </div>
                        {
                          (selectedVariant
                            ? ((selectedVariant.quantity <= 5 && selectedVariant.quantity > 0) && (
                              <div className="text-sm mt-1 text-amber-600">
                                <span className="font-medium">Low Stock!</span> Only {selectedVariant.quantity} left
                              </div>
                            ))
                            : ((product.quantity <= 5 && product.quantity > 0) && (
                              <div className="text-sm mt-1 text-amber-600">
                                <span className="font-medium">Low Stock!</span> Only {product.quantity} left
                              </div>
                            ))
                          )
                        }
                        {(selectedVariant ? selectedVariant.quantity <= 0 : product.quantity <= 0) && (
                          <div className="text-sm mt-1 text-red-600">
                            <span className="font-medium">Out of Stock</span>
                          </div>
                        )} */}
            </div>

            {/* <div>
                        <Label htmlFor="quantity" className="text-base font-medium mb-2 block">
                          Quantity
                        </Label>
                        <div className="flex items-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon" className="rounded-none"
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
                            max={selectedVariant ? selectedVariant.quantity : product.quantity}
                            value={quantity}
                            onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                            className="w-16 rounded-none text-center border-y border-input py-2 text-sm"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"  className="rounded-none"
                            onClick={() => handleQuantityChange(quantity + 1)}
                          
                            disabled={selectedVariant?(selectedVariant.quantity===quantity):(product.quantity===quantity)}
                          >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Increase quantity{quantity}</span>
                          </Button>
                        </div>
                      </div> */}

            <div className="hidden md:flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-primary  text-white rounded-none"
                onClick={handleAddToCart}
                disabled={selectedVariant ? selectedVariant.quantity <= 0 : product?.quantity <= 0}
              >
                <ShoppingCart className={`h-5 w-5 mr-2`} />

                ADD TO CART
              </Button>
              <Button
                variant="outline"
                className="border-primary text-red-800 rounded-none"
                onClick={handleBuyNow}
                disabled={selectedVariant ? selectedVariant.quantity <= 0 : product?.quantity <= 0}

              >
                BUY NOW
              </Button>
            </div>

            {/* Return Policy */}
            {product.is_returnable != 'Yes' && <h4 className=" text-sm text-red-600">This product is not returnable</h4>
            }
            {/* <PincodeChecker product_id={product.id} /> */}
            <div className="flex py-4 border-t border-b">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => setShowShareDialog(true)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <div className="flex gap-3">

                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  Delivery: 3-10 days
                </div>

              </div>
            </div>
            <div className="space-y-2 text-[14px] text-gray-700">
              {product.is_returnable === 'Yes' &&
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>Easy return in <span className="font-bold">{setting?.return_days??3} days</span></span>
                  <Link href="/return_policy" target="_blank" className="text-sm text-primary flex items-center hover:underline">

                    View  return policy
                  </Link>

                </div>

              }
              {/* <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4" />
                          <span>Free shipping above <span className="font-bold">₹500</span></span>
                        </div> */}
              <div className="flex items-center space-x-2">
                <HandCoins className="w-4 h-4" />
                <span>Cash on delivery available</span>
              </div>
            </div>
            {product && product.description?.length > 2 &&
              <div className="mt-12 space-y-3">
                {/* Description */}
                <div>
                  <h2 className="text-md font-semibold mb-4">Product Description</h2>
                  <div
                    className="prose max-w-none text-md text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>

                {/* Specifications */}
                <div>
                  <h2 className="text-md font-semibold mb-4">Specifications</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-border text-sm">
                      <tbody>
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left font-medium text-muted-foreground border-r border-border w-1/3">
                            Brand
                          </th>
                          <td className="px-4 py-3 border-border">{product.brand}</td>
                        </tr>
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left font-medium text-muted-foreground border-r border-border w-1/3">
                            Category
                          </th>
                          <td className="px-4 py-3">{product.category}</td>
                        </tr>
                        {product.facet_attributes?.length > 0 &&
                          product.facet_attributes.map((item, index) => {
                            if (item.name === 'Size' || item.name === 'Color') return null
                            return <tr key={index} className="border-b border-border">
                              <th className="px-4 py-3 text-left font-medium text-muted-foreground border-r border-border w-1/3">
                                {item.name}
                              </th>
                              <td className="px-4 py-3">{item.value}</td>
                            </tr>
                          })}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Reviews */}

              </div>
            }
          </div>
          <div className="space-y-5">
            <ReviewsSection  product={product} avgproductRating={avgproductRating} allReviewImages={allReviewImages} />
          </div>
        </div>
      </div>

      <div className="hidden md:grid grid-cols-1 md:grid-cols-[43%_57%] md:gap-8">
        {/* Product Images */}
        <div className=" flex  gap-1">
          <div className="md:flex flex-col space-y-1 overflow-x-auto pb-2 hidden ">
            {variantImages.map((image, index) => (
              <button
                key={index}
                className={`border rounded-sm overflow-hidden flex-shrink-0 ${activeImage === index ? "border-primary" : "border-border"
                  }`}
                onClick={() => setActiveImage(index)}
              >
                <SafeImage

                  src={`${image_base_url}${image}`}
                  alt={`${product.name} - Image ${index + 1}`}
                  width={100}
                  height={80}
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>
          <div className="rounded-sm flex-grow bg-transparent " >
            {!isMobile ? <ZoomImage
              src={`${image_base_url}${variantImages[activeImage]}`}
              alt={product.name}
              width={600}
              height={700}
              className="w-full"
            /> :
              <ImageGalleryWithZoom images={variantImages} selectedVariant={selectedVariant} product={product} activeImage={activeImage} />
            }
          </div>


        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <div>

            <h1 className="text-lg md:text-3xl font-bold">{product.vendor_name}</h1>
            <p className="text-muted-foreground mt-2">{product.name}</p>

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
                <div className="text-xl font-bold">
                  {formatCurrency(Number.parseFloat(selectedVariant.sale_price || selectedVariant.price))}
                </div>
                {selectedVariant.sale_price &&
                  Number.parseFloat(selectedVariant.price) > Number.parseFloat(selectedVariant.sale_price) && (
                    <>
                      <div className="text-lg text-muted-foreground line-through ml-2">
                        {formatCurrency(Number.parseFloat(selectedVariant.price))}
                      </div>
                      {Number.parseFloat(product.discount) > 0 && (
                        <div className="ml-2 text-sm font-medium text-green-600">{Math.round(product.discount)}% OFF</div>
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
                      <div className="ml-2 text-sm font-medium text-green-600">{Math.round(product.discount)}% OFF</div>
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
                  className="flex flex-wrap gap-3"
                >
                  <TooltipProvider>
                    {availableColorsForSize.map((color) => {
                      const isSelected = selectedColor.toLowerCase() === color.id.toLowerCase()
                      const isUnavailable = !color.available

                      return (
                        <div key={color.id} className="flex flex-col items-center space-y-1 relative">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Label
                                htmlFor={`color-${color.id}`}
                                className={cn(
                                  "relative w-11 h-11 flex items-center justify-center border-2  transition-all duration-150 cursor-pointer",
                                  isUnavailable
                                    ? "border-grey-500"
                                    : isSelected
                                      ? "border-primary"
                                      : "border-gray-300 hover:border-gray-500"
                                )}
                              >
                                {/* Hidden radio input */}
                                <RadioGroupItem
                                  id={`color-${color.id}`}
                                  value={color.id}
                                  className="sr-only"
                                />

                                {/* Colored Circle */}
                                <span
                                  className={"w-8 h-8 border border-white rounded-full relative"}
                                  style={{ backgroundColor: color.name }}
                                  title={color.name}
                                  aria-label={color.name}
                                >
                                  {/* Diagonal strike-through */}
                                  {isUnavailable && (
                                    <span className="absolute inset-0 pointer-events-none z-10">
                                      <span className="absolute left-1/2 top-1/2 w-[200%] h-[2px] bg-gray-400 rotate-45 -translate-x-1/2 -translate-y-1/2" />
                                    </span>
                                  )}
                                </span>
                              </Label>
                            </TooltipTrigger>

                            {/* Tooltip only if selected and unavailable */}
                            {isUnavailable && (
                              <TooltipContent side="top" className="text-xs bg-black text-white px-2 py-1 rounded">
                                This color is not available
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </div>
                      )
                    })}
                  </TooltipProvider>
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
                  className="flex flex-wrap gap-3"
                >
                  <TooltipProvider>
                    {availableSizesForColor.map((size) => {
                      const isSelected = selectedSize.toLowerCase() === size.id.toLowerCase()
                      const isUnavailable = !size.available

                      return (
                        <Tooltip key={size.id}>
                          {/* clickable label */}
                          <TooltipTrigger asChild>
                            <Label
                              htmlFor={`size-${size.id}`}
                              className={cn(
                                "relative w-10 h-10 flex items-center justify-center border text-xs font-medium cursor-pointer transition",
                                isUnavailable
                                  ? "border-red-400 text-gray-400 grayscale opacity-50"
                                  : isSelected
                                    ? "ring-2 ring-offset-1 ring-primary text-black"
                                    : "bg-white border-gray-300 text-gray-700 hover:bg-muted"
                              )}
                            >
                              {/* hidden radio button */}
                              <RadioGroupItem
                                id={`size-${size.id}`}
                                value={size.id}

                                className="sr-only"
                              />

                              {/* size text */}
                              {size.name}

                              {/* diagonal strike-through for every unavailable size */}
                              {isUnavailable && (
                                <span className="absolute inset-0 pointer-events-none z-20">
                                  <span className="absolute left-1/2 top-1/2 w-[160%] h-[2px] bg-red-500 rotate-45 -translate-x-1/2 -translate-y-1/2" />
                                </span>
                              )}
                            </Label>
                          </TooltipTrigger>

                          {/* tooltip appears only if user selects an unavailable size */}
                          {isUnavailable && (
                            <TooltipContent side="top" className="text-xs bg-black text-white px-2 py-1 rounded">
                              This size is not available
                            </TooltipContent>
                          )}
                        </Tooltip>
                      )
                    })}
                  </TooltipProvider>
                </RadioGroup>
              </div>
            )}

            {/* Stock information */}
            <div className="mt-4  bg-muted/30 rounded-md">
              <div className="text-sm mb-3">

                {selectedVariant ? <span className="font-medium">Selected Variant: <span className="font-bold">{selectedVariant.name}</span></span> : ""}
              </div>


              <div className="hidden md:flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-primary  text-white rounded-none"
                  onClick={handleAddToCart}
                  disabled={selectedVariant ? selectedVariant.quantity <= 0 : product?.quantity <= 0}
                >
                  <ShoppingCart className={`h-5 w-5 mr-2`} />

                  ADD TO CART
                </Button>
                <Button
                  variant="outline"
                  className="border-primary text-red-800 rounded-none"
                  onClick={handleBuyNow}
                  disabled={selectedVariant ? selectedVariant.quantity <= 0 : product?.quantity <= 0}

                >
                  BUY NOW
                </Button>
              </div>

              {/* Return Policy */}
              {product.is_returnable != 'Yes' && <h4 className=" text-sm text-red-600">This product is not returnable</h4>
              }
              {/* <PincodeChecker product_id={product.id} /> */}
              <div className="flex py-4  border-b">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => setShowShareDialog(true)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>

                <div className="flex gap-3">

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    Delivery: 3-10 days
                  </div>

                </div>
              </div>
              <div className="space-y-2 mt-2 text-[14px] text-gray-700">
                {product.is_returnable === 'Yes' &&
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4" />
                    <span>Easy return in <span className="font-bold">{setting?.return_days??3} days</span></span>
                    <Link href="/return_policy" target="_blank" className="text-sm text-primary flex items-center hover:underline">

                      View  return policy
                    </Link>

                  </div>

                }
                {/* <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Free shipping above <span className="font-bold">₹500</span></span>
              </div> */}
                <div className="flex items-center space-x-2">
                  <HandCoins className="w-4 h-4" />
                  <span>Cash on delivery available</span>
                </div>
              </div>
              {product && product.description?.length > 2 &&
                <div className="mt-12 space-y-3">
                  {/* Description */}
                  <div>
                    <h2 className="text-md font-semibold mb-4">Product Description</h2>
                    <div
                      className="prose max-w-none text-md text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </div>

                  {/* Specifications */}
                  <div>
                    <h2 className="text-md font-semibold mb-4">Specifications</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-border text-sm">
                        <tbody>
                          <tr className="border-b border-border">
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground border-r border-border w-1/3">
                              Brand
                            </th>
                            <td className="px-4 py-3 border-border">{product.brand}</td>
                          </tr>
                          <tr className="border-b border-border">
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground border-r border-border w-1/3">
                              Category
                            </th>
                            <td className="px-4 py-3">{product.category}</td>
                          </tr>
                          {product.facet_attributes?.length > 0 &&
                            product.facet_attributes.map((item, index) => {
                              if (item.name === 'Size' || item.name === 'Color') return null
                              return <tr key={index} className="border-b border-border">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground border-r border-border w-1/3">
                                  {item.name}
                                </th>
                                <td className="px-4 py-3">{item.value}</td>
                              </tr>
                            })}
                        </tbody>
                      </table>
                    </div>

                  </div>

                  {/* Reviews */}

                </div>
              }
            </div>
            <div className="space-y-5">
              <ReviewsSection queryClient={queryClient} product={product} avgproductRating={avgproductRating} allReviewImages={allReviewImages} />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {product.relatedProducts.length > 0 &&
        (<div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <RelatedProductCarousel products={product.relatedProducts} />
        </div>)
      }
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3 gap-1">

          {/* Price */}
          {/* <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(product.sale_price * quantity)}
          </div> */}

          {/* Buttons */}
          <button
            onClick={handleBuyNow}
            disabled={selectedVariant ? selectedVariant.quantity <= 0 : product?.quantity <= 0}

            className="w-full flex items-center justify-center gap-2 px-2 bg-black text-white py-2  disabled:opacity-50 transition-colors"
          >
            BUY NOW
          </button>

          {/* Add to Cart */}
          <button onClick={handleAddToCart}
            disabled={selectedVariant ? selectedVariant.quantity <= 0 : product?.quantity <= 0}

            className="w-full justify-center flex items-center gap-2 bg-primary text-white px-4 py-2   transition-colors disabled:opacity-50">
            <ShoppingCart className="w-5 h-6" />
            ADD TO CART
          </button>
          {/* <button onClick={()=>{router.push('/cart')}} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md  transition-colors">
              <ShoppingCart className="w-5 h-5" />
            
            </button> */}

        </div>
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



      {/* Backdrop */}

      {/* Review Form Modal */}


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
