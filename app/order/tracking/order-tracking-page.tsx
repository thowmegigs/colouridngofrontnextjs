"use client"

import type React from "react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import {
    ArrowLeft,
    Box,
    Calendar,
    Check,
    ChevronRight,
    Clock,
    Copy,
    ExternalLink,
    Loader2,
    MapPin,
    Package,
    RefreshCw,
    Search,
    Share2,
    Truck,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Mock order tracking data
const trackingData = {
  orderId: "ORD-12345",
  trackingNumber: "TRK9876543210",
  carrier: "Express Delivery",
  estimatedDelivery: "May 20, 2023",
  status: "in_transit",
  currentLocation: "Distribution Center, Chicago, IL",
  origin: "Warehouse, Los Angeles, CA",
  destination: "123 Main St, New York, NY 10001",
  progress: 65, // percentage
  items: [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      price: 79.99,
      quantity: 1,
      image: "/modern-commute-audio.png",
    },
    {
      id: "2",
      name: "Smart Fitness Tracker",
      price: 49.99,
      quantity: 1,
      image: "/wrist-activity-monitor.png",
    },
  ],
  timeline: [
    {
      status: "delivered",
      title: "Delivered",
      description: "Package delivered",
      location: "Front door",
      date: "May 20, 2023",
      time: "Estimated",
      completed: false,
    },
    {
      status: "out_for_delivery",
      title: "Out for Delivery",
      description: "Package is out for delivery",
      location: "Local Delivery Facility, New York",
      date: "May 19, 2023",
      time: "Estimated",
      completed: false,
    },
    {
      status: "in_transit",
      title: "In Transit",
      description: "Package is in transit",
      location: "Distribution Center, Chicago, IL",
      date: "May 18, 2023",
      time: "10:45 AM",
      completed: true,
      current: true,
    },
    {
      status: "shipped",
      title: "Shipped",
      description: "Package has been shipped",
      location: "Warehouse, Los Angeles, CA",
      date: "May 16, 2023",
      time: "2:30 PM",
      completed: true,
    },
    {
      status: "processing",
      title: "Processing",
      description: "Order is being processed",
      location: "Warehouse, Los Angeles, CA",
      date: "May 15, 2023",
      time: "11:20 AM",
      completed: true,
    },
    {
      status: "ordered",
      title: "Order Placed",
      description: "Order has been placed",
      location: "Online",
      date: "May 15, 2023",
      time: "9:45 AM",
      completed: true,
    },
  ],
}

type OrderTrackingPageProps = {
  orderId: string
}

