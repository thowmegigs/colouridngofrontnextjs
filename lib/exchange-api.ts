import { api_url } from "@/contant"

const API_URL = api_url

/**
 * Create an exchange request
 */
export async function createExchange(formData: FormData) {
  try {
    const response = await fetch(`${API_URL}/api/exchanges`, {
      method: "POST",
      credentials: "include", // Include cookies for authentication
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create exchange request")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating exchange:", error)
    throw error
  }
}

/**
 * Get exchange by ID
 */
export async function getExchangeById(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/exchanges/${id}`, {
      method: "GET",
      credentials: "include", // Include cookies for authentication
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to get exchange")
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting exchange:", error)
    throw error
  }
}

/**
 * Cancel exchange
 */
export async function cancelExchange(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/exchanges/${id}/cancel`, {
      method: "POST",
      credentials: "include", // Include cookies for authentication
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to cancel exchange")
    }

    return await response.json()
  } catch (error) {
    console.error("Error cancelling exchange:", error)
    throw error
  }
}
