"use client"

import { useEffect, useMemo, useState } from "react"
import { formatDate } from "../lib/utils"

type Coupon = {
  id: string
  code: string
  discount: string
  description: string
  short_description: string
  endDate: string
}

const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
const colorMap: any = {
  red: {
    solid: "#ef4444",
    transparent: "#ef4444cc",
  },
  blue: {
    solid: "#3b82f6",
    transparent: "#3b82f6cc",
  },
  green: {
    solid: "#22c55e",
    transparent: "#22c55ecc",
  },
  yellow: {
    solid: "#eab308",
    transparent: "#eab308cc",
  },
  purple: {
    solid: "#8b5cf6",
    transparent: "#8b5cf6cc",
  },
};

export default function OffersSection(data: any) {
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null)
  const [randomColor, setRandomColor] = useState<string | null>(null);
  const coupons = data.data.coupons1;

  useEffect(() => {
    const colors = Object.keys(colorMap);
    const random = colors[Math.floor(Math.random() * colors.length)];
    setRandomColor(random);
  }, []);

  const couponColors = useMemo(() => {
    const result: Record<string, string> = {};
    if (coupons && Array.isArray(coupons)) {
      coupons.forEach((coupon: any) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        result[coupon.id] = color;
      });
    }
    return result;
  }, [coupons]);

  if (!randomColor) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCoupon(code)
    setTimeout(() => setCopiedCoupon(null), 2000)
  }

  return (
    <div className="card elevation-4 py-6 rounded-lg">
      <div className="container px-1 mx-auto">
        <h2 className="text-md md:text-lg font-bold  mb-2">Special Offers</h2>
        <p className=" text-sm md:text-md text-muted-foreground mb-8">Use these exclusive coupons to save on your purchase</p>

        <div className="overflow-x-auto">
          <div className="flex space-x-4 snap-x snap-mandatory scroll-smooth pb-4">
            {Array.isArray(coupons) && coupons.map((coupon: any) => {
              const randomColor = couponColors[coupon.id];
              return (
                <div key={coupon.id} className="border border-dashed border-red-300 bg-red-50 gap-4 p-4 rounded-md flex justify-between items-center min-w-[300px]">
                  <div>
                    <p className="text-xl font-bold text-red-800">{coupon.short_description}</p>
                    <p className="text-sm font-semibold text-red-600 tracking-wider mt-1">
                      {coupon.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-800">{coupon.description}</p>
                    <p className="text-xs text-gray-500">Valid until {formatDate(coupon.end_date)}</p>
                    <button className="mt-2 bg-red-800 text-white text-sm font-semibold px-4 py-1 rounded-full hover:bg-red-900">
                      USE NOW
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
