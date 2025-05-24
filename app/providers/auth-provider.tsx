"use client"

import type React from "react"

import { api_url } from "@/contant"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

// Define the API base URL for your Express.js backend
const API_BASE_URL = api_url // Replace with your actual backend URL

type User = {
  id: string|number
  name: string
  email: string
  phone: string
  
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (phone: string) => Promise<{ success: boolean; message: string }>
  verifyOtp: (userId: string, otp: string) => Promise<{ success: boolean; message: string }>
  register: (name: string, email: string, phone: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: "GET",
          credentials: "include", // Important for cookies
        })

        const data = await response.json()
     
        if (data.success) {
             console.log('au',data)
          setUser({...data.data.user})
          

        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (phone: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
        credentials: "include", // Important for cookies
      })

      const data = await response.json()
      setIsLoading(false)

      return {
        success: data.success,
        message: data.message,userId:data.data.user.id
      }
    } catch (error) {
      setIsLoading(false)
      return {
        success: false,
        message: "Login failed. Please try again.",
      }
    }
  }

  const verifyOtp = async (userId: any, otp: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
        credentials: "include", // Important for cookies
      })

      const data = await response.json()
      setIsLoading(false)
      console.log('after veriy', data)
      if (data.success) {
        setUser(data.data.user)
      }

      return {
        success: data.success,
        message: data.message,
      }
    } catch (error) {
      setIsLoading(false)
      return {
        success: false,
        message: "OTP verification failed. Please try again.",
      }
    }
  }

  const register = async (name: string, email: string, phone: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
        credentials: "include", // Important for cookies
      })

      const data = await response.json()
      setIsLoading(false)

      return {
        success: data.success,
        message: data.message,userId:data.data.userId
      }
    } catch (error) {
      setIsLoading(false)
      return {
        success: false,
        message: "Registration failed. Please try again.",
      }
    }
  }

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // Important for cookies
      })

      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const refreshUser = async (): Promise<boolean> => {
    console.log('fetching fgf')
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "GET",
        credentials: "include", // Important for cookies
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.data.user)
        return true
      }

      return false
    } catch (error) {
      console.error("User refresh failed:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        verifyOtp,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