export default function OrderTrackingPage({ orderId }: OrderTrackingPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [trackingId, setTrackingId] = useState("")
  const [activeTab, setActiveTab] = useState("timeline")

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Tracking information updated",
        description: "The latest tracking information has been loaded.",
      })
    }, 1500)
  }

  const handleCopyTrackingNumber = () => {
    navigator.clipboard.writeText(trackingData.trackingNumber)
    toast({
      title: "Tracking number copied",
      description: "Tracking number has been copied to clipboard.",
    })
  }

  const handleTrackingSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingId) {
      setIsLoading(true)
      // Simulate search
      setTimeout(() => {
        setIsLoading(false)
        toast({
          title: "Tracking information found",
          description: `Found tracking information for ${trackingId}`,
        })
      }, 1500)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ordered":
        return <Calendar className="h-5 w-5" />
      case "processing":
        return <Package className="h-5 w-5" />
      case "shipped":
        return <Box className="h-5 w-5" />
      case "in_transit":
        return <Truck className="h-5 w-5" />
      case "out_for_delivery":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <Check className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string, completed: boolean, current = false) => {
    if (!completed) return "bg-gray-200 text-gray-500"
    if (current) return "bg-blue-500 text-white"

    switch (status) {
      case "ordered":
        return "bg-purple-500 text-white"
      case "processing":
        return "bg-yellow-500 text-white"
      case "shipped":
        return "bg-indigo-500 text-white"
      case "in_transit":
        return "bg-blue-500 text-white"
      case "out_for_delivery":
        return "bg-teal-500 text-white"
      case "delivered":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-pink-600 mb-4" />
        <h3 className="text-lg font-medium">Loading tracking information...</h3>
        <p className="text-sm text-muted-foreground">Please wait while we fetch the latest updates</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full mx-auto pb-20 md:pb-10">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white sticky top-0 z-10 border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Track Order</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing} className="text-pink-600">
          <RefreshCw className={cn("h-5 w-5", isRefreshing && "animate-spin")} />
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Track Your Order</h1>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="flex items-center">
          <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="px-4 md:px-0">
        {/* Tracking Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleTrackingSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter tracking number"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button type="submit">Track</Button>
            </form>
          </CardContent>
        </Card>

        {/* Order Info */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm font-medium opacity-80">Order Number</h2>
                <p className="text-lg font-bold">{trackingData.orderId}</p>
              </div>
              <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                {trackingData.status === "in_transit" ? "In Transit" : trackingData.status.replace("_", " ")}
              </Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="text-sm text-muted-foreground">Tracking Number</div>
                  <div className="font-medium">{trackingData.trackingNumber}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleCopyTrackingNumber} className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="text-sm text-muted-foreground">Carrier</div>
                  <div className="font-medium">{trackingData.carrier}</div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Estimated Delivery</div>
                <div className="font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-pink-600" />
                  {trackingData.estimatedDelivery}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Current Location</div>
                <div className="font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-pink-600" />
                  {trackingData.currentLocation}
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
              <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: `${trackingData.progress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Order Placed</span>
              <span>In Transit</span>
              <span>Delivered</span>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Timeline and Details */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="details">Order Details</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <div className="relative">
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200"></div>
              <div className="space-y-8">
                {trackingData.timeline.map((event, index) => (
                  <div key={index} className="relative flex items-start">
                    <div
                      className={cn(
                        "absolute left-6 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center z-10",
                        getStatusColor(event.status, event.completed, event.current),
                      )}
                    >
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="ml-10 bg-white p-4 rounded-lg border w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">{event.description}</div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "ml-2",
                            event.completed
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-gray-50 text-gray-700 border-gray-200",
                          )}
                        >
                          {event.completed ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {event.date} {event.time && `at ${event.time}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Accordion type="single" collapsible defaultValue="items">
              <AccordionItem value="items">
                <AccordionTrigger className="text-lg font-medium">Order Items</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {trackingData.items.map((item) => (
                      <div key={item.id} className="flex border rounded-lg p-4">
                        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping">
                <AccordionTrigger className="text-lg font-medium">Shipping Information</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium">Origin</div>
                      <div className="text-sm text-muted-foreground">{trackingData.origin}</div>
                    </div>
                    <div>
                      <div className="font-medium">Destination</div>
                      <div className="text-sm text-muted-foreground">{trackingData.destination}</div>
                    </div>
                    <div>
                      <div className="font-medium">Carrier</div>
                      <div className="text-sm text-muted-foreground">{trackingData.carrier}</div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="help">
                <AccordionTrigger className="text-lg font-medium">Need Help?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      If you have any questions about your order or need assistance, please contact our customer
                      support.
                    </p>
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" className="justify-start">
                        <Package className="h-4 w-4 mr-2" />
                        Report a Problem
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Tracking Info
                      </Button>
                      <Link href={`/customer/orders/${orderId}`}>
                        <Button variant="outline" className="w-full justify-start">
                          <ChevronRight className="h-4 w-4 mr-2" />
                          View Order Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-50">
        <div className="flex justify-between">
          <Link href={`/customer/orders/${orderId}`} className="flex-1 mr-2">
            <Button variant="outline" className="w-full">
              View Order
            </Button>
          </Link>
          <Button className="flex-1" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
        </div>
      </div>
    </div>
  )
}
