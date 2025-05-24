"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Package, Truck, CheckCircle, Clock, AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/app/lib/utils"

// Mock order data - in a real app, you would fetch this based on the orderId
const orders = [
  {
    id: "ORD123456",
    date: "2023-05-15",
    total: 129.98,
    status: "delivered",
    statusText: "Delivered",
    items: [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        price: 79.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "2",
        name: "Smart Fitness Tracker",
        price: 49.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    timeline: [
      {
        status: "ordered",
        date: "2023-05-10",
        description: "Order placed",
      },
      {
        status: "processing",
        date: "2023-05-11",
        description: "Payment confirmed",
      },
      {
        status: "shipped",
        date: "2023-05-12",
        description: "Order shipped",
      },
      {
        status: "delivered",
        date: "2023-05-15",
        description: "Order delivered",
      },
    ],
    address: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    payment: {
      method: "Credit Card",
      last4: "1234",
    },
  },
  {
    id: "ORD789012",
    date: "2023-04-28",
    total: 24.99,
    status: "delivered",
    statusText: "Delivered",
    items: [
      {
        id: "4",
        name: "Stainless Steel Water Bottle",
        price: 24.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    timeline: [
      {
        status: "ordered",
        date: "2023-04-25",
        description: "Order placed",
      },
      {
        status: "processing",
        date: "2023-04-25",
        description: "Payment confirmed",
      },
      {
        status: "shipped",
        date: "2023-04-26",
        description: "Order shipped",
      },
      {
        status: "delivered",
        date: "2023-04-28",
        description: "Order delivered",
      },
    ],
    address: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    payment: {
      method: "PayPal",
      last4: "",
    },
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "ordered":
      return <Package className="h-5 w-5 text-primary" />
    case "processing":
      return <Clock className="h-5 w-5 text-amber-500" />
    case "shipped":
      return <Truck className="h-5 w-5 text-blue-500" />
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "cancelled":
      return <AlertCircle className="h-5 w-5 text-destructive" />
    default:
      return <Package className="h-5 w-5" />
  }
}

export default function OrderDetailPage({ orderId }: { orderId: string }) {
  // Find the order by ID
  const order = orders.find((o) => o.id === orderId)

  if (!order) {
    return (
      <div className="container py-8">
        <div className="flex items-center mb-8">
          <Link href="/account/orders" className="text-muted-foreground hover:text-foreground flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
        </div>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Order not found</h3>
          <p className="text-muted-foreground mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link href="/account/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Link href="/account/orders" className="text-muted-foreground hover:text-foreground flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
        <span>Order {order.id}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Order Details</h1>
        <div className="flex items-center mt-2 md:mt-0">
          {getStatusIcon(order.status)}
          <span className="ml-2 font-medium">{order.statusText}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="border rounded-lg overflow-hidden bg-white mb-6">
            <div className="p-4 border-b bg-muted/30">
              <h2 className="font-medium">Order Items</h2>
            </div>
            <div className="p-4">
              <ul className="space-y-4">
                {order.items.map((item) => (
                  <li key={item.id} className="flex">
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-muted">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                        <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden bg-white">
            <div className="p-4 border-b bg-muted/30">
              <h2 className="font-medium">Order Timeline</h2>
            </div>
            <div className="p-4">
              <div className="relative">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex mb-6 last:mb-0">
                    <div className="mr-4 relative">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {getStatusIcon(event.status)}
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-border" />
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium">{event.description}</h4>
                      <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="border rounded-lg overflow-hidden bg-white mb-6">
            <div className="p-4 border-b bg-muted/30">
              <h2 className="font-medium">Order Summary</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span>{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">{formatCurrency(order.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span>
                    {order.payment.method}
                    {order.payment.last4 && ` (**** ${order.payment.last4})`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden bg-white mb-6">
            <div className="p-4 border-b bg-muted/30">
              <h2 className="font-medium">Shipping Address</h2>
            </div>
            <div className="p-4">
              <div className="text-sm">
                <p className="font-medium">{order.address.name}</p>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state} {order.address.zip}
                </p>
                <p>{order.address.country}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full">Track Order</Button>
            {order.status !== "cancelled" && (
              <Link href={`/returns/create?orderId=${order.id}`}>
                <Button variant="outline" className="w-full">
                  Request Return
                </Button>
              </Link>
            )}
            <Button variant="outline" className="w-full">
              Download Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
