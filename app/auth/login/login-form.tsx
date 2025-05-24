"use client"

import type React from "react"

import { useAuth } from "@/app/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function LoginForm() {
  
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [user_id, setUserId] = useState("")
   

  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { login, verifyOtp, isLoading,isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/customer/dashboard'
    useEffect(() => {
    if(isAuthenticated){
      // console.log('goimg',redirect)
      router.replace(redirect)
    }
    }, [redirect,isAuthenticated])
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    const result:any = await login(phone)
console.log('result',result)
    if (result.success) {
      setOtpSent(true)
      setUserId(result.userId)
      setSuccess("OTP sent successfully to your phone")
    } else {
      setError(result.message)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP")
      return
    }

    const result = await verifyOtp(user_id, otp)
    if (result.success) {
      setSuccess("Login successful! Redirecting...")
      console.log('redirect',redirect)
      setTimeout(() => {
        router.push(redirect)
      }, 1500)
    } else {
      setError(result.message)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Customer Login</CardTitle>
        <CardDescription className="text-center">
          {otpSent ? "Enter the OTP sent to your phone" : "Login with your phone number"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
        )}

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter verification code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
              />
              <p className="text-xs text-gray-500">We sent a verification code to {phone}</p>
            </div>
            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Login"
              )}
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-sm text-pink-600 hover:underline"
              >
                Change phone number
              </button>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-pink-600 hover:text-pink-500">
            Register now
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
