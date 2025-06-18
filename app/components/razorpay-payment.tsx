"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

// Define the props for the RazorpayPayment component
interface RazorpayPaymentProps {
  orderId: string
  razorpayOrderId: string
  amount: number
  currency?: string
  name: string
  description?: string
  
  customerEmail?: string
  customerPhone?: string
  onSuccess: (resp:any) => void
  onFailure: (error: any) => void
}

// Define the Razorpay options type
interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: any) => void
  prefill: {
    name: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
  theme?: {
    color: string
  }
  modal?: {
    ondismiss: () => void
  }
}

// Declare the Razorpay global type
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function RazorpayPayment({
  orderId,
  razorpayOrderId,
  amount,
  currency = "INR",
  name,
  description = "Order Payment",
  customerEmail,
  customerPhone,
  onSuccess,
  onFailure,
}: RazorpayPaymentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
  const { toast } = useToast()

  // Load the Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      script.onload = () => {
        setIsScriptLoaded(true)
        setIsLoading(false)
      }
      script.onerror = () => {
        setIsLoading(false)
        toast({
          title: "Payment Gateway Error",
          description: "Failed to load payment gateway. Please try again later.",
          variant: "destructive",
        })
      }
      document.body.appendChild(script)
    }

    loadRazorpayScript()

    return () => {
      // Cleanup if needed
    }
  }, [toast])

  const handlePayment = () => {
    if (!isScriptLoaded) {
      toast({
        title: "Payment Gateway Error",
        description: "Payment gateway is not loaded yet. Please try again.",
        variant: "destructive",
      })
      return
    }

    setIsPaymentProcessing(true)

    try {
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // Razorpay expects amount in smallest currency unit (paise for INR)
        currency,
        name,
        description,
        order_id: razorpayOrderId,
        handler: (response) => {
          setIsPaymentProcessing(false)
          console.log('iside raozpr',response)
          onSuccess({amount,orderId,razorpay_payment_id:response.razorpay_payment_id, razorpay_order_id:response.razorpay_order_id, razorpay_signature:response.razorpay_signature})
        },
        prefill: {
          name: "sgas",
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: () => {
            setIsPaymentProcessing(false)
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process.",
              variant: "destructive",
            })
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      setIsPaymentProcessing(false)
      onFailure(error)
      toast({
        title: "Payment Error",
        description: "There was an error initiating the payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading payment gateway...</p>
      </div>
    )
  }

  return (
    <Button onClick={handlePayment} disabled={isPaymentProcessing || !isScriptLoaded} className="w-full" size="lg">
      {isPaymentProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing Payment...
        </>
      ) : (
        `Pay ₹${(amount/100).toFixed(2)}`
      )}
    </Button>
  )
}
