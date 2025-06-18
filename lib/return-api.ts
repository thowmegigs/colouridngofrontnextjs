import { api_url } from "@/contant"
import { OrderItem } from "./api"

export type ReturnReason =
  | "defective"
  | "wrong-item"
  | "not-as-described"
  | "better-price"
  | "no-longer-needed"
  | "accidental-order"
  | "other"

export type ReturnCondition = "unopened" | "opened" | "used" | "damaged"

export type ReturnMethod = "original" | "store-credit" | "upi"

export type ReturnStatus = "pending" | "approved" | "rejected" | "processing" | "completed" | "cancelled"

export interface ReturnItem extends OrderItem {
  selected: boolean
}

export interface Return {
  id: string
  orderId: string
  orderNumber: string
  userId: string
  items: ReturnItem[]
  reason: ReturnReason
  condition: ReturnCondition
  description: string
  returnMethod: ReturnMethod
  status: ReturnStatus
  imageUrls: string[]
  upiId?: string
  upiQrCodeUrl?: string
  createdAt: string
  updatedAt: string
  trackingNumber?: string
  refundAmount?: number
  refundStatus?: "pending" | "processing" | "completed"
  notes?: string
}

export interface ReturnResponse {
  id: string
  orderId: string
  orderNumber: string
  userId: string
  items: ReturnItem[]
  reason: ReturnReason
  condition: ReturnCondition
  description: string
  returnMethod: ReturnMethod
  status: ReturnStatus
  imageUrls: string[]
  upiId?: string
  upiQrCodeUrl?: string
  createdAt: string
  updatedAt: string
  trackingNumber?: string
  refundAmount?: number
  refundStatus?: "pending" | "processing" | "completed"
  notes?: string
}

export interface ReturnListResponse {
  data: Return[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}


//const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"

/**
 * Create a new return request
 */

//const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"



/**
 * Create a new return request
 */
const API_URL=api_url
export async function createReturn(formData: FormData) {
  try {
    const response = await fetch(`${API_URL}/returns`, {
      method: "POST",
    
      credentials: "include", // Include cookies for authentication
      body: formData,
    })


    return await response.json()
  } catch (error) {
    console.error("Error creating return:", error)
    throw error
  }
}

/**
 * Get all returns for the current user
 */
export async function getReturns(page = 1, limit = 10) {
  try {
    const response = await fetch(`${API_URL}/returns?page=${page}&limit=${limit}`, {
      credentials: "include", // Include cookies for authentication
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch returns")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching returns:", error)
    throw error
  }
}

/**
 * Get a specific return by ID
 */
export async function getReturnById(returnId: string) {
  try {
    const response = await fetch(`${API_URL}/returns/return-requests/${returnId}`, {
      credentials: "include", // Include cookies for authentication
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch return details")
    }
    
    const g:any=await response.json()
    console.log('g', g.data.request)
    return  g.data.request
  } catch (error) {
    console.error("Error fetching return details:", error)
    throw error
  }
}
export async function getExchangeById(returnId: string) {
  try {
    const response = await fetch(`${API_URL}/exchanges/exchange-requests/${returnId}`, {
      credentials: "include", // Include cookies for authentication
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch return details")
    }
    
    const g:any=await response.json()
    console.log('dfffg', g.data.request)
    return  g.data.request
  } catch (error) {
    console.error("Error fetching return details:", error)
    throw error
  }
}

/**
 * Cancel a return request
 */
export async function cancelReturn(returnId: string) {
  try {
    const response = await fetch(`${API_URL}/returns/return-requests/${returnId}/cancel`, {
      method: "POST",
      credentials: "include", // Include cookies for authentication
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to cancel return request")
    }

    return await response.json()
  } catch (error) {
    console.error("Error cancelling return:", error)
    throw error
  }
}
export async function cancelExchange(returnId: string) {
  try {
    const response = await fetch(`${API_URL}/exchanges/exchange-requests/${returnId}/cancel`, {
      method: "POST",
      credentials: "include", // Include cookies for authentication
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to cancel return request")
    }

    return await response.json()
  } catch (error) {
    console.error("Error cancelling return:", error)
    throw error
  }
}
