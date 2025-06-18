"use client"

import { Check, ShoppingCart, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Component() {
  const [showAlert, setShowAlert] = useState(false)
  const [recentItem, setRecentItem] = useState(null)

  const sampleProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: 79.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Premium Coffee Mug",
      price: 24.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Organic Cotton T-Shirt",
      price: 34.99,
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const addToCart = (product) => {
    setRecentItem(product)
    setShowAlert(true)
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowAlert(false)
    }, 5000)
  }

  const closeAlert = () => {
    setShowAlert(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Sample Products Grid */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Sample Products</h1>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {sampleProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-4">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-green-600 mb-4">${product.price}</p>
                <Button onClick={() => addToCart(product)} className="w-full">
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Alert Notification */}
      {showAlert && recentItem && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-md w-full transform transition-all duration-300 ease-out animate-in slide-in-from-top-4"
            style={{
              animation: "slideInFromTop 0.3s ease-out",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">Added to Cart!</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={closeAlert} className="h-8 w-8 p-0 hover:bg-gray-100">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Product Details */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Image
                  src={recentItem.image || "/placeholder.svg"}
                  alt={recentItem.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-xl border-2 border-gray-100"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{recentItem.name}</h4>
                <p className="text-2xl font-bold text-green-600">${recentItem.price}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={closeAlert} className="flex-1">
                Continue Shopping
              </Button>
              <Button
                onClick={() => {
                  closeAlert()
                  // Navigate to cart page
                  console.log("Navigate to cart")
                }}
                className="flex-1 bg-black hover:bg-gray-800"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Cart
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showAlert && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={closeAlert} />}

      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}
