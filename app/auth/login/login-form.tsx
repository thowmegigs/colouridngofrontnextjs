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
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Phone } from "lucide-react"

export default function LoginForm() {
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [user_id, setUserId] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [timer, setTimer] = useState(30)
  const [canResendOtp, setCanResendOtp] = useState(false)

  const { login, verifyOtp, isLoading, refreshUser, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

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
      setError(error?.message || "Failed to send OTP")
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    const redirect = searchParams.get("redirect") || "/"

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid OTP")
      return
    }

    try {
      const result = await verifyOtp(phone, otp)
      setSuccess("Login successful! Now redirecting...")
      setTimeout(() => {
        router.replace(redirect)
      }, 3000)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
   <div className="flex items-start pt-[130px] md:pt-[50px] justify-center min-h-screen bg-transparent ">
  <div className="w-full max-w-md">
        {/* Main Card */}
        <Card className="bg-transparent shadow-none border-none rounded-none">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto md:hidden rounded-full flex items-center justify-center mb-4">
              <SafeImage
                src="/logo.png"
                width={120}
                height={30}
                className="object-contain"
                alt="logo"
              />
            </div>

            <CardTitle className="text-2xl font-bold text-gray-800">
              {otpSent ? "Verify Your Phone" : "Login in your account"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {otpSent
                ? "Enter the 6-digit code sent to your phone"
                : "Sign in to your account to continue"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Status Messages */}
            {error && (
              <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl animate-in slide-in-from-top duration-300">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl animate-in slide-in-from-top duration-300">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}

            {!otpSent ? (
              /* Phone Number Form */
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-12 h-10  rounded-xl  transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-2  pt-3">
                  <input
                    type="checkbox"
                    id="agree"
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <label htmlFor="agree" className="text-xs text-gray-600 leading-relaxed font-bold">
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:text-primary-600 underline font-medium">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy_policy" className="text-primary hover:text-primary-600 underline font-medium">
                      Privacy Policy
                    </Link>
                    . You must be 18+.
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 bg-primary hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </form>
            ) : (
              /* OTP Verification Form */
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <Label className="text-sm font-semibold text-gray-700">
                      Verification Code
                    </Label>
                  </div>

                  {/* OTP Input Fields */}
                  <div className="flex justify-center gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        className="w-12 h-14 text-center border-2 border-gray-200 rounded-xl text-xl font-bold focus:outline-none focus:border-primary transition-all duration-200 bg-white"
                        value={otp[index] || ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "")
                          const newOtp = otp.split("")

                          if (val) {
                            newOtp[index] = val
                            setOtp(newOtp.join(""))

                            const next = e.target.nextElementSibling as HTMLInputElement
                            if (next && index < 5) {
                              next.focus()
                            }
                          } else {
                            newOtp[index] = ""
                            setOtp(newOtp.join(""))
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            const newOtp = otp.split("")

                            if (otp[index]) {
                              newOtp[index] = ""
                              setOtp(newOtp.join(""))
                            } else if (index > 0) {
                              const prev = e.currentTarget.previousElementSibling as HTMLInputElement
                              if (prev) {
                                newOtp[index - 1] = ""
                                setOtp(newOtp.join(""))
                                prev.focus()
                              }
                            }
                          }
                        }}
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Code sent to{" "}
                      <span className="font-semibold text-gray-800">{phone}</span>
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>

                {/* OTP Actions */}
                <div className="flex flex-col items-center space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false)
                      setOtp("")
                      setError("")
                      setSuccess("")
                    }}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span>Change phone number</span>
                  </button>

                  {!canResendOtp ? (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span>Resend code in {formatTimer(timer)}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-sm text-primary hover:text-primary-600 font-semibold transition-colors duration-200 hover:underline"
                    >
                      Resend Verification Code
                    </button>
                  )}
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:text-primary-600 font-semibold transition-colors duration-200 hover:underline"
              >
                Create one now
              </Link>
            </p>
          </CardFooter>
        </Card>



      </div>
    </div>
  )

}