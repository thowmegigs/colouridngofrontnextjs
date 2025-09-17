"use client";

import {
  apiRequest,
  validateCoupon,
  type Coupon
} from "@/lib/api";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { showToast } from "../components/show-toast";
import { useAuth } from "./auth-provider";
function snakeToCamel(str: string) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
function camelToSnake(str: string) {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}
export function convertKeysToSnake(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => convertKeysToSnake(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result: any, key) => {
      const snakeKey = camelToSnake(key);
      result[snakeKey] = convertKeysToSnake(obj[key]);
      return result;
    }, {});
  }
  return obj;
}
export function convertKeysToCamel(obj: any) {
  if (Array.isArray(obj)) {
    return obj.map((v) => convertKeysToCamel(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result: any, key) => {
      const camelKey = snakeToCamel(key);
      result[camelKey] = convertKeysToCamel(obj[key]);
      return result;
    }, {});
  }
  return obj;
}
export type CartItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price: number;
  image: string;
  quantity: number;
  stock: number;
  maxQuantityAllowed: number;
  size?: string;
  color?: string;
  vendorId?: number;
  vendorName?: string | undefined;
  discountMessage?: string;
  variantId?: number;
  discount?: number;
  deliverable?: boolean;
  isReturnable?: boolean;
};

