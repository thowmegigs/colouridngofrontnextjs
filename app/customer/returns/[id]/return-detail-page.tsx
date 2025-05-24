"use client"

import { formatCurrency, formatDate } from "@/app/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { cancelReturn, getReturnById } from "@/lib/return-api"

import { useQuery } from "@tanstack/react-query"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  ImageIcon,
  Package,
  RefreshCcw,
  Repeat,
  Truck,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface ReturnStatusUpdate {
  status: string
  icon: string
  notes: string
  date: string
}

interface ReturnDetailPageProps {
  returnId: string
}

export default function ReturnDetailPage({ returnId }: ReturnDetailPageProps) {
  const router = useRouter()
  const [isCancelling, setIsCancelling] = useState(false)

  // Fetch return details
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["return", returnId],
    queryFn: () => getReturnById(returnId),
  })

  // Handle return cancellation
  const handleCancelReturn = async () => {
    if (!confirm("Are you sure you want to cancel this request?")) {
      return
    }

    setIsCancelling(true)
    try {
      await cancelReturn(returnId)
      toast({
        title: "Request cancelled",
        description: `Your ${data.type === "Exchange" ? "exchange" : "return"} request has been cancelled successfully.`,
      })
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel request",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  // Get icon component based on status icon name
  const getStatusIcon = (iconName: string) => {
    switch (iconName) {
      case "return":
        return <RefreshCcw className="h-5 w-5" />
      case "exchange":
        return <Repeat className="h-5 w-5" />
      case "package":
        return <Package className="h-5 w-5" />
      case "truck":
        return <Truck className="h-5 w-5" />
      case "check":
        return <CheckCircle className="h-5 w-5" />
      case "cancel":
        return <XCircle className="h-5 w-5" />
      case "alert":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  // Get color based on return status
  const getStatusColor = (status: string) => {
    if (status.includes("Requested")) return "bg-yellow-100 text-yellow-800"
    if (status.includes("Approved")) return "bg-blue-100 text-blue-800"
    if (status.includes("Processing")) return "bg-purple-100 text-purple-800"
    if (status.includes("Completed")) return "bg-green-100 text-green-800"
    if (status.includes("Cancelled")) return "bg-red-100 text-red-800"
    if (status.includes("Rejected")) return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
  }

  // Get color based on refund status
  const getRefundStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium">Error Loading Details</h3>
              <p className="text-sm text-gray-500 mt-2">
                {error instanceof Error ? error.message : "Failed to load details"}
              </p>
              <Button onClick={() => refetch()} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-medium">Request Not Found</h3>
              <p className="text-sm text-gray-500 mt-2">
                The request you are looking for does not exist or has been removed.
              </p>
              <Link href="/customer/returns">
                <Button className="mt-4">View All Returns</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Parse the return status updates from timelines
  const statusUpdates: ReturnStatusUpdate[] = data.timelines || [
    {
      status: data.type === "Exchange" ? "Exchange Requested" : "Return Requested",
      icon: data.type === "Exchange" ? "exchange" : "return",
      notes: "",
      date: data.created_at,
    },
  ]

  // Get all images from all return items
  const allImages: string[] = []
  if (data.return_items && Array.isArray(data.return_items)) {
    data.return_items.forEach((item) => {
      if (item.first_image) allImages.push(item.first_image)
      if (item.second_image) allImages.push(item.second_image)
      if (item.third_image) allImages.push(item.third_image)
      if (item.fourth_image) allImages.push(item.fourth_image)
    })
  }

  const isExchange = data.type === "Exchange"

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-xl">
                      {isExchange ? "Exchange" : "Return"} #{data.uuid || data.id}
                    </CardTitle>
                    <Badge variant={isExchange ? "outline" : "default"} className="ml-2">
                      {isExchange ? "Exchange" : "Return"}
                    </Badge>
                  </div>
                  <CardDescription>Requested on {formatDate(data.created_at)}</CardDescription>
                </div>
                <div className="flex flex-col items-end">
                  <Badge className={getStatusColor(data.return_status)}>{data.return_status}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">{isExchange ? "Exchange" : "Return"} Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="font-medium">{data.reason}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Details</p>
                    <p className="font-medium">{data.details || "No additional details provided"}</p>
                  </div>

                  {isExchange && data.exchange_size && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Current Size</p>
                        <p className="font-medium">{data.current_size || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Requested Size</p>
                        <p className="font-medium">{data.exchange_size}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {!isExchange && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Refund Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Refund Amount</p>
                      <p className="font-medium">{formatCurrency(Number.parseFloat(data.refund_amount))}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Refund Method</p>
                      <p className="font-medium">{data.refund_method}</p>
                    </div>
                    {data.refund_method === "UPI" && (
                      <div>
                        <p className="text-sm text-gray-500">UPI ID</p>
                        <p className="font-medium">{data.upi || "Not provided"}</p>
                      </div>
                    )}
                  </div>

                  {data.refund_method === "UPI" && data.qrcode_image && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">UPI QR Code</p>
                      <div className="relative h-48 w-48 border rounded-md overflow-hidden">
                        <Image
                          src={`${data.qrcode_image}` || "/placeholder.svg"}
                          alt="UPI QR Code"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium mb-3">{isExchange ? "Exchange" : "Return"} Images</h3>
                {data.first_image || data.second_image || data.third_image || data.fourth_image ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {data.first_image && 
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="relative h-32 border rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                            <Image
                              src={data.first_image || "/placeholder.svg"}
                              alt={`Image`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                          <div className="relative h-[500px] w-full">
                            <Image
                              src={data.first_image || "/placeholder.svg"}
                              alt={`Image`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    }
                    {data.second_image && 
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="relative h-32 border rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                            <Image
                              src={data.second_image || "/placeholder.svg"}
                              alt={`Image`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                          <div className="relative h-[500px] w-full">
                            <Image
                              src={data.second_image || "/placeholder.svg"}
                              alt={`Image`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    }
                    {data.third_image && 
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="relative h-32 border rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                            <Image
                              src={data.third_image || "/placeholder.svg"}
                              alt={`Image`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                          <div className="relative h-[500px] w-full">
                            <Image
                              src={data.third_image || "/placeholder.svg"}
                              alt={`Image`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    }
                    {data.fourth_image && 
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="relative h-32 border rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                            <Image
                              src={data.fourth_image || "/placeholder.svg"}
                              alt={`Image`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                          <div className="relative h-[500px] w-full">
                            <Image
                              src={data.fourth_image || "/placeholder.svg"}
                              alt={`Image`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    }
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 border rounded-md bg-gray-50">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">No images uploaded</p>
                    </div>
                  </div>
                )}
              </div>

              {data.return_items && data.return_items.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Items</h3>
                  <div className="space-y-4">
                    {data.return_items.map((item, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-shrink-0">
                              <div className="relative h-24 w-24 border rounded-md overflow-hidden">
                                <Image
                                  src={
                                    `${process.env.NEXT_PUBLIC_API_URL || "/placeholder.svg"}/uploads/${item.first_image}` ||
                                    "/placeholder.svg"
                                  }
                                  alt={`Item ${item.id}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium">Item #{item.id}</h4>
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                <div className="text-sm">
                                  <span className="text-gray-500">Images: </span>
                                  <span>
                                    {
                                      [item.first_image, item.second_image, item.third_image, item.fourth_image].filter(
                                        Boolean,
                                      ).length
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter>
              {data.return_status === "Return Requested" && (
                <Button variant="destructive" onClick={handleCancelReturn} disabled={isCancelling}>
                  {isCancelling ? "Cancelling..." : `Cancel ${isExchange ? "Exchange" : "Return"} Request`}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {statusUpdates.map((update, index) => (
                  <div key={index} className="relative pl-8">
                    {index !== statusUpdates.length - 1 && (
                      <div className="absolute left-[11px] top-8 h-full w-0.5 bg-gray-200"></div>
                    )}
                    <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                      {getStatusIcon(update.icon)}
                    </div>
                    <div>
                      <h4 className="font-medium">{update.status}</h4>
                      <time className="text-sm text-gray-500">{formatDate(update.date)}</time>
                      {update.notes && <p className="mt-1 text-sm text-gray-600">{update.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Request Date</p>
                    <p className="text-sm text-gray-500">{formatDate(data.created_at)}</p>
                  </div>
                </div>

                {!isExchange && (
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Refund Amount</p>
                      <p className="text-sm text-gray-500">{formatCurrency(Number.parseFloat(data.refund_amount))}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
