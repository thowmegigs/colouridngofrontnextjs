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


  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [step, setStep] = useState<"form" | "otp">("form")
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(60)

  const { register, verifyRegOtpAndLogin, isLoading } = useAuth()
  const router = useRouter()
  const errorRef = useRef<HTMLDivElement>(null)

  // Scroll to error/success message
  useEffect(() => {
    if ((error || success) && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [error, success])

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (step === "otp" && resendCooldown > 0) {
      interval = setInterval(() => setResendCooldown((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [step, resendCooldown])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !phone) return setError("Fill all required fields.")

    try {
        const response = await apiRequest(
              `auth/emailExist`,
              {
                method: "POST",
                requestData:{email}
      
      
              })
     
      const emailExist = response.data.exist
      if (emailExist) {
        setError("Email already registered,use other email ")
        return
      }

      await sendOTP("phone", phone, "register")
      setStep("otp")
      setSuccess("Otp has been sent to your phone number")
      setResendCooldown(60)
      setError("")
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP")
      return
    }
  }

  const handleOtpVerification = async () => {
    if (!phoneOtp) return setError("Enter phone OTP")
    setIsVerifying(true)
    try {
      const response = await verifyRegOtpAndLogin(phoneOtp, name, email, phone)

   
         showToast({title:"Success",description:"Your account created successfully"})
         setTimeout(()=>{
             router.replace('/')
         },1000)
      
     

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
    <Card className="w-full max-w-md mx-auto  bg-transparent border-0 shadow-none">
      <SafeImage src="/logo.png" width={180} height={70} className="md:hidden w-[160px] h-[55px] text-center mx-auto m-5" alt={"logo"} />

      <CardHeader>
        <CardTitle className="text-xl text-center">Registration</CardTitle>
        <CardDescription className="text-center">Create your account</CardDescription>
      </CardHeader>

      <CardContent>
        {(error || success) && (
          <div
            ref={errorRef}
            className={`mb-4 px-4 py-2 text-sm rounded border ${error ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}
          >
            {error || success}
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="font-semibold">Full Name*</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter full name" />
            </div>

            <div>
              <Label htmlFor="email" className="font-semibold">Email*</Label>
              <Input id="email" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="phone" className="font-semibold">Phone*</Label>
              <Input id="phone" type="tel" value={phone} placeholder="Enter phone" onChange={(e) => setPhone(e.target.value)} required />
            </div>

           
              <div className="text-xs text-muted-foreground px-1">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-primary underline">Terms & Conditions</Link>{" "}
                and <Link href="/privacy_policy" className="text-primary underline">Privacy Policy</Link>. You must be 18+.
              </div>
           

            <Button type="submit" className="w-full" >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
            </Button>
          </form>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            <div>
              <Label>Phone OTP</Label>
              <Input
                type="text"
                maxLength={6}
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
                placeholder="Enter phone OTP"
              />
            </div>

            <Button
              onClick={handleOtpVerification}
              className="w-full"
              disabled={isVerifying}
            >
              {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Register"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
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
        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">Login</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
