"use client"

import type React from "react"

import { useAuth } from "@/app/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [user_id, setUserId] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState(1) // 1: Registration form, 2: OTP verification
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const { register, verifyOtp, isLoading } = useAuth()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Basic validation
    if (!name.trim()) {
      setError("Name is required")
      return
    }

    if (!phone || phone.length < 10) {
      setError("Valid phone number is required")
      return
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions")
      return
    }

    const result:any = await register(name, email, phone)

    if (result.success) {
      setStep(2)
      setUserId(result.userId)
      setSuccess("Registration successful! Please verify your phone number with the OTP sent.")
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
      setSuccess("Phone verified successfully! Redirecting to dashboard...")
      setTimeout(() => {
        router.push("/customer/dashboard")
      }, 1500)
    } else {
      setError(result.message)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Customer Registration</CardTitle>
        <CardDescription className="text-center">
          {step === 1 ? "Create a new customer account" : "Verify your phone number"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name*</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address*</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number*</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the{" "}
                <Link href="/terms" className="text-pink-600 hover:text-pink-500">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-pink-600 hover:text-pink-500">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
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
                "Verify & Complete Registration"
              )}
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-pink-600 hover:underline"
              >
                Edit registration details
              </button>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-pink-600 hover:text-pink-500">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
