"use client"

import { formatCurrency } from "@/app/lib/utils"
import { Button } from "@/components/ui/button"
import { api_url } from "@/contant"
import { decryptId } from "@/lib/api"
import axios from "axios"
import { AlertCircle, CheckCircle, Clock, Package, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

// Define the Order type to match our API response
type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
}

type OrderAddress = {
  name: string
  
  phone_number: string
  address1: string
  address2?: string
  city_id: string
  state_id: string
  city_name: string
  state_name: string
  pincode: string

}

type Order = {
  id: string
  date: string
  total: number
  subtotal: number
  shipping_fee: number
  discount: number
  payment_method: string
  payment_status: string
  shipping_status: string
  items: OrderItem[]
  shipping_address: OrderAddress
  billing_address: OrderAddress
  coupon?: {
    code: string
    discount_amount: number
  }
  estimatedDelivery: string
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")
  const [order, setOrder] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) {
        setError("No order ID provided")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const decryptedOrderId = orderId?decryptId(decodeURIComponent(orderId)):null;
        const response = await axios(`${api_url}/orders/${decryptedOrderId}`)
         const data = await response.data.data
      
      if (!data.estimated_delivery) {
          data.estimated_delivery = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()
        }

        setOrder(data)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Failed to load order details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId,decryptId])

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "We couldn't find the order you're looking for."}</p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Order Successful!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        <div className="border rounded-lg overflow-hidden mb-8">
          <div className="bg-muted px-6 py-4 font-medium">Order Details</div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Order Number</h3>
                <p className="font-medium">{order.orderId}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Date</h3>
                <p>{new Date(order.created_at).toLocaleDateString()}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Total</h3>
                <p className="font-medium">{formatCurrency(order.total)}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h3>
                <p>{order.payment_method}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Status</h3>
                <p className={order.paid_status === "Paid" ? "text-green-600" : "text-amber-600"}>
                  {order.paid_status}
                </p>
              </div>

              {order.coupon && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Applied Coupon</h3>
                  <p className="font-medium">
                    {order.coupon.code} ({formatCurrency(order.coupon.discount)} discount)
                  </p>
                </div>
              )}
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Order Items</h3>
              <ul className="space-y-4">
                {order.items.map((item:any) => (
                  <li key={item.id} className="flex">
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-muted">
                      <Image
                        src={item.image || "/placeholder.svg?height=64&width=64&query=product"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-muted-foreground">
                          Qty: {item.qty}
                          {/* {item.size && ` | Size: ${item.size}`}
                          {item.color && ` | Color: ${item.color}`} */}
                        </span>
                        <span className="font-medium">{formatCurrency(item.sale_price * item.qty)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(order.shipping_cost)}</span>
                </div>
                {order.total_discount > 0 && (
                  <div className="flex justify-between py-1 text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.total_discount)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 font-medium text-lg border-t mt-2">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-lg p-6">
            <h3 className="font-medium mb-4">Shipping Address</h3>
            <div>
              <p className="font-medium">{order.shipping_name}</p>
              <p>{order.shipping_address1}</p>
              {order.shipping_address2 &&
                   <p>{order.shipping_address2}</p>
              }
              <p>
                {order.shipping_city_name}, {order.shipping_state_name} {order.shipping_pincode}
              </p>
              
              <p className="mt-2">{order.shipping_phone_number}</p>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-medium mb-4">Shipping Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-4">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Order Placed</h4>
                  <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-4">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-medium">Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.delivery_status === "Pending" ? "Your order is being processed" : order.delivery_status}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-4">
                  <Truck className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium">Estimated Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.estimated_delivery).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/customer/orders">
            <Button variant="outline" className="w-full sm:w-auto">
              View Order History
            </Button>
          </Link>

          <Link href="/">
            <Button className="w-full sm:w-auto">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
