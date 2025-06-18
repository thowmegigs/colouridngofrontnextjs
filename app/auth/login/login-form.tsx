"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"

import SafeImage from "@/app/components/SafeImage"
import { useAuth } from "@/app/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function LoginForm() {
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [user_id, setUserId] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [timer, setTimer] = useState(30)
  const [canResendOtp, setCanResendOtp] = useState(false)

  const { login, verifyOtp, isLoading, refreshUser,isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/checkout"

  useEffect(() => {
    console.log('isAtthen',isAuthenticated)
    const refersh=async()=>{
        const success = await refreshUser()
          if (success) {
            router.push(redirect)
          }
    }
    if (isAuthenticated) {
      router.replace(redirect)
    }
    else{
    refersh()
    }
  }, [redirect, isAuthenticated])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (otpSent && !canResendOtp) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            setCanResendOtp(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [otpSent, canResendOtp])

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError("")
    setSuccess("")

    try {
      if (!phone || phone.length < 10) {
        setError("Please enter a valid phone number")
        return
      }

      const result: any = await login(phone)


      setOtpSent(true)
      setUserId(result.userId)
      setSuccess("OTP has been sent to your phone number")
      setTimer(30)
      setCanResendOtp(false)

    } catch (error: any) {
      console.log('got err', error)
      setError(error?.message || "Failed to send OTP")
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid OTP")
      return
    }
    try {
      const result = await verifyOtp(phone, otp)

      setSuccess("Login successful! Now redirecting...")
      router.replace(redirect)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-transparent border-0 shadow-none">
      <SafeImage src="/logo.png" width={180} height={70} className="md:hidden w-[160px] h-[55px] text-center mx-auto m-5" alt={"logo"} />
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Login</CardTitle>
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
              <Label htmlFor="phone" className="font-semibold">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter registered phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="text-xs text-muted-foreground px-1">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-primary underline">Terms & Conditions</Link>{" "}
              and <Link href="/privacy_policy" className="text-primary underline">Privacy Policy</Link>. You must be 18+.
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary-500" disabled={isLoading}>
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
            <Button type="submit" className="w-full bg-primary hover:bg-primary-500" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Login"
              )}
            </Button>
            <div className="flex flex-col items-center space-y-2">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-sm text-bg-primary-600 hover:underline"
              >
                Change phone number
              </button>
              {!canResendOtp ? (
                <p className="text-sm text-muted-foreground">
                  Resend OTP in {timer} second{timer !== 1 && "s"}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-primary-600 hover:text-primary-500">
            Register now
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
