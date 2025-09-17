"use client"

import SafeImage from "@/app/components/SafeImage"
import { showToast } from "@/app/components/show-toast"
import { useAuth } from "@/app/providers/auth-provider"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiRequest, sendOTP } from "@/lib/api"
import { Loader2, RotateCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [phoneOtp, setPhoneOtp] = useState("")
  const [agree, setAgree] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [step, setStep] = useState<"form" | "otp">("form")
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(60)

  const { register, verifyRegOtpAndLogin, isLoading } = useAuth()
  const router = useRouter()
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if ((error || success) && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [error, success])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (step === "otp" && resendCooldown > 0) {
      interval = setInterval(() => setResendCooldown((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [step, resendCooldown])

  const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string) => {
  if (!phone) return false
  if (phone.includes("+")) return false // ❌ reject +91 or + prefix
  const digitsOnly = phone.replace(/[^0-9]/g, "")
  return /^\d{10}$/.test(digitsOnly)
}

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !phone) return setError("Fill all required fields.")
    if (!agree) return setError("You must agree to the terms before continuing.")
       // ✅ Email validation
  if (!validateEmail(email)) {
    return setError("Invalid email address.")
  }

  // ✅ Phone validation
  if (!validatePhone(phone)) {
    return setError("Phone number must be exactly 10 digits and without country code ")
  }

    try {
      const response = await apiRequest(`auth/emailExist`, {
        method: "POST",
        requestData: { email }
      })

      const emailExist = response.data.exist
      if (emailExist) {
        setError("Email already registered, use another email.")
        return
      }

      await sendOTP("phone", phone, "register")
      setStep("otp")
      setSuccess("OTP has been sent to your phone number")
      setResendCooldown(60)
      setError("")
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP")
    }
  }

  const handleOtpVerification = async () => {
    if (!phoneOtp) return setError("Enter phone OTP")
    setIsVerifying(true)
    try {
      await verifyRegOtpAndLogin(phoneOtp, name, email, phone)
      showToast({ title: "Success", description: "Your account was created successfully" })
      setTimeout(() => router.replace('/'), 1000)
    } catch (err: any) {
      setError(err?.message || "Verification failed.")
    }
    setIsVerifying(false)
  }

  const handleResendOtp = async () => {
    try {
      await sendOTP("phone", phone, "register")
      setSuccess("OTP resent successfully!")
      setResendCooldown(60)
    } catch (err: any) {
      setError(err?.message || "Failed to resend OTP.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent p-4">
      <div className="w-full max-w-md">
        <Card className="bg-transparent shadow-none border-none rounded-none">
          <SafeImage
            src="/logo.png"
            width={180}
            height={70}
            className="md:hidden w-[160px] h-[55px] text-center mx-auto mb-5"
            alt="logo"
          />

          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Registration</CardTitle>
            <CardDescription className="text-gray-600">Create your account</CardDescription>
          </CardHeader>

          <CardContent>
            {(error || success) && (
              <div
                ref={errorRef}
                className={`mb-4 px-4 py-2 text-sm rounded border ${
                  error
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-green-50 border-green-200 text-green-700"
                }`}
              >
                {error || success}
              </div>
            )}

            {step === "form" && (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="font-semibold">Full Name*</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="font-semibold">Email*</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="font-semibold">Phone*</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    placeholder="Enter phone"
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-start space-x-2 bg-gray-50 p-3 rounded-xl">
                  <input
                    type="checkbox"
                    id="agree"
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    required
                  />
                  <label htmlFor="agree" className="text-xs text-gray-600 leading-relaxed font-bold">
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="text-primary underline">Terms & Conditions</Link>{" "}
                    and{" "}
                    <Link href="/privacy_policy" className="text-primary underline">Privacy Policy</Link>
                    . You must be 18+.
                  </label>
                </div>

                <Button type="submit" className="w-full h-11 text-white rounded-xl font-semibold hover:-translate-y-0.5 transition-all duration-200">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
                </Button>
              </form>
            )}

            {step === "otp" && (
              <div className="space-y-5">
                <div>
                  <Label>Phone OTP</Label>
                  <Input
                    type="text"
                    maxLength={6}
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                  />
                </div>

                <Button
                  onClick={handleOtpVerification}
                  className="w-full h-11 text-white rounded-xl font-semibold hover:-translate-y-0.5 transition-all duration-200"
                  disabled={isVerifying}
                >
                  {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Register"}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  {resendCooldown > 0 ? (
                    <>Resend OTP in <span className="font-medium text-gray-800">{resendCooldown}s</span></>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="inline-flex items-center text-blue-600 hover:underline"
                    >
                      <RotateCw className="w-4 h-4 mr-1" /> Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">Login</Link>
            </p>
          </CardFooter>
        </Card>

        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Secured with end-to-end encryption
          </p>
        </div>
      </div>
    </div>
  )
}
