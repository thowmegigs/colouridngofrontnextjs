"use client"

import type React from "react"

import { api_url } from "@/contant"
import { apiRequest } from "@/lib/api"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

// Define the API base URL for your Express.js backend
const API_BASE_URL = api_url // Replace with your actual backend URL

type User = {
  id: string | number
  name: string
  email: string
  phone: string

}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (phone: string) => Promise<{ success: boolean; message: string }>
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; message: string }>
  //  verifyReOtp: ( otp: string,type:string,val:any) => Promise<{ success: boolean; message: string }>
  verifyRegOtpAndLogin: (otp: string, name: string, email: string, phone: string) => Promise<{ success: boolean; message: string }>
  verifyUpdateOtp: (otp: string | null, name: string, email: string, phone: string) => Promise<{ success: boolean; message: string }>
  register: (name: string, email: string, phone: string) => Promise<{ success: boolean; message: string }>
  updateProfile: (name: string, email: string, phone: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
  
    const checkAuth = async () => {
      try {
      
         const response = await apiRequest(
        'auth/profile',
        {
          method: "GET",
        })

       
       
          setUser({ ...response.data.user })
          setIsAuthenticated(true)



        
      } catch (error) {
       // console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    !user && checkAuth()
  }, [])

  const login = async (phone: string) => {
    try {
      setIsLoading(true)
      const response = await apiRequest(
        'auth/login',
        {
          method: "POST",
          requestData: JSON.stringify({ phone })

        })

      setIsLoading(false)
      return {
        success: true,
        message: response.message,
      }

    } catch (error) {
      setIsLoading(false)
      throw new Error(error.message)
    }
  }

  const verifyOtp = async (phone: any, otp: string) => {
    try {
      setIsLoading(true)

      const response = await apiRequest(
        'auth/verify-otp',
        {
          method: "POST",
          requestData: JSON.stringify({ phone, otp })

        })

      setIsLoading(false)
      setUser(response.data.user)


      return {
        success: true,
        message: response.message,
      }
    } catch (error) {
      setIsLoading(false)
      throw new Error(error.message)
    }
  }

  const verifyRegOtpAndLogin = async (otp: string, name: string, email: string, phone: string) => {
    try {
      setIsLoading(true)

      const response = await apiRequest(
        'auth/verify-register-otp-and-login',
        {
          method: "POST",
          requestData: JSON.stringify({ otp, name, email, phone })

        })

      setIsLoading(false)
      setUser(response.data.user)
      setIsAuthenticated(true)


      return {
        success: true,
        message: response.message,

      }
    } catch (error) {
      setIsLoading(false)
      throw new Error(error.message)
      
    }
  }
  const verifyUpdateOtp = async (otp: string | null, name: string, email: string, phone: string) => {
    try {
      setIsLoading(true)

      const response = await apiRequest(
        'auth/verify-update-otp',
        {
          method: "POST",
          requestData: JSON.stringify({ otp, name, email, phone, user_id: user.id })

        })



      setIsLoading(false)
      setUser(response.data.user)



      return {
        success: true,
        message: response.message,

      }
    } catch (error) {
      setIsLoading(false)
      throw new Error(error.message)
    }
  }


  const register = async (name: string, email: string, phone: string) => {
    try {
      setIsLoading(true)

      const response = await apiRequest(
        'auth/register',
        {
          method: "POST",
          requestData: JSON.stringify({ name, email, phone })

        })

      setIsLoading(false)

      return {
        success: true,
        message: response.message, userId: response.data.userId
      }
    } catch (error) {
      setIsLoading(false)
       throw new Error(error.message)
    }
  }
  const updateProfile = async (name: string, email: string, phone: string) => {
    try {
      setIsLoading(true)

      const response = await apiRequest(
        'auth/profile/update',
        {
          method: "POST",
          requestData: JSON.stringify({ name, email, phone })

        })

      setIsLoading(false)


      setUser(response.data.user)
      return {
        success: true,
        message: response.message,
      }


    } catch (error) {
      setIsLoading(false)
      throw new Error(error.message)
    }
  }

  const logout = async () => {
    try {

      const response = await apiRequest(
        'auth/logout',
        {
          method: "GET",
         })

      setUser(null)
      setIsAuthenticated(false)
      location.reload();
    } catch (error) {
      console.error("Logout error:", error)
      // return {
      //   success: false, message: error.message
      // }
    }
  }

  const refreshUser = async (): Promise<boolean> => {

    try {

      const response = await apiRequest(
        'auth/profile',
        {
          method: "GET",


        })



      setUser(response.data.user)
      setIsAuthenticated(true)
      return true

    } catch (error) {
      console.error("User refresh failed:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user, updateProfile,
        isLoading,
        isAuthenticated,
        login,
        verifyOtp,
        verifyRegOtpAndLogin,
        verifyUpdateOtp,
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
