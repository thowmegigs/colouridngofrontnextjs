"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CheckCircle, Loader2, X, XCircle } from "lucide-react"

import { sendOTP } from "@/lib/api"
import { useAuth } from "../providers/auth-provider"
import SafeImage from "./SafeImage"
import { showToast as toast } from "./show-toast"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  couponCode?: string
  initialView: "login" | "register"
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  couponCode,
  initialView,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialView)

  /* ---------- login state ---------- */
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [termsAccepted, setTermsAccepted] = useState(false)

  /* ---------- register state ---------- */
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [regPhoneNumber, setRegPhoneNumber] = useState("")
  const [emailOtp, setEmailOtp] = useState("")
  const [phoneOtp, setPhoneOtp] = useState("")
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [phoneOtpSent, setPhoneOtpSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null)
  const [phoneVerified, setPhoneVerified] = useState<boolean | null>(null)
  const [emailCountdown, setEmailCountdown] = useState(0)
  const [phoneCountdown, setPhoneCountdown] = useState(0)
  const [regTermsAccepted, setRegTermsAccepted] = useState(false)

  /* ---------- misc ---------- */
  const [loading, setLoading] = useState(false)
  const { login, verifyOtp,  register } = useAuth()

  /* ---------- countdown effects ---------- */
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1_000)
      return () => clearTimeout(t)
    }
  }, [countdown])

  useEffect(() => {
    if (emailCountdown > 0) {
      const t = setTimeout(() => setEmailCountdown(emailCountdown - 1), 1_000)
      return () => clearTimeout(t)
    }
  }, [emailCountdown])

  useEffect(() => {
    if (phoneCountdown > 0) {
      const t = setTimeout(() => setPhoneCountdown(phoneCountdown - 1), 1_000)
      return () => clearTimeout(t)
    }
  }, [phoneCountdown])

  /* ---------- auth helpers ---------- */
  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      toast({ title: "Invalid phone number", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res: any = await login(phoneNumber)
      if (res.success) {
        setOtpSent(true)
        setCountdown(30)
        toast({ title: "OTP sent", description: "Check your phone" })
      } else {
        toast({ title: "Failed", description: res.message, variant: "destructive" })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({ title: "Invalid OTP", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await verifyOtp(phoneNumber, otp)
      if (res.success) {
        toast({ title: "Login successful" })
        onSuccess()
        onClose()
      } else {
        toast({ title: "Invalid OTP", description: res.message, variant: "destructive" })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSendRegOtp = async (type: "email" | "phone") => {
    const target = type === "email" ? email : regPhoneNumber
    if (!target) return
    setLoading(true)
    try {
      const res = await sendOTP(type, target, "register")
      if (res.success) {
        type === "email" ? setEmailOtpSent(true) : setPhoneOtpSent(true)
        type === "email" ? setEmailCountdown(30) : setPhoneCountdown(30)
        toast({ title: `OTP sent to your ${type}` })
      } else {
        toast({ title: "Failed", description: res.message, variant: "destructive" })
      }
    } catch (e: any) {
      toast({ title: "Failed", description: e.response?.data?.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyRegOtp = async (type: "email" | "phone") => {
    // const code = type === "email" ? emailOtp : phoneOtp
    // if (code.length !== 6) return
    // setLoading(true)
    // try {
    //   const res = await verifyRegOtp(code, type, type === "email" ? email : regPhoneNumber)
    //   if (res.success) {
    //     type === "email" ? setEmailVerified(true) : setPhoneVerified(true)
    //     toast({ title: `${type.toUpperCase()} verified` })
    //   } else {
    //     toast({ title: "Verification failed", description: res.message })
    //   }
    // } catch (e: any) {
    //   toast({ title: "Verification failed", description: e.response?.data?.message, variant: "destructive" })
    // } finally {
    //   setLoading(false)
    // }
  }

  const handleRegister = async () => {
    if (!name || !email || !regPhoneNumber) {
      toast({ title: "Missing fields", variant: "destructive" })
      return
    }
    if (!phoneVerified) {
      toast({ title: "Verify  phone first", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await register(name, email, regPhoneNumber)
      if (res.success) {
        toast({ title: "Registration successful" })
        setPhoneNumber(regPhoneNumber)
        setActiveTab("login")
      } else {
        toast({ title: "Registration failed", description: res.message, variant: "destructive" })
      }
    } finally {
      setLoading(false)
    }
  }

  /* ---------- RENDER ---------- */
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[98vh] overflow-y-auto sm:max-w-full pt-[130px]"
      >
        {/* close btn */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>

        {/* header */}
        <SheetHeader className="flex flex-col items-center gap-2">
          <SafeImage src="/logo.png" alt="logo" className="h-12 w-auto" width={400} height={200} />
          <SheetTitle className="text-xl font-bold text-center">
            {couponCode ? "Login to Apply Coupon" : "Login or Register"}
          </SheetTitle>
        </SheetHeader>

        {/* tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "login" | "register")}
          className="mt-4 w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* ---------- LOGIN TAB ---------- */}
          <TabsContent value="login" className="space-y-4 py-4">
            {!otpSent ? (
              <>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Enter registered phone no."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />

                {/* terms */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="login-terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label
                    htmlFor="login-terms"
                    className="text-sm select-none leading-none"
                  >
                     By Continuing, I agree to the{" "}
                    <a href="/terms" className="text-primary underline">
                      Terms &amp; Conditions
                    </a> & <a href="/privacy_policy" className="text-primary underline">
                     Privacy Policy
                    </a> and I am above 18 yrs old.
                  </label>
                </div>

                <Button
                  onClick={handleSendOTP}
                  disabled={
                    loading || phoneNumber.length < 10 || !termsAccepted
                  }
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </>
            ) : (
              <>
                <Label>OTP</Label>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
                <p className="text-xs">
                  OTP sent to {phoneNumber}.{" "}
                  {countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    <button
                      onClick={handleSendOTP}
                      className="text-blue-500 underline"
                    >
                      Resend
                    </button>
                  )}
                </p>

                {/* terms again (allow toggle) */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="login-terms2"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label
                    htmlFor="login-terms2"
                    className="text-sm select-none leading-none"
                  >
                   By Continuing, I agree to the{" "}
                    <a href="/terms" className="text-primary underline">
                      Terms &amp; Conditions
                    </a> & <a href="/privacy_policy" className="text-primary underline">
                      Privacy Policy
                    </a> and I am above 18 yrs old.
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setOtpSent(false)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6 || !termsAccepted}
                    className="flex-1"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Verify & Login"
                    )}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          {/* ---------- REGISTER TAB ---------- */}
          <TabsContent value="register" className="space-y-4 py-4">
            <Label>Full Name</Label>
            <Input
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* email block */}
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Input
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-28"
                />
                {/* <Button
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 bg-gray-200 text-[12px] text-black hover:bg-gray-300"
                  onClick={() => handleSendRegOtp("email")}
                  disabled={emailCountdown > 0}
                >
                  {emailCountdown > 0
                    ? `Resend in ${emailCountdown}s`
                    : "Send OTP"}
                </Button> 
                {emailVerified !== null && (
                  <span className="absolute right-32 top-1/2 -translate-y-1/2">
                    {emailVerified ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )}
                  </span>
                )}
                  */}
              </div>

              {/* <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter OTP"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  className="px-2 py-1"
                  onClick={() => handleVerifyRegOtp("email")}
                  disabled={emailOtp.length !== 6}
                >
                  Verify
                </Button>
              </div> */}
            </div>

            {/* phone block */}
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="relative">
                <Input
                  placeholder="Enter phone no."
                  value={regPhoneNumber}
                  onChange={(e) => setRegPhoneNumber(e.target.value)}
                  className="pr-28"
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 bg-gray-200 text-[12px] text-black hover:bg-gray-300"
                  onClick={() => handleSendRegOtp("phone")}
                  disabled={phoneCountdown > 0}
                >
                  {phoneCountdown > 0
                    ? `Resend in ${phoneCountdown}s`
                    : "Send OTP"}
                </Button>
                {phoneVerified !== null && (
                  <span className="absolute right-32 top-1/2 -translate-y-1/2">
                    {phoneVerified ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter OTP"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  className="px-2 py-1"
                  onClick={() => handleVerifyRegOtp("phone")}
                  disabled={phoneOtp.length !== 6}
                >
                  Verify
                </Button>
              </div>
            </div>

            {/* terms */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="register-terms"
                checked={regTermsAccepted}
                onChange={(e) => setRegTermsAccepted(e.target.checked)}
                className="h-4 w-4"
              />
              <label
                htmlFor="register-terms"
                className="text-sm select-none leading-none"
              >
                By Continuing, I agree to the{" "}
                    <a href="/terms" className="text-primary underline">
                      Terms &amp; Conditions
                    </a> & <a href="/privacy_policy" className="text-primary underline">
                     Privacy Policy
                    </a> and I am above 18 yrs old.
              </label>
            </div>

            <Button
              onClick={handleRegister}
              disabled={
                loading ||
               
                !phoneVerified ||
                !regTermsAccepted
              }
              className="w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Register"
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
