"use client"

import { formatCurrency } from "@/app/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import type { Coupon } from "@/lib/api"
import { Check, Copy, Tag, Timer } from "lucide-react"
import { useState } from "react"

interface AvailableCouponsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coupons: Coupon[]
  productPrice: number
  
}

export function AvailableCouponsModal({ open, onOpenChange, coupons, productPrice }: AvailableCouponsModalProps) {
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null)

  // Filter coupons that are applicable to the current product price
 // const applicableCoupons = coupons.filter((coupon) => productPrice*product_selected_quantity >= coupon.cart_amount)

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCoupon(code)

    toast({
      title: "Coupon copied",
      description: "Apply this coupon during checkout to get your discount",
    })

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedCoupon(null)
    }, 2000)
  }

  // Format expiry date
  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (coupons.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Available Coupons</DialogTitle>
            <DialogDescription>No coupons available for this product at the moment.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Available Coupons</DialogTitle>
          <DialogDescription>Copy a coupon code and apply it during checkout to get your discount.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {coupons.map((coupon:any) => (
            <div key={coupon.code} className="border rounded-lg overflow-hidden bg-white">
              <div className="flex flex-col sm:flex-row">
                {/* Coupon code section */}
                <div className="bg-primary/10 p-4 flex flex-col items-center justify-center sm:w-1/3">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Coupon Code</div>
                  <div className="text-lg font-bold text-primary">{coupon.code}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleCopyCoupon(coupon.code)}
                  >
                    {copiedCoupon === coupon.code ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                {/* Coupon details section */}
                <div className="p-4 sm:w-2/3">
                  <h4 className="font-medium">{coupon.description}</h4>

                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Tag className="h-4 w-4 mr-1" />
                      {coupon.discount_type === "Percent" ? (
                        <span>{coupon.discount}% off</span>
                      ) : (
                        <span>{formatCurrency(coupon.discount)} off</span>
                      )}
                      {coupon.max_discount_amount && (
                        <span className="ml-1">(Max: {formatCurrency(coupon.max_discount)})</span>
                      )}
                    </div>

                    <div className="flex items-center text-muted-foreground">
                      <Timer className="h-4 w-4 mr-1" />
                      <span>Expires: {formatExpiryDate(coupon.end_date)}</span>
                    </div>

                    <div className="text-muted-foreground">Min. order: {formatCurrency(coupon.cart_amount)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
