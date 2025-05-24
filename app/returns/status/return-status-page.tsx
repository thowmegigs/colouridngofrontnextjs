"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronRight, Clock, CheckCircle, AlertCircle, Truck, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/app/lib/utils"

// Mock return requests data
const returnRequests = [
  {
    id: "RET12345",
    orderId: "ORD123456",
    date: "2023-06-10",
    status: "approved",
    refundAmount: 79.99,
    refundMethod: "Original Payment Method",
    items: [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        price: 79.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    timeline: [
      { date: "2023-06-10", status: "Return requested", description: "Return request submitted" },
      { date: "2023-06-11", status: "Return approved", description: "Your return request has been approved" },
      { date: "2023-06-12", status: "Awaiting package", description: "Please ship the items back to us" },
    ],
  },
  {
    id: "RET67890",
    orderId: "ORD789012",
    date: "2023-05-25",
    status: "completed",
    refundAmount: 49.99,
    refundMethod: "Store Credit",
    items: [
      {
        id: "2",
        name: "Smart Fitness Tracker",
        price: 49.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    timeline: [
      { date: "2023-05-25", status: "Return requested", description: "Return request submitted" },
      { date: "2023-05-26", status: "Return approved", description: "Your return request has been approved" },
      { date: "2023-05-28", status: "Package received", description: "We have received your returned items" },
      {
        date: "2023-05-30",
        status: "Refund processed",
        description: "Your refund has been processed to store credit",
      },
      { date: "2023-05-31", status: "Return completed", description: "Your return process is now complete" },
    ],
  },
  {
    id: "RET54321",
    orderId: "ORD654321",
    date: "2023-06-05",
    status: "pending",
    refundAmount: 129.99,
    refundMethod: "Original Payment Method",
    items: [
      {
        id: "3",
        name: "Premium Leather Wallet",
        price: 39.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "4",
        name: "Stainless Steel Water Bottle",
        price: 24.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "5",
        name: "Portable Bluetooth Speaker",
        price: 59.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    timeline: [
      { date: "2023-06-05", status: "Return requested", description: "Return request submitted" },
      { date: "2023-06-06", status: "Under review", description: "Your return request is being reviewed" },
    ],
  },
  {
    id: "RET13579",
    orderId: "ORD24680",
    date: "2023-06-01",
    status: "rejected",
    refundAmount: 0,
    refundMethod: "N/A",
    items: [
      {
        id: "6",
        name: "Organic Cotton T-Shirt",
        price: 19.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    timeline: [
      { date: "2023-06-01", status: "Return requested", description: "Return request submitted" },
      {
        date: "2023-06-03",
        status: "Return rejected",
        description: "Your return request has been rejected as the return window has expired",
      },
    ],
  },
]

export default function ReturnStatusPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedReturn, setSelectedReturn] = useState<string | null>(null)

  const filteredReturns = activeTab === "all" ? returnRequests : returnRequests.filter((r) => r.status === activeTab)

  const selectedReturnData = returnRequests.find((r) => r.id === selectedReturn)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "approved":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "approved":
        return "Approved"
      case "completed":
        return "Completed"
      case "rejected":
        return "Rejected"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-amber-500 bg-amber-50"
      case "approved":
        return "text-blue-500 bg-blue-50"
      case "completed":
        return "text-green-500 bg-green-50"
      case "rejected":
        return "text-red-500 bg-red-50"
      default:
        return "text-gray-500 bg-gray-50"
    }
  }

  const getTimelineIcon = (status: string) => {
    if (status.includes("requested")) return <Package className="h-4 w-4" />
    if (status.includes("approved")) return <CheckCircle className="h-4 w-4" />
    if (status.includes("rejected")) return <AlertCircle className="h-4 w-4" />
    if (status.includes("received")) return <Package className="h-4 w-4" />
    if (status.includes("processed")) return <CheckCircle className="h-4 w-4" />
    if (status.includes("completed")) return <CheckCircle className="h-4 w-4" />
    if (status.includes("awaiting")) return <Truck className="h-4 w-4" />
    if (status.includes("review")) return <Clock className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  return (
    <div className="container py-8">
      {selectedReturn ? (
        <div>
          <div className="flex items-center mb-8">
            <button
              onClick={() => setSelectedReturn(null)}
              className="text-muted-foreground hover:text-foreground flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Return Requests
            </button>
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            <span>Return Details</span>
          </div>

          {selectedReturnData && (
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Return #{selectedReturnData.id}</h1>
                  <p className="text-muted-foreground">
                    Submitted on {new Date(selectedReturnData.date).toLocaleDateString()}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedReturnData.status)}`}
                >
                  {getStatusText(selectedReturnData.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Order Information</h3>
                  <p className="text-sm mb-1">
                    Order ID: <span className="font-medium">{selectedReturnData.orderId}</span>
                  </p>
                  <Link href={`/account/orders/${selectedReturnData.orderId}`} className="text-sm text-primary">
                    View original order
                  </Link>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Refund Information</h3>
                  <p className="text-sm mb-1">
                    Amount: <span className="font-medium">{formatCurrency(selectedReturnData.refundAmount)}</span>
                  </p>
                  <p className="text-sm">
                    Method: <span className="font-medium">{selectedReturnData.refundMethod}</span>
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Return Status</h3>
                  <div className="flex items-center">
                    {getStatusIcon(selectedReturnData.status)}
                    <span className="ml-2 text-sm">{getStatusText(selectedReturnData.status)}</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden mb-8">
                <div className="p-4 border-b bg-muted/30">
                  <h2 className="font-medium">Returned Items</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {selectedReturnData.items.map((item) => (
                      <div key={item.id} className="flex items-start">
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
                          <p className="font-medium">{item.name}</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                            <span className="font-medium">{formatCurrency(item.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h2 className="font-medium">Return Timeline</h2>
                </div>
                <div className="p-4">
                  <div className="relative">
                    {selectedReturnData.timeline.map((event, index) => (
                      <div key={index} className="flex mb-6 last:mb-0">
                        <div className="flex flex-col items-center mr-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {getTimelineIcon(event.status)}
                          </div>
                          {index < selectedReturnData.timeline.length - 1 && (
                            <div className="w-0.5 bg-muted flex-1 my-1"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{event.status}</p>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedReturnData.status === "approved" && (
                <div className="mt-8 text-center">
                  <p className="mb-4 text-sm">
                    Please ship your items back to us using the shipping label provided in your email.
                  </p>
                  <Button>Download Shipping Label</Button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-8">
            <Link href="/returns" className="text-muted-foreground hover:text-foreground flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Returns
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            <span>Return Status</span>
          </div>

          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Return Requests</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>

            {filteredReturns.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No return requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReturns.map((returnRequest) => (
                  <div
                    key={returnRequest.id}
                    className="border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                    onClick={() => setSelectedReturn(returnRequest.id)}
                  >
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Return #{returnRequest.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(returnRequest.date).toLocaleDateString()} • Order #{returnRequest.orderId}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium mr-2 ${getStatusColor(
                            returnRequest.status,
                          )}`}
                        >
                          {getStatusText(returnRequest.status)}
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="px-4 pb-4 flex items-center space-x-2 overflow-x-auto">
                      {returnRequest.items.map((item) => (
                        <div key={item.id} className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-muted">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
