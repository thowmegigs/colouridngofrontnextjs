"use client"

import { Check, CheckCircle2Icon, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { useAuth } from "@/app/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Alert } from "@/app/components/myCustomAlert"
import { sendOTP } from "@/lib/api"

export default function ProfileEditPage() {
  const router = useRouter()
  const { user, updateProfile, verifyUpdateOtp } = useAuth()

  const [step, setStep] = useState<"form" | "otp" | "done">("form")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
  })
  const old_phone = user?.phone
  const old_email = user?.email
  const old_name = user?.name

  const [isSendingOtp, setSendingOtp] = useState(false)
  const [isVerifying, setVerifying] = useState(false)
  const [otp, setOtp] = useState("")

  const [isEditingPhone, setEditingPhone] = useState(false)
  const [timer, setTimer] = useState(30) // 30 sec timer
  const [canResendOtp, setCanResendOtp] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(v => ({ ...v, [e.target.name]: e.target.value }))

  // Timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (step === "otp" && !canResendOtp) {
      interval = setInterval(() => {
        setTimer(prev => {
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
  }, [step, canResendOtp])

  // Send OTP if phone changed
  const handleSaveAndRequestOtp = async () => {
    const isPhoneChanged = old_phone !== formData.phone && isEditingPhone
    const isEmailChanged = old_email !== formData.email
    const isNameChanged = old_name !== formData.name

    if (!isPhoneChanged && !isEmailChanged && !isNameChanged) return

    setSendingOtp(true)
    try {
      if (isPhoneChanged) {
        const re = await sendOTP("phone", formData.phone, "register")
        if (re.success) {
          setStep("otp")
          setTimer(30)
          setCanResendOtp(false)
          setSuccessMessage(`We sent a verification code to <strong>${formData.phone}</strong>`)
           setErrorMessage('')
        } else {
           setSuccessMessage('')
           
          setErrorMessage(re.message ?? "Failed to send OTP")
        }
      } else {
        await updateProfile(formData.name, formData.email, formData.phone)
        setSuccessMessage("Profile Updated successfully")
       
            setErrorMessage('')
      }
    } catch (err: any) {
        setSuccessMessage('')
        
      setErrorMessage(err.message ?? "Failed to send OTP")
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtpAndSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (otp.length < 6) return
    setVerifying(true)
    try {
      const verifyRes = await verifyUpdateOtp(otp, formData.name, formData.email, formData.phone)
      if (!verifyRes.success) throw new Error(verifyRes.message)
      setSuccessMessage("Profile Updated successfully")
     
            setErrorMessage('')
      formData.phone = ""
      setStep("form")
    } catch (err: any) {
      setStep("otp")
        setSuccessMessage('')
    
      setErrorMessage(err.message ?? "Failed to verify OTP")
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      {step === "form" && (
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSaveAndRequestOtp()
          }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Profile Info</h3>
              {successMessage.length > 0 && (
                <Alert
                  variant="success"
                  message={successMessage}
                  autoClose={false}
                  onClose={() => setSuccessMessage("")}
                />
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div
                className={`rounded-md transition-all ${
                  isEditingPhone ? "" : "p-3 border border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label>Phone</Label>
                    {isEditingPhone ? (
                      <Input name="phone" value={formData.phone} onChange={handleChange} required className="w-full" />
                    ) : (
                      <div className="flex items-start gap-2">
                        <span>{formData.phone}</span>
                        <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                  </div>
                  {!isEditingPhone && (
                    <button
                      type="button"
                      className="text-sm text-primary-600 hover:underline"
                      onClick={() => setEditingPhone(true)}
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          {errorMessage.length > 0 && (
            <Alert
              variant="error"
              message={errorMessage}
              autoClose={false}
              onClose={() => setErrorMessage("")}
            />
          )}

          <Button type="submit" className="w-full" disabled={isSendingOtp}>
            {isSendingOtp ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending OTP…
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Save & Continue
              </>
            )}
          </Button>
        </form>
      )}

      {step === "otp" && (
        <form
          onSubmit={handleVerifyOtpAndSave}
          className="space-y-6 max-w-md mx-auto p-4 shadow-md rounded-lg"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">OTP Verification</h1>
            {successMessage.length > 0 && successMessage.includes("sent ") && (
              <Alert
                variant="success"
                message={successMessage}
                autoClose={false}
                onClose={() => setSuccessMessage("")}
              />
            )}
            {errorMessage.length > 0 && (
              <Alert
                variant="error"
                message={errorMessage}
                autoClose={false}
                onClose={() => setErrorMessage("")}
              />
            )}

            <Label className="font-medium text-gray-700">Enter 6-digit code</Label>

            {/* 6-Box OTP Input */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="w-10 h-12 text-center border border-gray-300 rounded text-lg focus:outline-none focus:border-blue-500"
                  value={otp[index] || ""}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, "")
                    if (!val) return
                    const newOtp = otp.split("")
                    newOtp[index] = val
                    setOtp(newOtp.join(""))
                    const next = e.target.nextElementSibling as HTMLInputElement
                    if (next) next.focus()
                  }}
                  onKeyDown={e => {
                    if (e.key === "Backspace" && !otp[index] && index > 0) {
                      const prev = e.currentTarget.previousElementSibling as HTMLInputElement
                      if (prev) prev.focus()
                    }
                  }}
                />
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-2">
              {timer > 0 ? (
                <>Did not receive OTP? Resend in {timer} second{timer !== 1 ? "s" : ""}</>
              ) : (
                <>
                  Did not receive OTP?{" "}
                  <span
                    onClick={handleSaveAndRequestOtp}
                    className="text-blue-500 cursor-pointer hover:underline"
                  >
                    Resend OTP
                  </span>
                </>
              )}
            </p>
          </div>

          <Button
            type="submit"
            className="block min-w-[300px] mx-auto py-3 text-sm font-medium flex items-center justify-center"
            disabled={isVerifying || otp.length < 6}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Save"
            )}
          </Button>

          <div className="flex flex-col items-center mt-0 pt-0">
            <button
              type="button"
              onClick={() => setStep("form")}
              className="text-sm text-gray-600 hover:text-primary-600 hover:underline"
            >
              Change phone number
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
