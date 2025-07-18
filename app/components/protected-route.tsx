"use client"

import type React from "react"

import { useAuth } from "@/app/providers/auth-provider"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, refreshUser } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
 const pathname = usePathname()
  useEffect(() => {
    const checkAuth = async () => {
    
     
        if (!isAuthenticated) {
          // Try to refresh user data once
          const success = await refreshUser()
          if (!success) {
            router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
          }
        }
        setIsChecking(false)
     
    }
    !isAuthenticated?  checkAuth():setIsChecking(false)
  }, [isLoading, isAuthenticated, refreshUser, router])

  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return <>{children}</>
}
