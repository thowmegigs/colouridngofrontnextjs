// lib/api.ts
import { api_url } from "@/contant";
import axios from "axios";
import CryptoJS from 'crypto-js';

export const fetchTopSlider = async () => {
  const res = await axios.get(`${api_url}/top_slider`)
  return res.data.data.json_column
}

export const fetchTopCategories = async () => {
  const res = await axios.get(`${api_url}/menu_categories`)
  return res.data.data
}
export const fetchCities = async (state_id: number) => {
  const res = await axios.get(`${api_url}/city/${state_id}`)
  return res.data
}
export const fetchStates = async () => {
  const res = await axios.get(`${api_url}/states/`)
  return res.data
}
export const fetchContentSections = async () => {
  const res = await axios.get(`${api_url}/content_sections`)
  return res.data.data
}
export const fetchProductsByCategory = async (slug: string, filterString: string) => {
  const { data } = await axios.get(`${api_url}/products/category/${slug}?${filterString}`);
  return data;
};
export const fetchFilterOptions = async (slug: string, limit: number) => {
  const { data } = await axios.get(`${api_url}/filter_options/${slug}?limit=${limit}`);
  return data;
};
export const fetchFacetOptions = async (slug:string) => {
  const response= await axios.get(`${api_url}/facet_options/${slug}`);
  
  return response.data;
};
export const fetchProductDetail = async (slug: string) => {
  const { data } = await axios.get(`${api_url}/products/${slug}`);
  return data;
};
export const fetchColletionCatAndBrand = async (slug:string) => {
  const { data } = await axios.get(`${api_url}/products/collection/catandbrand/${slug}`);
  return data;
};
export const fetchCollectionProducts = async (slug:string,filter:string) => {
  const { data } = await axios.get(`${api_url}/products/collection/${slug}?${filter}`);
  return data;
};
export type ReviewSubmission = {
  product_id: number
  user_name: string
  rating: number
  comment: string
}

export async function submitProductReview(formData: FormData) {
  const res: any = await fetch(`${api_url}/reviews`, {
    method: "POST",
    body: formData,
  })
  const resp = await res.json();
  if (!res.ok) {

    console.log('yha pe rrro', resp)
    throw new Error(resp.message || "Something went wrong")
  }

  if (!resp['success']) {


    throw new Error(resp['message'])
  }

  return resp
}


export type ProductReview = {
  id: number
  user_name: string
  rating: number
  comment: string
  created_at: string
}
export type Coupon = {
  code: string
  description: string
  discount_type: "Percent" | "Flat"
  discount: number
  cart_amount: number
  end_date: string
  status: "Active" | "In-Active"
  max_usage: number | null
  current_used: number
  max_discount: number | null
  products: string[] | null
  categories: string[] | null
  exclude_sale_items: boolean
  individual_use_only: boolean
  user_id: number | null
}
export type CouponValidationResponse = {
  valid: boolean
  coupon?: Coupon
  discount_amount?: number
  message?: string
  error?: string
}

export async function validateCoupon(code: string, cartItems: any[]): Promise<CouponValidationResponse> {

  const subtotal = cartItems.reduce((sum, item) => sum + Number.parseFloat(item.price) * item.quantity, 0)

  return await axios.post(`${api_url}/coupons/apply`, {
    code, user_id: 1, cartTotal: subtotal
  })
}

export async function applyCoupon(code: string, cartItems: any[]): Promise<CouponValidationResponse> {
  // This would typically update the coupon usage in the database
  // For now, we'll just validate the coupon
  return validateCoupon(code, cartItems)
}

export async function removeCoupon(code: string): Promise<{ success: boolean; message: string }> {
  // Mock implementation - replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    success: true,
    message: "Coupon removed successfully",
  }
}

export async function fetchAvailableCoupons(): Promise<Coupon[]> {
  // Mock implementation - replace with actual API call
  const res = await axios.get(`${api_url}/coupons`)
  return res.data
}

// New authentication functions
export async function sendOTP(phoneNumber: string) {
  // Simulate API call with delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock response - in a real app, this would send an actual SMS
  return {
    success: true,
    message: "OTP sent successfully",
  }
}

export async function verifyOTP(phoneNumber: string, otp: string) {
  // Simulate API call with delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Mock verification - in a real app, this would verify the actual OTP
  // For demo purposes, any 6-digit OTP is considered valid
  const isValid = otp.length === 6

  if (isValid) {
    // Store auth token in localStorage to simulate login
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", "mock_token_" + Date.now())
      localStorage.setItem("user_phone", phoneNumber)
    }

    return {
      success: true,
      user: {
        id: "user_" + Date.now(),
        phoneNumber,
        name: "Test User",
        email: "user@example.com",
      },
      token: "mock_token_" + Date.now(),
    }
  }

  return {
    success: false,
    message: "Invalid OTP. Please try again.",
  }
}

export async function registerUser(name: string, email: string, phoneNumber: string) {
  // Simulate API call with delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock registration - in a real app, this would create a user in the database
  return {
    success: true,
    message: "Registration successful",
    user: {
      id: "user_" + Date.now(),
      name,
      email,
      phoneNumber,
    },
  }
}

export async function getCurrentUser() {
  // Simulate API call with delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check if user is logged in by looking for token in localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    const phoneNumber = localStorage.getItem("user_phone")

    if (token && phoneNumber) {
      return {
        isAuthenticated: true,
        user: {
          id: "user_" + phoneNumber,
          phoneNumber,
          name: "Test User",
          email: "user@example.com",
        },
      }
    }
  }

  return {
    isAuthenticated: false,
    user: null,
  }
}

