"use client"

import { formatCurrency } from "@/app/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, ChevronRight, Clock, Package, Search, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

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

const tabs = [
  { value: "all", label: "All" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
]

export default function OrderHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const tabsRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (tabsRef.current && isMobile) {
      const activeTabElement = tabsRef.current.querySelector(`[data-value="${activeTab}"]`)
      if (activeTabElement) {
        const containerWidth = tabsRef.current.offsetWidth
        const tabWidth = activeTabElement.clientWidth
        const tabLeft = (activeTabElement as HTMLElement).offsetLeft
        const scrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2

        tabsRef.current.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        })
      }
    }
  }, [activeTab, isMobile])

  const filteredOrders = orders.filter((order) => {
    // Filter by tab
    if (activeTab !== "all" && order.status !== activeTab) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        order.id.toLowerCase().includes(query) || order.items.some((item) => item.name.toLowerCase().includes(query))
      )
    }

    return true
  })

  return (
    <div className="container py-6 md:py-8">
      <div className="flex items-center mb-4 md:mb-8">
        <Link href="/account" className="text-muted-foreground hover:text-foreground">
          Account
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
        <span>Order History</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-4 md:mb-6 gap-4">
        <h1 className="text-xl md:text-3xl font-bold">Order History</h1>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile Tabs */}
      {isMobile && (
        <div className="relative mb-4">
          <div ref={tabsRef} className="flex overflow-x-auto scrollbar-hide py-2 space-x-2 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                data-value={tab.value}
                className={cn(
                  "px-4 py-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors",
                  activeTab === tab.value ? "bg-primary text-primary-foreground" : "bg-transparent hover:bg-secondary",
                )}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Tabs */}
      {!isMobile && (
        <div className="hidden md:grid grid-cols-5 gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === tab.value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
              )}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
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
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Link href={`/account/orders/${order.id}`} key={order.id} className="block">
              <div className="border rounded-lg overflow-hidden bg-card hover:border-primary transition-colors">
                <div className="p-3 md:p-4 border-b bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">Order #{order.id}</div>
                    <div className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className="ml-2 text-sm font-medium">{order.statusText}</span>
                  </div>
                </div>
                <div className="p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex -space-x-3 rtl:space-x-reverse">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-md border overflow-hidden bg-muted flex-shrink-0"
                        >
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-md border overflow-hidden bg-muted flex items-center justify-center text-xs font-medium">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm line-clamp-1">
                        {order.items
                          .slice(0, 2)
                          .map((item) => item.name)
                          .join(", ")}
                        {order.items.length > 2 && ` and ${order.items.length - 2} more`}
                      </div>
                      <div className="font-medium mt-1">{formatCurrency(order.total)}</div>
                    </div>
                    <div className="hidden sm:flex items-center text-muted-foreground">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
