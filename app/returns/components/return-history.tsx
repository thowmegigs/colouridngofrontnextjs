"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { RotateCcw, Search, CheckCircle, Clock, Truck, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/app/lib/utils"

// Mock return data
const returns = [
  {
    id: "RET123456",
    orderId: "ORD123456",
    date: "2023-06-10",
    status: "completed",
    statusText: "Refund Completed",
    refundAmount: 79.99,
    item: {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      price: 79.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    reason: "Item doesn't meet expectations",
    timeline: [
      {
        status: "requested",
        date: "2023-06-01",
        description: "Return requested",
      },
      {
        status: "approved",
        date: "2023-06-02",
        description: "Return approved",
      },
      {
        status: "shipped",
        date: "2023-06-05",
        description: "Item shipped back",
      },
      {
        status: "received",
        date: "2023-06-08",
        description: "Item received",
      },
      {
        status: "completed",
        date: "2023-06-10",
        description: "Refund processed",
      },
    ],
  },
  {
    id: "RET789012",
    orderId: "ORD345678",
    date: "2023-06-15",
    status: "processing",
    statusText: "Return Processing",
    refundAmount: 59.99,
    item: {
      id: "5",
      name: "Portable Bluetooth Speaker",
      price: 59.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    reason: "Received damaged item",
    timeline: [
      {
        status: "requested",
        date: "2023-06-12",
        description: "Return requested",
      },
      {
        status: "approved",
        date: "2023-06-13",
        description: "Return approved",
      },
      {
        status: "shipped",
        date: "2023-06-15",
        description: "Item shipped back",
      },
    ],
  },
  {
    id: "RET456789",
    orderId: "ORD789012",
    date: "2023-05-15",
    status: "rejected",
    statusText: "Return Rejected",
    refundAmount: 0,
    item: {
      id: "4",
      name: "Stainless Steel Water Bottle",
      price: 24.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    reason: "Changed my mind",
    timeline: [
      {
        status: "requested",
        date: "2023-05-10",
        description: "Return requested",
      },
      {
        status: "rejected",
        date: "2023-05-15",
        description: "Return rejected - Return window expired",
      },
    ],
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "requested":
      return <RotateCcw className="h-5 w-5 text-primary" />
    case "approved":
      return <CheckCircle className="h-5 w-5 text-blue-500" />
    case "shipped":
      return <Truck className="h-5 w-5 text-amber-500" />
    case "received":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "rejected":
      return <XCircle className="h-5 w-5 text-destructive" />
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />
  }
}

export default function ReturnHistory() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredReturns = returns.filter((returnItem) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        returnItem.id.toLowerCase().includes(query) ||
        returnItem.item.name.toLowerCase().includes(query) ||
        returnItem.orderId.toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-muted/30 flex justify-between items-center flex-wrap gap-4">
        <h2 className="font-medium">Return History</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search returns..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4">
        {filteredReturns.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <RotateCcw className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No returns found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? `No returns matching "${searchQuery}"` : "You haven't made any returns yet"}
            </p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReturns.map((returnItem) => (
              <div key={returnItem.id} className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b bg-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{returnItem.id}</span>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-sm">Order: {returnItem.orderId}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(returnItem.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center">
                    {getStatusIcon(returnItem.status)}
                    <span className="ml-2">{returnItem.statusText}</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex">
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-muted">
                        <Image
                          src={returnItem.item.image || "/placeholder.svg"}
                          alt={returnItem.item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="ml-4">
                        <h4 className="font-medium">{returnItem.item.name}</h4>
                        <div className="flex flex-col mt-1">
                          <span className="text-sm text-muted-foreground">Reason: {returnItem.reason}</span>
                          <span className="font-medium">Refund: {formatCurrency(returnItem.refundAmount)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
                      <h4 className="font-medium mb-3">Return Timeline</h4>
                      <div className="relative">
                        {returnItem.timeline.map((event, index) => (
                          <div key={index} className="flex mb-4 last:mb-0">
                            <div className="mr-3 relative">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                {getStatusIcon(event.status)}
                              </div>
                              {index < returnItem.timeline.length - 1 && (
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-border" />
                              )}
                            </div>

                            <div>
                              <h5 className="text-sm font-medium">{event.description}</h5>
                              <p className="text-xs text-muted-foreground">
                                {new Date(event.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
