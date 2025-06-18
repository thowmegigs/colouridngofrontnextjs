"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { image_base_url } from "@/contant"
import { useMobile } from "@/hooks/use-mobile"
import { fetchAvailableCoupons, type Coupon } from "@/lib/api"
import {
  AlertCircle,
  Check,
  ChevronRight,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
  Search,
  ShoppingCart,
  Tag,
  X
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { AuthModal } from "../components/auth-modal"
import SafeImage from "../components/SafeImage"
import { showToast } from "../components/show-toast"
import { formatCurrency } from "../lib/utils"
import { useAuth } from "../providers/auth-provider"
import { useCart } from "../providers/cart-provider"


export default function CartPage() {
  const router = useRouter()
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isCouponLoading,
    couponError, shipping_cost
  } = useCart()

  const [couponCode, setCouponCode] = useState("")
  const [showCoupons, setShowCoupons] = useState(false)
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([])
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false)
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [pendingCouponCode, setPendingCouponCode] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)


  const { isAuthenticated } = useAuth();

  const isMobile = useMobile()

  // Check login status on component mount
  useEffect(() => {
    // This is a simplified check. In a real app, you would use your auth system
    const userToken = localStorage.getItem("userToken")
    const isLoggedInValue = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(!!userToken || isLoggedInValue)
  }, [])

  // Fetch available coupons when the dialog/drawer is opened
  useEffect(() => {
    if (showCoupons) {
      const loadCoupons = async () => {
        setIsLoadingCoupons(true)
        try {
          const coupons = await fetchAvailableCoupons()
          console.log('coiupons', coupons)
          setAvailableCoupons(coupons)
        } catch (error) {
          console.error("Error fetching coupons:", error)
          showToast({
            title: "Error", description: "Failed to load available coupons",
            variant: 'destructive'
          })
        } finally {
          setIsLoadingCoupons(false)
        }
      }

      loadCoupons()
    }
  }, [showCoupons, showToast])

  // Filter coupons based on search query
  const filteredCoupons = useMemo(() => {
    if (!searchQuery.trim()) return availableCoupons

    const query = searchQuery.toLowerCase().trim()
    return availableCoupons.filter(
      (coupon) =>
        coupon.code.toLowerCase().includes(query) ||
        coupon.description?.toLowerCase().includes(query) ||
        (coupon.discount_type === "Percent" && `${coupon.discount}%`.includes(query)) ||
        (coupon.discount_type === "Flat" && `$${coupon.discount}`.includes(query)),
    )
  }, [availableCoupons, searchQuery])

  const handleApplyCouponWithAuth = async (code: string) => {
    if (!isLoggedIn) {
      // Save the coupon code and open auth modal
      setPendingCouponCode(code)
      setIsAuthModalOpen(true)
      return
    }

    // User is logged in, proceed with applying coupon
    await processCouponApplication(code)
  }

  const processCouponApplication = async (code: string) => {
    if (!code) {
      setCouponMessage({
        type: "error",
        message: "Please enter a coupon code",
      })
      return
    }

    const result = await applyCoupon(code)

    if (result.success) {
      setCouponMessage({
        type: "success",
        message: result.message,
      })
      setCouponCode("")
      setShowCoupons(false)

      showToast({
        title: "Coupon Applied", description: result.message as any
      })
    } else {
      setCouponMessage({
        type: "error",
        message: result.message,
      })
    }

    // Clear message after 5 seconds
    setTimeout(() => {
      setCouponMessage(null)
    }, 5000)
  }

  const handleRemoveCoupon = async () => {
    const result = await removeCoupon()

    if (result.success) {
      showToast({
        title: "Coupon Removed", description: "Coupon has been removed from your cart"
      })
    }
  }

  const handleAuthSuccess = () => {
    setIsLoggedIn(true)
    setIsAuthModalOpen(false)
    setIsCheckingAuth(false)
    router.push('/checkout')
    // If there was a pending coupon code, apply it now
    if (pendingCouponCode) {
      processCouponApplication(pendingCouponCode)
      setPendingCouponCode(null)
    }
  }

  const handleCheckoutClick = () => {
    setIsCheckingAuth(true)

    if (isAuthenticated) {
      // User is logged in, proceed to checkout
      router.push("/checkout")
    } else {
      // User is not logged in, redirect to auth page
      router.push('auth/login?redirect=/checkout')
    }
  }

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  const CouponsContent = () => (
    <div className="space-y-4">
      {isLoadingCoupons ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading available coupons...</span>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coupons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {filteredCoupons && filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon) => (
                <div key={coupon.code} className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-primary">{coupon.code}</div>
                        <div className="text-sm text-muted-foreground">{coupon.description}</div>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {coupon.discount_type === "Percent"
                          ? `${coupon.discount}%`
                          : `$${coupon.discount.toFixed(2)}`}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                      <span>Min. order: ${coupon.cart_amount.toFixed(2)}</span>
                      <span>Expires: {new Date(coupon.end_date).toLocaleDateString()}</span>
                      {coupon.max_discount && (
                        <span>Max discount: ${coupon.max_discount.toFixed(2)}</span>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(coupon.code)
                          showToast({
                            title: "Copied!",
                            description: `Coupon code ${coupon.code} copied to clipboard`,

                          })
                        }}
                        className="w-full sm:w-auto"
                      >
                        Copy
                      </Button>
                      <Button onClick={() => handleApplyCouponWithAuth(coupon.code)} className="w-full sm:w-auto">
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="font-medium">No matching coupons found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try a different search term or browse all available coupons.
                </p>
                {searchQuery && (
                  <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-3 border-t">
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCouponWithAuth(couponCode)}
            />
            <Button onClick={() => handleApplyCouponWithAuth(couponCode)} disabled={isCouponLoading}>
              {isCouponLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply"
              )}
            </Button>
          </div>

          {couponMessage && (
            <div
              className={`text-sm flex items-center ${couponMessage.type === "success" ? "text-green-600" : "text-destructive"
                }`}
            >
              {couponMessage.type === "success" ? (
                <Check className="h-4 w-4 mr-1" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-1" />
              )}
              {couponMessage.message}
            </div>
          )}
        </>
      )}
    </div>
  )

  // Mobile Android-style cart
  if (isMobile) {
    return (
      <div className="pb-10">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-medium">Cart ({items.length})</h1>
          <Link href="/" className="text-primary text-sm">
            Continue Shopping
          </Link>
        </div>

        {/* Applied coupon notification */}
        {appliedCoupon && (
          <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 flex items-center text-green-700 dark:text-green-400 text-sm">
            <Check className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              <span className="font-medium">{appliedCoupon.code}</span> applied
              {discount > 0 && ` (${formatCurrency(discount)} off)`}
            </span>
          </div>
        )}

        {/* Cart items */}
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.variantId ?? item.id} className="px-4 py-3 bg-white dark:bg-gray-950 flex items-center">
              {/* Product image */}
              <div className="w-[110px] h-full rounded overflow-hidden flex-shrink-0 mr-3 bg-gray-100 dark:bg-gray-800">
                <SafeImage
                  fallbackSrc="/placeholder.png"
                  src={item.variantId
                    ? `${image_base_url}/storage/products/${item.id}/variants/${item.image}`
                    : `${image_base_url}/storage/products/${item.id}/${item.image}`
                  }
                  alt={item.name}
                  width={64}
                  height={64}
                  className="w-full h-[150px] object-fit"
                />
              </div>

              {/* Product details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-extrabold text-sm truncate pr-2">{item.name}</h3>

                  <button
                    onClick={() => removeItem(item.id, item.variantId)}
                    className="text-gray-400 p-1 -mr-1 -mt-1"
                    aria-label="Remove item"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs  mt-1">Sold by: <span className="font-extrabold">{item.vendorName}</span></p>

                <p className="text-xs font-bold my-2">
                  {item.size && <span className="inline-flex items-center px-4 py-1 text-xs font-bold bg-gray-200 text-gray-800">Size: {item.size}</span>}
                  {item.size && item.color && " | "}
                  {item.color && <span className="inline-flex items-center px-4 py-1  text-xs font-bold bg-gray-200 text-gray-800">Color: {item.color}</span>}
                </p>
                {item.isReturnable &&
                <div className="flex items-center space-x-2 my-2 text-sm  font-medium">
                  <RotateCcw className="w-4 h-4" />
                  <span><span className="font-extrabold">2 days</span> return available</span>
                </div>
          }
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center h-8 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <button
                      className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 disabled:opacity-50"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.variantId)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400"
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="font-medium text-sm">{formatCurrency(item.sale_price * item.quantity)}</div>
                    {item.price && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon section */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900">
          {appliedCoupon ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2 text-primary" />
                <div>
                  <span className="text-sm font-medium">{appliedCoupon.code}</span>
                  {appliedCoupon.details && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{appliedCoupon.details.description}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveCoupon}
                disabled={isCouponLoading}
                className="h-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {isCouponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                <span className="sr-only">Remove coupon</span>
              </Button>
            </div>
          ) : (
            <div className="flex">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="rounded-r-none h-10 text-sm"
                disabled={isCouponLoading}
              />
              <Button
                className="rounded-l-none h-10"
                onClick={() => handleApplyCouponWithAuth(couponCode)}
                disabled={isCouponLoading}
              >
                {isCouponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
              </Button>
            </div>
          )}

          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 text-sm h-9"
                onClick={() => setShowCoupons(true)}
              >
                <Tag className="h-3.5 w-3.5 mr-1.5" />
                View Available Coupons
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="pb-2">
                <DrawerTitle>Available Coupons</DrawerTitle>
                <DrawerDescription>Select a coupon to apply to your order</DrawerDescription>
              </DrawerHeader>
              <div className="px-4 pb-4">
                <CouponsContent />
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Order summary collapsible */}
        <div className="px-4 py-3 border-t border-b">
          <button
            className="w-full flex items-center justify-between"
          // onClick={() => setShowOrderSummary(!showOrderSummary)}
          >
            <span className="font-medium">Order Summary</span>
            {/* <ChevronDown className={`h-5 w-5 transition-transform ${showOrderSummary ? "rotate-180" : ""}`} /> */}
          </button>


          <div className="pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Shipping</span>
              <span className="text-gray-500 dark:text-gray-400">{formatCurrency(shipping_cost)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Fixed bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t px-4 py-3 flex items-center justify-between z-20">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
            <div className="text-sm font-bold">{formatCurrency(total)}</div>
          </div>
          <Button className="px-4 py-2 rounded-md text-sm" onClick={handleCheckoutClick} disabled={isCheckingAuth}>
            {isCheckingAuth ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Checkout"
            )}
          </Button>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => {
            setIsAuthModalOpen(false)
            setPendingCouponCode(null)
          }}
          onSuccess={handleAuthSuccess}
          initialView="login"


        />
        {/* <Button
          className="mt-4 w-full h-10 text-base fixed bottom-20"
          onClick={handleCheckoutClick}
          disabled={isCheckingAuth}
        >
          {isCheckingAuth ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed To Checkout"
          )}
        </Button> */}
      </div>
    )
  }

  // Desktop version (unchanged)
  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
        <ChevronRight className="h-5 w-5 mx-2" />
        <button onClick={handleCheckoutClick} className="text-primary hover:underline">
          Checkout
        </button>
      </div>

      {appliedCoupon && (
        <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg p-4 mb-6 flex items-start">
          <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Discount applied!</p>
            <p className="text-sm">
              Coupon code <span className="font-medium">{appliedCoupon.code}</span> has been applied to your cart.
              {discount > 0 && ` You saved ${formatCurrency(discount)}.`}
            </p>
            {appliedCoupon.details && (
              <p className="text-xs mt-1 text-green-700 dark:text-green-400">{appliedCoupon.details.description}</p>
            )}
          </div>
        </div>
      )}

      {couponError && !appliedCoupon && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Coupon Error</p>
            <p className="text-sm">{couponError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 font-medium">Cart Items ({items.length})</div>

            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.variantId ?? item.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                      <SafeImage
                        fallbackSrc="/placeholder.png"
                        src={item.variantId
                          ? `${image_base_url}/storage/products/${item.id}/variants/${item.image}`
                          : `${image_base_url}/storage/products/${item.id}/${item.image}`
                        }
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && " | "}
                            {item.color && `Color: ${item.color}`}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">Sold by: {item.vendorName}</p>

                          {item.discountMessage && (
                            <div className="mt-1 text-sm text-green-600 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {item.discountMessage}
                            </div>
                          )}
                        </div>

                        <button
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => removeItem(item.id, item.variantId)}
                        >
                          <X className="h-5 w-5" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4">
                        <div className="flex items-center border rounded mb-4 sm:mb-0">
                          <button
                            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.variantId)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                            <span className="sr-only">Decrease quantity</span>
                          </button>

                          <span className="w-10 h-10 flex items-center justify-center text-sm">{item.quantity}</span>

                          <button
                            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                          >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Increase quantity</span>
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.sale_price * item.quantity)}</div>
                          {item.price && (
                            <div className="text-sm text-muted-foreground line-through">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg overflow-hidden sticky top-24">
            <div className="bg-muted px-4 py-3 font-medium">Order Summary</div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(shipping_cost)}</span>
                </div>

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-primary" />
                      <div>
                        <span className="text-sm font-medium">{appliedCoupon.code}</span>
                        {appliedCoupon.details && (
                          <p className="text-xs text-muted-foreground">{appliedCoupon.details.description}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCoupon}
                      disabled={isCouponLoading}
                      className="h-8 text-muted-foreground hover:text-foreground"
                    >
                      {isCouponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                      <span className="sr-only">Remove coupon</span>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="rounded-r-none"
                        disabled={isCouponLoading}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCouponWithAuth(couponCode)}
                      />
                      <Button
                        className="rounded-l-none"
                        onClick={() => handleApplyCouponWithAuth(couponCode)}
                        disabled={isCouponLoading}
                      >
                        {isCouponLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Apply"}
                      </Button>
                    </div>

                    {couponError && (
                      <div className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {couponError}
                      </div>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full" onClick={() => setShowCoupons(true)}>
                          <Tag className="h-4 w-4 mr-2" />
                          View Available Coupons
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Available Coupons</DialogTitle>
                          <DialogDescription>Select a coupon to apply to your order</DialogDescription>
                        </DialogHeader>
                        <CouponsContent />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>

              <Button className="w-full" onClick={handleCheckoutClick} disabled={isCheckingAuth}>
                {isCheckingAuth ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Checkout"
                )}
              </Button>

              <Link href="/">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false)
          setPendingCouponCode(null)
        }}
        onSuccess={handleAuthSuccess}
        initialView="login"

      />
    </div>
  )
}
