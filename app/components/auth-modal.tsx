"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { registerUser, sendOTP, verifyOTP } from "@/lib/api"; // Fixed import path
import { Loader2, X } from "lucide-react"
import { useEffect, useState } from "react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  couponCode?: string
}

export function AuthModal({ isOpen, onClose, onSuccess, couponCode }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [regPhoneNumber, setRegPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await sendOTP(phoneNumber)
      if (response.success) {
        setOtpSent(true)
        setCountdown(30) // 30 seconds countdown for resend
        toast({
          title: "OTP Sent",
          description: "A verification code has been sent to your phone",
        })
      } else {
        toast({
          title: "Failed to send OTP",
          description: response.message || "Please try again later",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await verifyOTP(phoneNumber, otp)
      if (response.success) {
        toast({
          title: "Login Successful",
          description: "You have been logged in successfully",
        })
        onSuccess()
        onClose()
      } else {
        toast({
          title: "Invalid OTP",
          description: response.message || "Please check and try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!name || !email || !regPhoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (regPhoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await registerUser(name, email, regPhoneNumber)
      if (response.success) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully",
        })
        // Switch to login tab with phone number pre-filled
        setPhoneNumber(regPhoneNumber)
        setActiveTab("login")
      } else {
        toast({
          title: "Registration Failed",
          description: response.message || "Please try again later",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {couponCode ? "Login to Apply Coupon" : "Login or Register"}
          </DialogTitle>
          {couponCode && (
            <p className="text-center text-sm text-muted-foreground">
              You need to login to apply coupon code <span className="font-semibold">{couponCode}</span>
            </p>
          )}
        </DialogHeader>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "register")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 py-4">
            {!otpSent ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    type="tel"
                  />
                </div>
                <Button className="w-full" onClick={handleSendOTP} disabled={loading || phoneNumber.length < 10}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    OTP sent to {phoneNumber}.
                    {countdown > 0 ? (
                      <span> Resend in {countdown}s</span>
                    ) : (
                      <button className="ml-1 text-primary hover:underline" onClick={handleSendOTP} disabled={loading}>
                        Resend OTP
                      </button>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setOtpSent(false)} disabled={loading}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={handleVerifyOTP} disabled={loading || otp.length !== 6}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Login"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="register" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regPhone">Phone Number</Label>
                <Input
                  id="regPhone"
                  placeholder="Enter your phone number"
                  type="tel"
                  value={regPhoneNumber}
                  onChange={(e) => setRegPhoneNumber(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleRegister}
                disabled={loading || !name || !email || regPhoneNumber.length < 10}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
