"use client"

import { formatCurrency } from "@/app/lib/utils"
import { Button } from "@/components/ui/button"
import type { Coupon } from "@/lib/api"
import { Check, Copy, Tag } from "lucide-react"
import { useState } from "react"

interface AvailableCouponsProps {
  coupons: Coupon[]
  productPrice: number
  onApplyCoupon: (code: string) => void
}

export function AvailableCoupons({ coupons, productPrice, onApplyCoupon }: AvailableCouponsProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Filter out coupons that don't meet minimum order amount
  const applicableCoupons = coupons.filter((coupon) => productPrice >= coupon.min_order_amount)

  if (applicableCoupons.length === 0) {
    return null
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3 flex items-center">
        <Tag className="h-5 w-5 mr-2 text-primary" />
        Available Coupons
      </h3>
      <div className="space-y-3">
        {applicableCoupons.map((coupon) => (
          <div key={coupon.code} className="border rounded-md p-3 bg-muted/20 hover:bg-muted/30 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-primary">{coupon.code}</div>
                <p className="text-sm text-muted-foreground mt-1">{coupon.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-8" onClick={() => copyToClipboard(coupon.code)}>
                  {copiedCode === coupon.code ? (
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copiedCode === coupon.code ? "Copied" : "Copy"}
                </Button>
                <Button size="sm" className="h-8" onClick={() => onApplyCoupon(coupon.code)}>
                  Apply
                </Button>
              </div>
            </div>
            <div className="mt-2 text-xs flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
              {coupon.discount_type === "percentage" ? (
                <span>{coupon.discount_value}% off</span>
              ) : (
                <span>{formatCurrency(coupon.discount_value)} off</span>
              )}
              <span>Min. order: {formatCurrency(coupon.min_order_amount)}</span>
              {coupon.max_discount_amount && <span>Max discount: {formatCurrency(coupon.max_discount_amount)}</span>}
              <span>Valid until: {new Date(coupon.expiry_date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
