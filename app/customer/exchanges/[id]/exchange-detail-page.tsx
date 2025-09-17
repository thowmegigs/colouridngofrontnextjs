"use client"

import OrderTimeline from "@/app/components/order-timeline"
import SafeImage from "@/app/components/SafeImage"
import { showToast } from "@/app/components/show-toast"
import { formatCurrency } from "@/app/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { image_base_url } from "@/contant"
import { cancelExchange, getExchangeById } from "@/lib/return-api"
import { capitalize, colorNameToHex, formatDate } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"

import ErrorPage from "@/app/components/Error"
import { useRouter } from "next/navigation"
import { useState } from "react"
import LoadingScreen from "../../loading1"



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
      showToast({
        title: "Return cancelled",
        description: "Your return request has been cancelled successfully."
      }
      )
      refetch()
      setTimeout(() => {
        router.replace(`/customer/orders`)
      }, 2000)
    } catch (error) {
      showToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel return request",
        variant: 'destructive'
      }
      )
    } finally {
      setIsCancelling(false)
    }
  }
  // Get icon component based on status icon name


  // Get color based on exchange status


  if (isLoading)
    return <LoadingScreen />
  if (error)
    return <ErrorPage />

  const statuses = data.return_status_updates.map((st) => st.status)
  const canCancelExchange = () => {
    const status = data.return_status?.toUpperCase()
    return status === "EXCHANGE REQUESTED" || status === "APPROVED"
  }
  return (
    <div className="container mx-auto p-0 m-0">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-md"><span className="text-sm">#{data.uuid}</span></CardTitle>

                  </div>
                  <CardDescription className="text-xs">
                    Requested on {formatDate(data.created_at)}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex flex-col items-end">
                    <Badge className="bg-primary-200 text-black" >
                      {data.return_status.includes('Cancelled') ? 'Cancelled' : capitalize(data.return_status.replace('EXCHANGE', ''))}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                <div className="bg-muted/20 rounded-lg p-1">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden">
                        <SafeImage
                          src={data.variant_id
                            ? `${image_base_url}/storage/products/${data.product_id}/variants/${data.original_variant_image}`
                            : `${image_base_url}/storage/products/${data.product_id}/${data.product_image}`
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
              {canCancelExchange() && (
                <Button variant="destructive"  onClick={handleCancelExchange} disabled={isCancelling}>
                  {isCancelling ? "Cancelling..." : "Cancel Exchange Request"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div>

          <OrderTimeline item_status={statuses} type="exchange" orientation="vertical" />



        </div>
      </div>
    </div>
  )
}
