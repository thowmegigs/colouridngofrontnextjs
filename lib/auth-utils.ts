// Helper function to make authenticated API requests
export const authFetch = async (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: "include", // Important for cookies
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
}

// Check if user is authenticated (client-side)
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    return false
  }
}