export async function logout() {
  // Simulate API call with delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Remove auth token from localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_phone")
  }

  return {
    success: true,
    message: "Logged out successfully",
  }
}

export type PincodeAvailabilityResponse = {
  available: boolean
  message: string
  estimated_delivery_days?: number
  cod_available?: boolean
  express_delivery_available?: boolean
}



export async function checkPincodeAvailability(pincode: string): Promise<PincodeAvailabilityResponse> {
  // Mock implementation - replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock data - in a real app, this would come from your API
  const availablePincodes = ["10001", "10002", "10003", "10004", "10005", "90210", "60601", "75001", "400001", "400002"]
  const isAvailable = availablePincodes.includes(pincode)

  if (isAvailable) {
    return {
      available: true,
      message: `Delivery available to ${pincode}`,
      estimated_delivery_days: Math.floor(Math.random() * 3) + 1, // Random between 1-3 days
      cod_available: Math.random() > 0.3, // 70% chance of COD being available
      express_delivery_available: Math.random() > 0.5, // 50% chance of express delivery
    }
  } else {
    return {
      available: false,
      message: `Sorry, we don't deliver to ${pincode} yet.`,
    }
  }
}

// New types and functions for address management and order creation

export type PaymentMethod = "razorpay" | "cod" | "paypal" | "stripe"

export type Address = {
  id?: string
  user_id: string
  name: string

  phone_number: string
  address1: string
  address2?: string | undefined
  city_id: string
  state_id: string
  state_name?: any
  city_name?: any
  pincode: string
  country: string
  is_default: string
  address_for: "Shipping" | "Billing"
  address_type: "Home" | "Work" | "Other"
}

export type OrderItem = {
  product_id: string
  variant_id?: string
  name: string
  price: number
  sale_price: number
  quantity: number
  image?: string
  size?: string
  color?: string
}

export type OrderRequest = {
  items: OrderItem[]
  shipping_address_id: string
  billing_address_id: string
  payment_method: PaymentMethod
  shipping_method: "Standard" | "Express" | "Same-day"
  delivery_instructions?: string
  subtotal: number
  shipping_cost: number
  discount: number
  total: number
  coupon_code?: string | undefined
  coupon_discount?: number | undefined
  coupon_type?: string | undefined
}

export type OrderResponse = {
  success: boolean
  order_id: string
  message: string
  payment_required: boolean
  razorpay_order?: {
    id: string
    amount: number
    currency: string
  }
}

// Mock function to fetch user addresses
export async function fetchUserAddresses(): Promise<Address[]> {
  const formData = new FormData()

  const user_id = 1
  const res: any = await axios.get(`${api_url}/addresses/${user_id}`)

  const resp = res.data;
  if (!resp.success) {


    throw new Error(resp.message || "Something went wrong")
  }


  return resp
}

// Mock function to save an address
export async function saveAddress(address: Address, is_update: boolean): Promise<Address> {
  // Mock implementation - replace with actual API call
  return !is_update
    ? await axios.post(`${api_url}/addresses`, address)
    : await axios.put(`${api_url}/addresses/${address.id}`, { ...address, user_id: 1 })

}

// Mock function to delete an address
export async function deleteAddress(id: string): Promise<{ success: boolean; message: string }> {
  // Mock implementation - replace with actual API call
  return await axios.delete(`${api_url}/addresses/${id}`, {
    data: {
      user_id: "1"
    }
  })


}
export type CouponInfo = {
  code: string
  discount: number
  discountType: "percentage" | "fixed"
}

// Mock function to create an order
export async function createOrder(orderData: OrderRequest): Promise<OrderResponse> {
  // Mock implementation - replace with actual API call


  const resp = await axios.post(`${api_url}/orders`, orderData)
  const res=resp.data;
  if (orderData.payment_method === "razorpay") {
    return {
      success: true,
      order_id: res.data.order_id,
      message: "Order created successfully. Please complete the payment.",
      payment_required: true,
      razorpay_order: {
        id: res.data.razorpay_order_id,
        amount: Math.round( res.data.amount * 100), // Convert to paise
        currency: "INR",
      },
    }
  }
  return {
    success: true,
    order_id: res.data.order_id,
    message: "Order placed successfully with Cash on Delivery.",
    payment_required: false,
  }
  // For COD or other payment methods, just return the order ID

}

 const secretKeyForUrlIdEncryption = 'my-secret-key';
 export  const encryptId = (id:any) => {
  return CryptoJS.AES.encrypt(id.toString(), secretKeyForUrlIdEncryption).toString();
};
export const decryptId = (encryptedId:any) => {
  const bytes = CryptoJS.AES.decrypt(encryptedId, secretKeyForUrlIdEncryption);
  return bytes.toString(CryptoJS.enc.Utf8);
};
export const fetchOrders = async () => {
  const response = await axios.get(`${api_url}/orders`, { withCredentials: true }); // Ensure cookies (JWT) are sent
 console.log( response.data.data.order)
  return response.data.data.order;
};
export const fetchOrderById = async (orderId: string | number) => {
  const response = await axios.get(`${api_url}/orders/${orderId}`, {
    withCredentials: true // Include cookies for auth
  });
  return response.data.data;
};
export const fetchProductVariantById = async (orderItemId: string | number) => {
  const response = await axios.get(`${api_url}/product_variants/${orderItemId}`, {
    withCredentials: true // Include cookies for auth
  });

  return response.data;
};