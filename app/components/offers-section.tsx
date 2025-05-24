"use client"

import { Button } from "@/components/ui/button"
import { Check, Copy, Scissors } from "lucide-react"
import { useMemo, useState } from "react"

type Coupon = {
  id: string
  code: string
  discount: string
  description: string
  short_description: string
  endDate: string
 
}
const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
const colorMap :any= {
  red: {
    solid: "#ef4444",     // Tailwind red-500
    transparent: "#ef4444cc", // ~80% opacity (cc = 204)
  },
  blue: {
    solid: "#3b82f6",     // Tailwind blue-500
    transparent: "#3b82f6cc",
  },
  green: {
    solid: "#22c55e",     // Tailwind green-500
    transparent: "#22c55ecc",
  },
  yellow: {
    solid: "#eab308",     // Tailwind yellow-500
    transparent: "#eab308cc",
  },
  purple: {
    solid: "#8b5cf6",     // Tailwind purple-500
    transparent: "#8b5cf6cc",
  },
};



export default function OffersSection(data:any) {
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null)

  const handleCopyCode = (code: string) => {
      navigator.clipboard.writeText(code)
      setCopiedCoupon(code)
      setTimeout(() => setCopiedCoupon(null), 2000)
    }

  
  const coupons=data.data.coupons1;
  const couponColors = useMemo(() => {
    const result: Record<string, string> = {};
    if(coupons){
    coupons.forEach((coupon: any) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      result[coupon.id] = color;
    });
  }
    return result;
  }, [coupons]);

  return (
    <div className="card elevation-4 py-3 bg-gray-50 rounded-lg ">
      <div className="container  ">
        <h2 className="text-3xl font-bold text-center mb-2">Special Offers</h2>
        <p className="text-center text-muted-foreground mb-8">Use these exclusive coupons to save on your purchase</p>

        <div className="flex justify-center">
  <div
    className={`grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3`}
   
  >
    {coupons.map((coupon: any) => {
      const randomColor = couponColors[coupon.id];
      return (
        <div
          key={coupon.id}
          className="relative  rounded-lg shadow-md overflow-hidden"
          style={{
            boxShadow:'rgb(215 220 223) 1px 1px 9px 3px',
            background: `linear-gradient(135deg, ${randomColor} 0%, ${colorMap[randomColor]['transparent']} 100%)`,
            color: "white",
          }}
        >
          {/* Coupon Content */}
          <div className="p-6">
            <div className="text-xs font-semibold mb-1 opacity-80">COUPON CODE</div>
            <div className="flex items-center justify-between">
              <div className="font-mono text-lg font-bold">{coupon.code}</div>
              <Button
                variant="ghost"
                size="sm"
                className="text-current hover:bg-white/20"
                onClick={() => handleCopyCode(coupon.code)}
              >
                {copiedCoupon === coupon.code ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="text-xl font-bold ml-5">
              {coupon.discount}% OFF
            </div>
            <div className="mt-2 text-sm opacity-90 h-10 p-[5px]">{coupon.description}</div>
          </div>

          {/* Scissors and dotted line */}
          <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 ">
            <div className={`bg-[${colorMap[randomColor]['transparent']}] rounded-full p-1 shadow-md`}>
              <Scissors className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
            <div className={`bg-[${colorMap[randomColor]['transparent']}] rounded-full p-1 shadow-md`}>
              <Scissors className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 border-t-2 border-dashed border-white/30 z-0"></div>

          {/* Coupon bottom part */}
          <div className="p-4 bg-white/20 text-xs text-center">{coupon.end_date}</div>

          {/* Circular cuts on sides */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-gray-100 rounded-r-full"></div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-gray-100 rounded-l-full"></div>
        </div>
      );
    })}
  </div>
</div>

      </div>
    </div>
  )
}
