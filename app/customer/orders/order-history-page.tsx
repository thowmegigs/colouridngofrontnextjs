"use client"

import { formatCurrency } from "@/app/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchOrders } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { AlertCircle, CheckCircle, ChevronRight, Clock, Filter, Package, Search, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Mock order data
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
  {
    id: "ORD345678",
    date: "2023-05-20",
    total: 59.99,
    status: "shipped",
    statusText: "Shipped",
    items: [
      {
        id: "5",
        name: "Portable Bluetooth Speaker",
        price: 59.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    timeline: [
      {
        status: "ordered",
        date: "2023-05-18",
        description: "Order placed",
      },
      {
        status: "processing",
        date: "2023-05-18",
        description: "Payment confirmed",
      },
      {
        status: "shipped",
        date: "2023-05-20",
        description: "Order shipped",
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
      last4: "5678",
    },
  },
  {
    id: "ORD901234",
    date: "2023-05-22",
    total: 39.99,
    status: "processing",
    statusText: "Processing",
    items: [
      {
        id: "3",
        name: "Premium Leather Wallet",
        price: 39.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    timeline: [
      {
        status: "ordered",
        date: "2023-05-22",
        description: "Order placed",
      },
      {
        status: "processing",
        date: "2023-05-22",
        description: "Payment confirmed",
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
      last4: "9012",
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

export default function OrderHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });;
  const filteredOrders:any = []


  if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Error loading orders.</p>;
  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Link href="/customer/dashboard" className="text-muted-foreground hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
        <span>Order History</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Order History</h1>

        <div className="flex gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
     

        <div className="flex-1">
          {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-2">No orders found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery
                      ? `No orders matching "${searchQuery}"`
                      : activeTab === "all"
                        ? "You haven't placed any orders yet"
                        : `You don't have any ${activeTab} orders`}
                  </p>
                  <Link href="/">
                    <Button>Continue Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order:any) => (
                    <div
                      key={order.id}
                      className="border rounded-lg overflow-hidden bg-white shadow hover:border-primary transition-colors"
                    >
                      <div className="p-4 border-b bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="font-medium">Order #{order.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="ml-2 text-sm font-medium">{order.status}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex -space-x-4 rtl:space-x-reverse">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div
                                key={index}
                                className="w-12 h-12 rounded-md border overflow-hidden bg-muted flex-shrink-0"
                              >
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.product_name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-12 h-12 rounded-md border overflow-hidden bg-muted flex items-center justify-center text-xs font-medium">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm line-clamp-1">
                              {order.items
                                .slice(0, 2)
                                .map((item) => item.product_name)
                                .join(", ")}
                              {order.items.length > 2 && ` and ${order.items.length - 2} more`}
                            </div>
                            <div className="font-medium mt-1">{formatCurrency(order.total)}</div>
                          </div>
                          <div className="flex items-center justify-end">
                            <Link href={`/customer/orders/${order.id}/returns`}>
                              <Button variant="outline" size="sm" className="mr-2">
                                Return
                              </Button>
                            </Link>
                            <Link href={`/customer/orders/${order.id}`}>
                              <Button size="sm">Details</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </div>
      </div>
    </div>
  )
}
