"use client"

import { applyCoupon as apiApplyCoupon, removeCoupon as apiRemoveCoupon, validateCoupon, type Coupon } from "@/lib/api"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { showToast } from "../components/show-toast"

export type CartItem = {
  id: number
  name: string
  slug: string
  price: number
  sale_price: number
  image: string
  quantity: number
  stock: number
  maxQuantityAllowed: number
  size?: string
  color?: string
  vendorId?: number
  vendorName?: string | undefined
  discountMessage?: string,
  variantId?: number,
  discount?: number,
  deliverable?:boolean,
  isReturnable?:boolean

}

type CouponState = {
  code: string
  discountAmount: number
  details?: Coupon
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => boolean
  removeItem: (id: number, variantId?: number) => void
  updateQuantity: (id: number, quantity: number, variantId?: number) => void
  updateitemDeliverablilty: (id: number, deliverable: boolean) => void
  clearCart: () => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  totalItems: number
  subtotal: number
  discount: number
  total: number,
  shipping_cost: number,
  appliedCoupon: CouponState | null
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>
  removeCoupon: () => Promise<{ success: boolean; message: string }>
  isCouponLoading: boolean
  couponError: string | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<CouponState | null>(null)
  const [isCouponLoading, setIsCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)

  // Load cart from localStorage on client side
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart from localStorage")
      }
    }

    const savedCoupon = localStorage.getItem("coupon")
    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon))
      } catch (e) {
        console.error("Failed to parse coupon from localStorage")
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(items))
    } else {
      localStorage.removeItem("cart")
    }
  }, [items])

  // Save coupon to localStorage
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("coupon", JSON.stringify(appliedCoupon))
    } else {
      localStorage.removeItem("coupon")
    }
  }, [appliedCoupon])

  const addItem = (item: CartItem) => {
    let success = true;
    setItems((prevItems: any) => {
      const existingItem: CartItem = prevItems.find((i) => i.variantId ? (i.variantId === item.variantId && (i.id === item.id)) : i.id === item.id)

      if (existingItem) {
        const total = existingItem.quantity + item.quantity

        if ((total > item.maxQuantityAllowed) || (total >= item.stock)) {
          const adableQty = item.stock - existingItem.quantity

          item.quantity = (existingItem.quantity as number) + adableQty > item.maxQuantityAllowed ? (item.maxQuantityAllowed - existingItem.quantity) : adableQty
          showToast({description:`Can not add more than ${Math.min(item.maxQuantityAllowed, item.stock)} quantity of this product`,variant:'destructive'})
          success = false
          return prevItems
        }
        return prevItems.map((i: any) =>
          (i.variantId ? (i.id === item.id && i.variantId === item.variantId) : i.id === item.id)
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        )
      } else {
        return [...prevItems, item]
      }
    })

    // If a coupon is applied, revalidate it with the new cart items
    if (appliedCoupon) {
      revalidateCoupon(appliedCoupon.code)
    }
    return success
  }

  const removeItem = (id: number, variantId?: number) => {

    setItems((prevItems) => prevItems.filter((item: any) => item.variantId ? (item.variantId !== variantId) : (item.id !== id))
    )

    // If a coupon is applied, revalidate it with the updated cart items
    if (appliedCoupon) {
      revalidateCoupon(appliedCoupon.code)
    }
  }

  const updateQuantity = (id: number, quantity: number, variantId?: number) => {

    setItems((prevItems: any) => {
      const existingItem: CartItem = prevItems.find((i: any) => i.variantId ? (i.variantId === variantId && i.id === id) : i.id === id);

      if (existingItem) {

        if ((quantity > existingItem.maxQuantityAllowed) || (quantity > existingItem.stock)) {
          const adableQty = existingItem.stock > existingItem.maxQuantityAllowed ? existingItem.maxQuantityAllowed : existingItem.stock;

          quantity = adableQty
          showToast({description:`Can not add more than ${Math.min(existingItem.maxQuantityAllowed, existingItem.stock)} quantity of this product`,variant:'destructive'})
           return 

        }
        return prevItems.map((i: any) =>
          (i.variantId ? (i.id === id && i.variantId == variantId) : i.id === id)
            ? { ...i, quantity: quantity }
            : i,
        )
      }
      return [...prevItems]

    })

    // If a coupon is applied, revalidate it with the updated cart items
    if (appliedCoupon) {
      revalidateCoupon(appliedCoupon.code)
    }
  }
  const updateitemDeliverablilty = (id: number,deliverable: boolean) => {

    setItems((prevItems: any) => {
      const existingItem: CartItem = prevItems.find((i: any) => i.id === id);

      if (existingItem) {
       return prevItems.map((i: any) =>
          ( i.id === id)
            ? { ...i, deliverable: deliverable }
            : i,
        )
      }
      return [...prevItems]

    })

  }

  const clearCart = () => {
    setItems([])
    setAppliedCoupon(null)
    setCouponError(null)
  }

  // Revalidate the coupon with the current cart items
  const revalidateCoupon = async (code: string) => {
    try {
      const response = await validateCoupon(code, items)

      if (response.valid && response.discount_amount !== undefined) {
        setAppliedCoupon({
          code,
          discountAmount: response.discount_amount,
          details: response.coupon,
        })
        setCouponError(null)
      } else {
        // If the coupon is no longer valid with the updated cart, remove it
        setAppliedCoupon(null)
        setCouponError(response.error || "Coupon is no longer valid with your current cart")
      }
    } catch (error) {
      console.error("Error revalidating coupon:", error)
      // Keep the coupon applied but show an error
      setCouponError("Failed to revalidate coupon")
    }
  }

  const applyCoupon = async (code: string): Promise<any> => {
    setCouponError(null)
    setIsCouponLoading(true)

    try {
      const response: any = await apiApplyCoupon(code, items)
     console.log('gt repos',response)
      setAppliedCoupon({
          code,
          discountAmount: response.data.discount,
          details: response.data.coupon,
        })
        setIsCouponLoading(false)
        
      
      
    } catch (error) {
      console.error("Error applying coupon:", error)
      setCouponError(error.message??"Failed to apply coupon")
      setIsCouponLoading(false)
      throw new Error(error.message)
    }
  }

  const removeCoupon = async (): Promise<{ success: boolean; message: string }> => {
    if (!appliedCoupon) {
      return { success: false, message: "No coupon applied" }
    }

    setIsCouponLoading(true)

    try {
      const response = await apiRemoveCoupon(appliedCoupon.code)

      if (response.success) {
        setAppliedCoupon(null)
        setCouponError(null)
        setIsCouponLoading(false)
        return { success: true, message: "Coupon removed successfully" }
      } else {
        setIsCouponLoading(false)
        return { success: false, message: "Failed to remove coupon" }
      }
    } catch (error) {
      console.error("Error removing coupon:", error)
      // Remove the coupon locally even if the API call fails
      setAppliedCoupon(null)
      setCouponError(null)
      setIsCouponLoading(false)
      return { success: true, message: "Coupon removed" }
    }
  }

  const totalItems = items.length
  const subtotal = items.reduce((sum, item) => sum + item.sale_price * item.quantity, 0)
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0
  const total = subtotal - discount
 const shipping_cost=total>500?0.0:99.00;
//const shipping_cost=0;
  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        totalItems,
        subtotal,
        discount,
        total,shipping_cost,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCouponLoading,
        couponError,updateitemDeliverablilty
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
