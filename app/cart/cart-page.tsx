"use client"

import { Button } from "@/components/ui/button"
import { image_base_url } from "@/contant"
import { useMobile } from "@/hooks/use-mobile"
import { fetchSetting } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import {
  AlertCircle,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  ShoppingCart,
  X
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import SafeImage from "../components/SafeImage"
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
    shipping_cost
  } = useCart()

 const { data: setting } = useQuery<any>({
    queryKey: ["setting"],
    queryFn: () => fetchSetting(),
  
  })
  const { isAuthenticated } = useAuth()



  const isMobile = useMobile()



 
  const handleCheckoutClick = useCallback(() => {
    console.log('isAuthenticated', isAuthenticated)
  if (isAuthenticated) {
    router.push("/checkout");
  } else {
    router.push("auth/login?redirect=/checkout");
  }
}, [isAuthenticated, router]);

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


        {/* Cart items */}
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.variantId ?? item.id} className="px-4 py-3 bg-white dark:bg-gray-950 flex items-center">
              {/* Product image */}
              <div className="w-[110px] h-full rounded overflow-hidden flex-shrink-0 mr-3 bg-gray-100 dark:bg-gray-800">
                <Link href={`/product/${item.slug}`}>
                  <SafeImage
                    fallbackSrc="/placeholder.png"
                    src={item.variantId && item.color
                      ? `${image_base_url}/storage/products/${item.id}/variants/thumbnail/small_${item.image}`
                      : `${image_base_url}/storage/products/${item.id}/thumbnail/small_${item.image}`
                    }
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-full h-[170px] object-fit"
                  /></Link>

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
                    <span><span className="font-extrabold">{setting?.return_days??3} days</span> return available</span>
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

      
        {/* Order summary collapsible */}
        <div className="px-4 py-3 border-t border-b">
          <Button
            className="w-full flex items-center justify-between"
          // onClick={() => setShowOrderSummary(!showOrderSummary)}
          >
            <span className="font-medium">Order Summary</span>
            {/* <ChevronDown className={`h-5 w-5 transition-transform ${showOrderSummary ? "rotate-180" : ""}`} /> */}
          </Button>


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
                <span>{formatCurrency(total + shipping_cost)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Fixed bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t px-4 py-3 flex items-center justify-between z-20">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
            <div className="text-sm font-bold">{formatCurrency(total + shipping_cost)}</div>
          </div>
          <Button className="px-4 py-2 rounded-md text-sm" onClick={handleCheckoutClick}
          >           Checkout

          </Button>
        </div>


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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 font-medium">Cart Items ({items.length})</div>

            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.variantId ?? item.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                      <Link href={`/product/${item.slug}`}>
                        <SafeImage
                          fallbackSrc="/placeholder.png"
                          src={item.variantId && item.color
                            ? `${image_base_url}/storage/products/${item.id}/variants/thumbnail/small_${item.image}`
                            : `${image_base_url}/storage/products/${item.id}/thumbnail/small_${item.image}`
                          }
                          alt={item.name}
                          width={150}
                          height={250}
                          className="w-full h-auto object-fit"
                        /></Link>
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
                    <span>{formatCurrency(total + shipping_cost)}</span>
                  </div>
                </div>
              </div>

             

              <Button className="w-full" onClick={handleCheckoutClick}>
                Proceed to Checkout

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


    </div>
  )
}
