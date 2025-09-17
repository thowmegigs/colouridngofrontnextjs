// lib/api.ts
import { api_url } from "@/contant";

import axios, { AxiosRequestConfig, Method } from 'axios';
import CryptoJS from 'crypto-js';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiRequestOptions<T = unknown> {
  method?: HttpMethod;
  requestData?: T;
  headers?: Record<string, string>;
  config?: AxiosRequestConfig;
}

// Utility to check for a specific cookie (e.g., token)
function hasAuthCookie(cookieName: string = 'token'): boolean {
  if (typeof document === 'undefined') return false; // SSR safe
  return document.cookie.split(';').some(cookie => cookie.trim().startsWith(`${cookieName}=`));
}
type TResponseType = {
  message: string,
  data: any
}
export async function apiRequest(
  url: string,
  options: ApiRequestOptions = {}
): Promise<TResponseType> {
  const {
    method = 'GET',
    requestData,
    headers = {},
    config = {},
  } = options;

  const withCredentials = true;

  try {
    const response = await axios.request({
     url:`${api_url}/${url}`,
      method: method as Method,
      data: requestData,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      withCredentials,
      ...config,
    });
  
    const response_data = response.data;/**** {success:'',message:'',data:}***/

    if (response_data.success) {
      return response_data
    }
    else {
      console.log('error in her', response_data.message)
      throw new Error(response_data.message);
    }
  } catch (error: any) {
    console.error(`API ${method} ${url} failed:`, error);

    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }

    throw error;
  }
}



// =============================================
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
  return res.data
}

export const fetchProductsByCategory = async (slug: string, filterString: string, page: number = 1) => {
  const { data } = await axios.get(`${api_url}/products/category/${slug}?${filterString}&page=${page}`);
  return data;
};
export const fetchFilterOptions = async (slug: string, limit: number) => {
  const { data } = await axios.get(`${api_url}/filter_options_for_category/${slug}?limit=${limit}`);
  return data;
};
export const fetchFacetOptions = async (slug: string) => {
  const response = await axios.get(`${api_url}/facet_options/${slug}`);

  return response.data;
};
export const fetchProductDetail = async (slug: string) => {
  const { data } = await axios.get(`${api_url}/products/${slug}`);
  return data;
};
export const fetchColletionCatAndBrandOption = async (slug: string) => {
  const { data } = await axios.get(`${api_url}/filter_options_for_collection/${slug}`);
  return data;
};
export const fetchCollectionProducts = async (slug: string, filter: string, page: number) => {
  const { data } = await axios.get(`${api_url}/products/collection/${slug}?${filter}&page=${page}`);
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
    credentials: "include"
  })
  const resp = await res.json();
  if (!res.ok) {


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
  id?: number
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

export async function validateCoupon(code: string, cartItems: any[]): Promise<any> {

  const subtotal = cartItems.reduce((sum, item) => sum + Number.parseFloat(item.sale_price) * item.quantity, 0)
  try{
   return  await apiRequest('/coupons/apply',{
    method:"POST",
    requestData: {
    code,cartTotal: subtotal
  }});
   
}catch(err){
      throw new Error(err.message || "Coupon validation failed");
 
}

 
}
export async function applyCoupon(
  code: string,
  cartItems: any[]
): Promise<CouponValidationResponse> {
  try {
    return await validateCoupon(code, cartItems);
  } catch (err: any) {
    throw new Error(err.message || "Coupon validation failed");
  }
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
export async function sendOTP(type: string, value: any, module: "login" | "register") {
  // Simulate API call with delay
  try {
    const res = await apiRequest(`auth/send-otp`, {method:"POST",requestData:{type, value, module }})

    return { success: true, message: 'Sent' }
  } catch (error: any) {
    throw new Error(error.message) 
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



export async function checkPincodeAvailability(productIds: any[], pincode: string): Promise<PincodeAvailabilityResponse> {
  // Mock implementation - replace with actual API call
  const res = await axios.post(`${api_url}/shiprocket/check-serviceability`, {
    productIds,
    toPincode: pincode
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return res.data.data

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
  product_id: number
  variant_id?: number
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
  coupon_type?: string | undefined,
  shipping_breakdown?: any,
  esitmated_days?: number | null
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

  const res: any = await axios.get(`${api_url}/addresses`, {
    withCredentials: true
  })

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
    ? await axios.post(`${api_url}/addresses`, address, {
      withCredentials: true
    })
    : await axios.put(`${api_url}/addresses/${address.id}`, { ...address }, {
      withCredentials: true
    })

}

// Mock function to delete an address
export async function deleteAddress(id: string):Promise<any> {
  // Mock implementation - replace with actual API call
  try{
  return await apiRequest(`addresses/${id}`, {method:"DELETE"})
  }catch(error:any){
     throw new Error(error.message) 
  }


}
export type CouponInfo = {
  id?:number,
  code: string
  discount: number
  discountType: "percentage" | "fixed"
}

// Mock function to create an order
export async function createOrder(orderData: OrderRequest): Promise<OrderResponse> {
  // Mock implementation - replace with actual API call


  const resp = await axios.post(`${api_url}/orders`, orderData, { withCredentials: true })
  const res = resp.data;
  if (orderData.payment_method === "razorpay") {
    return {
      success: true,
      order_id: res.data.order_id,
      message: "Order created successfully. Please complete the payment.",
      payment_required: true,
      razorpay_order: {
        id: res.data.razorpay_order_id,
        amount: Math.round(res.data.amount * 100), // Convert to paise
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
export const encryptId = (id: any) => {
  return CryptoJS.AES.encrypt(id.toString(), secretKeyForUrlIdEncryption).toString();
};
export const decryptId = (encryptedId: any) => {
  const bytes = CryptoJS.AES.decrypt(encryptedId, secretKeyForUrlIdEncryption);
  return bytes.toString(CryptoJS.enc.Utf8);
};
export const fetchOrders = async () => {
  const response = await axios.get(`${api_url}/orders`, { withCredentials: true }); // Ensure cookies (JWT) are sent
  console.log(response.data.data.order)
  return response.data.data.order;
};
export const fetchOrderById = async (orderId: string | number) => {
  const response = await axios.get(`${api_url}/orders/${orderId}`, {
    withCredentials: true // Include cookies for auth
  });
  return response.data.data;
};
export const fetchSetting = async () => {
  const response = await axios.get(`${api_url}/setting/`, {
    withCredentials: true // Include cookies for auth
  });
  return response.data.data;
};
export const fetchProductVariantById = async (orderItemId: string | number) => {
  const response = await axios.get(`${api_url}/product_variants/${orderItemId}`, {
    withCredentials: true // Include cookies for auth
  });

  return response.data.data;
};