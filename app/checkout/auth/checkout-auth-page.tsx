"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CheckoutAuthPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (isLoggedIn) {
      router.push("/checkout")
    }
  }, [router])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    // Simulate OTP sending
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsOtpSent(true)

    toast({
      title: "OTP Sent",
      description: `A verification code has been sent to ${phoneNumber}`,
    })
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length < 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid OTP",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo purposes, any OTP is valid
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userPhone", phoneNumber)

    if (activeTab === "register" && name) {
      localStorage.setItem("userName", name)
      localStorage.setItem("userEmail", email)
    }

    setIsLoading(false)

    toast({
      title: "Success!",
      description: "You have successfully signed in",
    })

    // Redirect to checkout
    router.push("/checkout")
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    // Simulate OTP sending for registration
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsOtpSent(true)

    toast({
      title: "OTP Sent",
      description: `A verification code has been sent to ${phoneNumber}`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container max-w-md mx-auto py-8 px-4 flex-1 flex flex-col">
        <div className="mb-6">
          <Link href="/cart" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to cart
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 flex-1 flex flex-col">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p className="text-muted-foreground mt-1">Sign in or create an account to continue</p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as "login" | "register")
              setIsOtpSent(false)
              setOtp("")
            }}
            className="flex-1 flex flex-col"
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="flex-1 flex flex-col">
              {!isOtpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4 flex-1 flex flex-col">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      "Continue with OTP"
                    )}
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-2 text-xs text-muted-foreground">OR</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" type="button">
                    Continue with Google
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 flex-1 flex flex-col">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter OTP sent to your phone"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                    <p className="text-sm text-muted-foreground">
                      OTP sent to {phoneNumber}.
                      <button
                        type="button"
                        className="text-primary hover:underline ml-1"
                        onClick={() => setIsOtpSent(false)}
                      >
                        Change
                      </button>
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Continue"
                    )}
                  </Button>

                  <p className="text-sm text-center text-muted-foreground mt-4">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                    >
                      Resend OTP
                    </button>
                  </p>
                </form>
              )}
            </TabsContent>

            <TabsContent value="register" className="flex-1 flex flex-col">
              {!isOtpSent ? (
                <form onSubmit={handleRegister} className="space-y-4 flex-1 flex flex-col">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name</Label>
                    <Input
                      id="reg-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">Phone Number</Label>
                    <Input
                      id="reg-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email Address (Optional)</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 flex-1 flex flex-col">
                  <div className="space-y-2">
                    <Label htmlFor="reg-otp">Verification Code</Label>
                    <Input
                      id="reg-otp"
                      type="text"
                      placeholder="Enter OTP sent to your phone"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                    <p className="text-sm text-muted-foreground">
                      OTP sent to {phoneNumber}.
                      <button
                        type="button"
                        className="text-primary hover:underline ml-1"
                        onClick={() => setIsOtpSent(false)}
                      >
                        Change
                      </button>
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Continue"
                    )}
                  </Button>

                  <p className="text-sm text-center text-muted-foreground mt-4">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={handleRegister}
                      disabled={isLoading}
                    >
                      Resend OTP
                    </button>
                  </p>
                </form>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <ShoppingBag className="h-4 w-4" />
          <span>Secure Checkout</span>
        </div>
      </div>
    </div>
  )
}