type CouponState = {
  code: string;
  discountAmount: number;
  details?: Coupon;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<boolean>;
  removeItem: (id: number, variantId?: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number, variantId?: number) => void;
  updateitemDeliverablilty: (id: number, deliverable: boolean) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
  shipping_cost: number;
  appliedCoupon: CouponState | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => Promise<{ success: boolean; message: string }>;
  isCouponLoading: boolean;
  couponError: string | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponState | null>(null);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  }
  // Load cart from localStorage on client side
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage");
      }
    }

    const savedCoupon = localStorage.getItem("coupon");
    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch (e) {
        console.error("Failed to parse coupon from localStorage");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(items));
    } else {
      localStorage.removeItem("cart");
    }
  }, [items]);

  // Save coupon to localStorage
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("coupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("coupon");
    }
  }, [appliedCoupon]);
  useEffect(() => {
    const loadCart = async () => {
      try {
        const res: any = await apiRequest("/cart", { method: "GET" });
        const data=res.data
        const cartData = data.cart_data;
        
         const couponInfoIfAny = data.couponInfo;
         setItems(cartData);
        if (couponInfoIfAny) {
          localStorage.setItem(
            "coupon",
            JSON.stringify(couponInfoIfAny.coupon)
          );
          setAppliedCoupon({
            code: couponInfoIfAny.code,
            discountAmount: couponInfoIfAny.discount,
            details: couponInfoIfAny.coupon,
          });
        } else {
          localStorage.removeItem("coupon");
          setAppliedCoupon(null);
        }
      } catch (error: any) {
        console.log("errr", error);
      }
    };

    isAuthenticated && loadCart();
  }, [isAuthenticated]);

  const addItem = async (item: CartItem) => {
    let success = true;
    setItems((prevItems: any) => {
      const existingItem: CartItem = prevItems.find((i) =>
        i.variantId
          ? i.variantId === item.variantId && i.id === item.id
          : i.id === item.id
      );

      if (existingItem) {
        const total = existingItem.quantity + item.quantity;

        if (total > item.maxQuantityAllowed || total >= item.stock) {
          const adableQty = item.stock - existingItem.quantity;

          item.quantity =
            (existingItem.quantity as number) + adableQty >
            item.maxQuantityAllowed
              ? item.maxQuantityAllowed - existingItem.quantity
              : adableQty;
          showToast({
            description: `Can not add more than ${Math.min(
              item.maxQuantityAllowed,
              item.stock
            )} quantity of this product`,
            variant: "destructive",
          });
          success = false;
          return prevItems;
        }
        return prevItems.map((i: any) =>
          (
            i.variantId
              ? i.id === item.id && i.variantId === item.variantId
              : i.id === item.id
          )
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        return [...prevItems, item];
      }
    });

    // If a coupon is applied, revalidate it with the new cart items
    if (appliedCoupon) {
      revalidateCoupon(appliedCoupon.code);
    }
    if (success && isAuthenticated) {
      try {
        const response = await apiRequest("cart/add", {
          method: "POST",
          requestData: item,
        });
      
      } catch (error: any) {
        console.log("error", error);
      }
    }
    return success;
  };

  const removeItem = async (id: number, variantId?: number) => {
    setItems((prevItems) =>
      prevItems.filter((item: any) =>
        item.variantId ? item.variantId !== variantId : item.id !== id
      )
    );
   
    if (isAuthenticated) {
      try {
        const response = await apiRequest("cart/removeItem", {
          method: "POST",
          requestData: { id: id,variant_id:variantId },
        });
      
      } catch (error: any) {
        console.log("error", error);
      }
    }
    // If a coupon is applied, revalidate it with the updated cart items
    if (appliedCoupon) {
      revalidateCoupon(appliedCoupon.code);
    }
  };

  const updateQuantity = async (
    id: number,
    quantity: number,
    variantId?: number
  ) => {
    let success = true;
    setItems((prevItems: any) => {
      const existingItem: CartItem = prevItems.find((i: any) =>
        i.variantId ? i.variantId === variantId && i.id === id : i.id === id
      );

      if (existingItem) {
        if (
          quantity > existingItem.maxQuantityAllowed ||
          quantity > existingItem.stock
        ) {
          const adableQty =
            existingItem.stock > existingItem.maxQuantityAllowed
              ? existingItem.maxQuantityAllowed
              : existingItem.stock;

          quantity = adableQty;
          success = false;
          showToast({
            description: `Can not add more than ${Math.min(
              existingItem.maxQuantityAllowed,
              existingItem.stock
            )} quantity of this product`,
            variant: "destructive",
          });
          return;
        }
        return prevItems.map((i: any) =>
          (i.variantId ? i.id === id && i.variantId == variantId : i.id === id)
            ? { ...i, quantity: quantity }
            : i
        );
      }
      return [...prevItems];
    });
    if (success && isAuthenticated) {
      try {
        const response = await apiRequest("cart/updateQuantity", {
          method: "POST",
          requestData: { id: id },
        });
     
      } catch (error: any) {
        console.log("error", error);
      }
    }

    // If a coupon is applied, revalidate it with the updated cart items
    if (appliedCoupon) {
      revalidateCoupon(appliedCoupon.code);
    }
  };
  const updateitemDeliverablilty = (id: number, deliverable: boolean) => {
    setItems((prevItems: any) => {
      const existingItem: CartItem = prevItems.find((i: any) => i.id === id);

      if (existingItem) {
        return prevItems.map((i: any) =>
          i.id === id ? { ...i, deliverable: deliverable } : i
        );
      }
      return [...prevItems];
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Revalidate the coupon with the current cart items
  const revalidateCoupon = async (code: string) => {
    try {
      const response = await validateCoupon(code, items);

      if (response.valid && response.discount_amount !== undefined) {
        setAppliedCoupon({
          code,
          discountAmount: response.discount_amount,
          details: response.coupon,
        });
        setCouponError(null);
      } else {
        // If the coupon is no longer valid with the updated cart, remove it
        setAppliedCoupon(null);
        setCouponError(
          response.error || "Coupon is no longer valid with your current cart"
        );
      }
    } catch (error) {
      console.error("Error revalidating coupon:", error);
      // Keep the coupon applied but show an error
      setCouponError("Failed to revalidate coupon");
    }
  };

  const applyCoupon = async (code: string): Promise<any> => {
    setCouponError(null);
    setIsCouponLoading(true);
    try {
      const response: any = await apiRequest("/coupons/apply", {
        method: "POST",
        requestData: {
          code,
        },
      });
    
      setAppliedCoupon({
        code,
        discountAmount: parseFloat(response.data.discount),
        details: response.data.coupon,
      });
      setIsCouponLoading(false);
    } catch (error) {
      console.error("Error applying coupon:", error.message);
      setCouponError(error.message ?? "Failed to apply coupon");
      setIsCouponLoading(false);
      throw new Error(error.message);
    }
  };

  const removeCoupon = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    if (!appliedCoupon) {
      return { success: false, message: "No coupon applied" };
    }

    setIsCouponLoading(true);

    try {
      const response:any = await apiRequest('cart/removeAppliedCouponCodeReservationWala',
        {method:'POST',requestData:{coupon_id:appliedCoupon. details?.id}});

      if (response.success) {
        setAppliedCoupon(null);
        setCouponError(null);
        setIsCouponLoading(false);
        return { success: true, message: "Coupon removed successfully" };
      } else {
        setIsCouponLoading(false);
        return { success: false, message: "Failed to remove coupon" };
      }
    } catch (error) {
    
      // // Remove the coupon locally even if the API call fails
      // setAppliedCoupon(null);
      // setCouponError(null);
      // setIsCouponLoading(false);
      return { success: false, message: "Failed to remove Coupon " };
    }
  };

  const totalItems = items.length;
  const subtotal = items.reduce(
    (sum, item) => sum + item.sale_price * item.quantity,
    0
  );
  
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = subtotal - discount;
  //const shipping_cost=total>500?0.0:99.00;
  const shipping_cost = 0;
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
        total,
        shipping_cost,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCouponLoading,
        couponError,
        updateitemDeliverablilty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
