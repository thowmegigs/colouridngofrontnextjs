"use client"

import { Banknote, Check, Loader2, QrCode } from "lucide-react"
import { useEffect, useState } from "react"

import { showToast } from "@/app/components/show-toast"
import { useAuth } from "@/app/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { image_base_url } from "@/contant"
import { apiRequest } from "@/lib/api"
import axios from "axios"
import clsx from "clsx"

export default function AddPaymentMethod() {
  const { user } = useAuth()
  const [mode, setMode] = useState<"upi" | "bank">("upi")

  // UPI
  const [upiId, setUpiId] = useState("")
  const [upiError, setUpiError] = useState<string | null>(null)
  const [qrImage, setQrImage] = useState<File | null>(null)
  const [originalQrImage, setOriginalQrImage] = useState<string | null>(null)

  // Bank
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountHolder, setAccountHolder] = useState("")
  const [ifscCode, setIfscCode] = useState("")

  const [isSubmitting, setSubmitting] = useState(false)

  const upiRegex = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/

  useEffect(() => {
    const fetchUserPayment = async () => {
      try {
        const res = await apiRequest("customer_payment_method", { method: "GET" })
        const d = res.data.data
       if(d){
        if (d.upi_id) {
          setMode("upi")
          setUpiId(d.upi_id)
          setOriginalQrImage(d.qr_image)
        } else if (d.account_number) {
          setMode("bank")
          setAccountName(d.bank_name)
          setAccountNumber(d.account_number)
          setAccountHolder(d.account_holder)
          setIfscCode(d.bank_ifsc)
        }
      }
      } catch (err) {
        console.error("Failed to fetch payment method:", err)
      }
    }
    fetchUserPayment()
  }, [])

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setQrImage(file)
    } else {
      showToast({
        title: "Invalid file",
        description: "Please upload a valid image",
        variant: "destructive",
      })
    }
  }

  const validateUpi = () => {
    if (!upiRegex.test(upiId)) {
      setUpiError("Invalid UPI ID format")
      return false
    }
    setUpiError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSubmitting(true)

    const formData = new FormData()
    formData.append("user_id", user.id.toString())
    formData.append("payment_mode", mode)

    if (mode === "upi") {
      if (!validateUpi()) {
        setSubmitting(false)
        return
      }
      formData.append("upi_id", upiId)
      if (qrImage) {
        formData.append("qr_image", qrImage)
      }
    } else {
      if (!accountName || !accountNumber || !ifscCode) {
        showToast({
          title: "Missing Fields",
          description: "Please fill in all bank details",
          variant: "destructive",
        })
        setSubmitting(false)
        return
      }
      formData.append("bank_name", accountName)
      formData.append("account_number", accountNumber)
      formData.append("account_holder", accountHolder)
      formData.append("ifsc", ifscCode)
    }

    axios.post(`${process.env.NEXT_PUBLIC_LARAVEL_ADMIN_URL}/addUpdateCustomerPayment`, formData)
      .then(() => {
        showToast({
          title: "Payment Method Saved",
          description: "Your payment details have been saved successfully.",
        })
      })
      .catch(error => {
        showToast({
          title: "Error",
          description: error.message ?? "Failed to save payment details",
          variant: "destructive",
        })
      })
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium flex items-center gap-2">
            {mode === "upi" ? <QrCode className="h-5 w-5" /> : <Banknote className="h-5 w-5" />}
            Add/Update Payment Mode
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Button
              type="button"
              variant={mode === "upi" ? "default" : "outline"}
              className={clsx("w-full", mode === "upi" && "bg-primary text-white")}
              onClick={() => setMode("upi")}
            >
              UPI
            </Button>
            <Button
              type="button"
              variant={mode === "bank" ? "default" : "outline"}
              className={clsx("w-full", mode === "bank" && "bg-primary text-white")}
              onClick={() => setMode("bank")}
            >
              Bank
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "upi" ? (
              <>
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    onBlur={validateUpi}
                    placeholder="example@upi"
                    required
                  />
                  {upiError && <p className="text-red-500 text-sm mt-1">{upiError}</p>}
                </div>

                <div>
                  <Label htmlFor="qr">QR Code (optional)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleQrUpload}
                  />
                  {(qrImage || originalQrImage) && (
                    <div className="mt-2">
                      <img
                        src={qrImage ? URL.createObjectURL(qrImage) : `${image_base_url}/storage/qr_images/${originalQrImage}`}
                        alt="QR Preview"
                        className="w-32 h-32 rounded border object-cover"
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="accountName">Account Holder Name</Label>
                  <Input
                    id="accountHOlderName"
                    value={accountHolder}
                    onChange={e => setAccountHolder(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="accountName">Bank  Name</Label>
                  <Input
                    id="accountBankName"
                    value={accountName}
                    onChange={e => setAccountName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="ifsc">IFSC Code</Label>
                  <Input
                    id="ifsc"
                    value={ifscCode}
                    onChange={e => setIfscCode(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving…
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Payment Details
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
