"use client"

import SafeImage from "@/app/components/SafeImage"
import { showToast } from "@/app/components/show-toast"
import StatusIcon from "@/app/components/status-icons"
import { formatCurrency, formatDate, getStatusColor } from "@/app/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { image_base_url } from "@/contant"
import { cancelExchange, getExchangeById } from "@/lib/return-api"
import { colorNameToHex } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Package,
  RefreshCcw,
  Repeat,
  Truck,
  XCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"



interface ExchangeDetailPageProps {
  exchangeId: string
}

export default function ExchangeDetailPage({ exchangeId }: ExchangeDetailPageProps) {
  const router = useRouter()
 
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["exchange", exchangeId],
    queryFn: () => getExchangeById(exchangeId),
  
  })
  const [isCancelling, setIsCancelling] = useState(false)
  const [activeTab, setActiveTab] = useState<"details" | "tracking">("details")


  // Handle exchange cancellation
   const handleCancelExchange = async () => {
     if (!confirm("Are you sure you want to cancel this return request?")) {
       return
     }
 
     setIsCancelling(true)
     try {
       await cancelExchange(exchangeId)
       showToast({title:"Return cancelled",
        description: "Your return request has been cancelled successfully."}
       )
       refetch()
        setTimeout(()=>{
         router.replace(`/customer/orders`)
      },2000)
     } catch (error) {
       showToast({title:"Error", 
        description:error instanceof Error ? error.message : "Failed to cancel return request",
      variant:'destructive'}
        )
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

  // Get color based on exchange status


  if(isLoading)
   return <h1>Laoding</h1>
if(error)
   return <h1>error in loading</h1>
  

  return (
    <div className="container mx-auto p-0 m-0">
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-md">Exchange Id <span className="text-sm">#{data.uuid}</span></CardTitle>
                    
                  </div>
                  <CardDescription className="text-xs">
                    Requested on {formatDate(data.created_at)} for  Order #{data.order_id}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex flex-col items-end">
                  <Badge className={getStatusColor(data.return_status)} >
                    {data.return_status.includes('Cancelled')?'Cancelled':data.return_status.replace('Exchange','')}</Badge>
                </div>
                 </div>
              </div>
            </CardHeader>

            <CardContent>
                <div className="mb-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Reason</p>
                        <p className="font-medium text-xs">{data.reason}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Details</p>
                        <p className="font-medium text-xs">{data.details || "No additional details provided"}</p>
                      </div>
                    </div>
                   
                  </div>

                  <div className="mb-6">
                    <h3 className="text-md font-medium mb-3">Item Details</h3>
                    <div className="bg-muted/20 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <div className="relative h-24 w-24 rounded-md overflow-hidden">
                            <SafeImage
                              src={data.variant_id
                                ?`${image_base_url}/storage/products/${data.product_id}/variants/${data.original_variant_image}`
                                :`${image_base_url}/storage/products/${data.product_id}/${data.product_image}`
                              }
                              alt={data.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-sm">{data.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Price: {formatCurrency(data.sale_price)}
                          </p>

                          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
                            <div>
                              <p className="text-sm font-medium">Original</p>
                              {data.original_item_attributes.Size && <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm">Size: {data.original_item_attributes.Size}</span>
                              </div>}
                              {data.original_item_attributes.Color &&
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="text-sm">Color: {data.original_item_attributes.Color}</span>
                                  <div
                                    className="w-3 h-3 rounded-full border"
                                    style={{ backgroundColor: colorNameToHex(data.original_item_attributes.Color) || "#ccc" }}
                                  />
                                </div>}
                            </div>

                            <div>
                              <p className="text-sm font-medium">Exchange For</p>
                              {data.exchange_item_attributes.Size && <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm">Size: {data.exchange_item_attributes.Size}</span>
                              </div>}
                              {data.exchange_item_attributes.Color &&
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="text-sm">Color: {data.exchange_item_attributes.Color}</span>
                                  <div
                                    className="w-3 h-3 rounded-full border"
                                    style={{ backgroundColor: colorNameToHex(data.exchange_item_attributes.Color) || "#ccc" }}
                                  />
                                </div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

             
              
            </CardContent>

            <CardFooter>
              {(data.return_status === "Exchange Requested") && (
                <Button variant="destructive" onClick={handleCancelExchange} disabled={isCancelling}>
                  {isCancelling ? "Cancelling..." : "Cancel Exchange Request"}
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
                {data.return_status_updates.map((update, index) => (
                  <div key={index} className="relative pl-8">
                    {index !== data.return_status_updates.length - 1 && (
                      <div className="absolute left-[11px] top-8 h-full w-0.5 bg-gray-200"></div>
                    )}
                    <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center ">
                        <StatusIcon status={update.status} />
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
              <CardTitle className="text-lg">Exchange Summary</CardTitle>
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

               

                <Separator />

                <div className="flex items-start gap-3">
                  <Repeat className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Exchange Changes</p>
                    <div className="text-sm text-gray-500 mt-1 space-y-1">
                      {data.original_item_attributes.Size && (data.original_item_attributes.Size !==data.exchange_item_attributes.Size) && (
                        <p>
                          Size: {data.original_item_attributes.Size} → {data.exchange_item_attributes.Size}
                        </p>
                      )}
                       {data.original_item_attributes.Color && (data.original_item_attributes.Color !==data.exchange_item_attributes.Color) && (
                        <p>
                          Size: {data.original_item_attributes.Color} → {data.exchange_item_attributes.Color}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
