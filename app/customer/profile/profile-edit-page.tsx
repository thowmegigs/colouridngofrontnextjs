"use client"

import { Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { showToast } from "@/app/components/show-toast"
import { useAuth } from "@/app/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { api_url } from "@/contant"
import { sendOTP } from "@/lib/api"; // adjust paths
import axios from "axios"

export default function ProfileEditPage() {
  /* ------------------------------------------------------------------ */
  /* State & helpers                                                     */
  /* ------------------------------------------------------------------ */
  const router = useRouter()
  const { user, updateProfile, verifyUpdateOtp } = useAuth()

  // Step management: "form" ➜ "otp" ➜ "done"
  const [step, setStep] = useState<"form" | "otp" | "done">("form")

  // Form values
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  })
  const old_phone = user?.phone
  const old_email = user?.email
  const old_name = user?.name
  // UI state
  const [isSendingOtp, setSendingOtp] = useState(false)
  const [isVerifying, setVerifying] = useState(false)
  const [otp, setOtp] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(v => ({ ...v, [e.target.name]: e.target.value }))

  /* ------------------------------------------------------------------ */
  /* 1️⃣  Save profile & request OTP                                     */
  /* ------------------------------------------------------------------ */
  const handleSaveAndRequestOtp = async () => {
    setSendingOtp(true)
    try {
      if (old_email !== formData.email) {
        const reps = await axios.post(`${api_url}/auth/emailExist`, { email: formData.email });
        const d = reps.data
        const emailExist = d.data.exist
        if (emailExist) {
          showToast({
            title: "Error",
            description: "Email already registered,use other email ",
            variant: 'destructive'
          }
          )
          return
        }
      }

      if (old_phone !== formData.phone) {
        const re = await sendOTP("phone", formData.phone, "register")
        if (re.success) {
          setStep("otp")
          showToast({ title: "OTP Sent", description: "Enter the code we sent to your phone." })
        }
        else {
          showToast({ title: "Error", description: re.message ?? "Failed to send OTP", variant: "destructive" })

        }
      }
       if (old_name !== formData.name) {
              try {
              const verifyRes = await verifyUpdateOtp(null, formData.name, formData.email, formData.phone)
              if (!verifyRes.success) throw new Error(verifyRes.message)


              showToast({ title: "Profile Updated", description: "Your details were saved." })
              setStep("done")
              // router.push("/account") // or wherever
            } catch (err: any) {
              showToast({ title: "Error", description: err.message, variant: "destructive" })
            } finally {
              setVerifying(false)
            }
       }
    } catch (err: any) {
      showToast({ title: "Error", description: err.message ?? "Failed to send OTP", variant: "destructive" })
    } finally {
      setSendingOtp(false)
    }
  }

  /* ------------------------------------------------------------------ */
  /* 2️⃣  Verify OTP & update profile                                    */
  /* ------------------------------------------------------------------ */
  const handleVerifyOtpAndSave = async () => {
    if (!otp) return

    setVerifying(true)
    try {
      const verifyRes = await verifyUpdateOtp(otp, formData.name, formData.email, formData.phone)
      if (!verifyRes.success) throw new Error(verifyRes.message)


      showToast({ title: "Profile Updated", description: "Your details were saved." })
      setStep("done")
      // router.push("/account") // or wherever
    } catch (err: any) {
      showToast({ title: "Error", description: err.message ?? "Failed to verify OTP", variant: "destructive" })
    } finally {
      setVerifying(false)
    }
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full"
            disabled={isSendingOtp}
          >
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Verify Phone</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to <strong>{formData.phone}</strong>.
              </p>
              <Input
                placeholder="OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
              />
            </CardContent>
          </Card>

          <Button
            className="w-full"
            onClick={handleVerifyOtpAndSave}
            disabled={isVerifying || otp.length < 4}
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Verifying…
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Verify & Save
              </>
            )}
          </Button>
        </div>
      )}

      {step === "done" && (
        <div className="text-center py-12">
          <Check className="h-12 w-12 mx-auto text-green-600 mb-4" />
          <h2 className="text-xl font-semibold">Profile updated</h2>
          <p className="text-muted-foreground">Redirecting…</p>
        </div>
      )}
    </div>
  )
}
