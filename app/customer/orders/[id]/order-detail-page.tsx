"use client"

import ErrorPage from "@/app/components/Error"
import OrderTimeline from "@/app/components/order-timeline"
import { showToast } from "@/app/components/show-toast"
import { formatCurrency, formatDate } from "@/app/lib/utils"
import LoadingScreen from "@/app/loading"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { image_base_url } from "@/contant"
import { useMobile } from "@/hooks/use-mobile"
import { apiRequest, fetchOrderById, fetchSetting } from "@/lib/api"
import { capitalize, isReturnWindowActive } from "@/lib/utils"
import { Separator } from "@radix-ui/react-separator"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeftRight, MapPin, Phone, Undo2, User } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function OrderDetailPage({ orderId }: { orderId: string }) {
  const router = useRouter()
  const isMobile = useMobile()
  const [isCancelling, setIsCancelling] = useState(false)

  const { data: order, isLoading, error } = useQuery<any>({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
  })
  const { data: setting } = useQuery<any>({
    queryKey: ["setting"],
    queryFn: () => fetchSetting(),
  
  })

  if (isLoading) return <LoadingScreen />
  if (error) return <ErrorPage />

  const cancellableStatuses = ['ORDERED', "APPROVED"]
  const canCancelOrder =order.canBeCancelled

  const cancelOrder = async () => {
    try {
      setIsCancelling(true)
      await apiRequest("orders/cancel/" + orderId, { method: "GET" })
      showToast({ description: "Order cancelled successfully" })
      setTimeout(() => router.back(), 1500)
    } catch (error: any) {
      showToast({ description: error.message, variant: "destructive" })
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="container p-0 mx-auto m-0 pb-20"> {/* extra bottom padding for mobile fixed nav */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <Card className="p-0">
           <CardHeader className="flex flex-row justify-between items-start gap-4">
  <div>
    <CardTitle className="text-xl">Order #{order.orderId}</CardTitle>
    <CardDescription>Placed on {formatDate(order.created_at)}</CardDescription>
  </div>

  <div className="flex items-center gap-2">
    {canCancelOrder && (
      <Button
        size="sm"
        variant="destructive"
        onClick={cancelOrder}
        disabled={isCancelling}
      >
        {isCancelling ? "Cancelling..." : "Cancel Order"}
      </Button>
    )}
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        order.delivery_status === "CANCELLED"
          ? "bg-red-100 text-red-700 border border-red-200"
          : ""
      }`}
    >
      {order.delivery_status === "CANCELLED" ? "Cancelled" : ""}
    </span>
  
  </div>
</CardHeader>


            <CardContent className="px-2 md:px-5 space-y-8">
                  {/* Order Items Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <div className="space-y-6">
                  {order.items.map((item: any, index: number) => {
                    const statuses = JSON.parse(item.delivery_status_updates)
                    

                    const isReturnActive =item.delivery_status.includes("DELIVERED") &&
                      isReturnWindowActive(item.delivered_date,setting.return_days??3)

                    const isReturnEligible =
                      item.is_return_eligible === "Yes" && isReturnActive && order.delivery_status !== "CANCELLED"

                    const isExchangeEligible =
                      item.is_return_eligible === "Yes" && isReturnActive && order.delivery_status !== "CANCELLED"

                    return (
                      <Card key={index} className=" overflow-hidden border rounded-lg shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {/* Product image */}
                            <div className="flex-shrink-0">
                              <Image
                                src={`${image_base_url}/storage/products/${item.product_id}/${
                                  item.variant_image ? "variants/" + item.variant_image : item.product_image
                                }`}
                                alt={item.name}
                                width={90}
                                height={90}
                                className="rounded-md object-cover border"
                              />
                            </div>

                            {/* Product details */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-sm md:text-base">{item.name}</h4>
                                  <p className="text-xs text-muted-foreground">{item.vendor_name || "Standard"}</p>

                                  {/* Attributes */}
                                  {item.original_atributes && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {Object.entries(JSON.parse(item.original_atributes || "{}")).map(([key, value]) => (
                                        <span
                                          key={key}
                                          className="px-2 py-0.5 bg-gray-100 text-xs rounded-full border text-gray-600"
                                        >
                                          {key}: {value as string}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Price + qty */}
                                <div className="text-right">
                                  <div className="font-semibold text-sm">{formatCurrency(item.sale_price)}</div>
                                  <div className="text-xs text-gray-500">Qty: {item.qty}</div>

                                  {/* Status */}
                                  {item.return_id ? (
                                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                      {capitalize(item.type + " " + item.return_status)}
                                    </span>
                                  ) : (
                                    <span style={{minWidth:100}} className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full">
                                      {capitalize(item.delivery_status)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Timeline */}
                              {statuses.length > 0 && (
                                <div className="mt-4">
                                  <OrderTimeline item_status={statuses} />
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex flex-wrap gap-2 mt-4">
                                {item.is_return_eligible === "Yes" && (
                                  <>
                                    {item.return_id ? (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() =>
                                          router.push(
                                            `/customer/${item.type === "Exchange" ? "exchanges" : "returns"}/${item.return_id}`,
                                          )
                                        }
                                      >
                                        {item.type === "Exchange" ? (
                                          <>
                                            <ArrowLeftRight className="h-4 w-4" />
                                            View Exchange Detail
                                          </>
                                        ) : (
                                          <>
                                            <Undo2 className="h-4 w-4" />
                                            View Return Detail
                                          </>
                                        )}
                                      </Button>
                                    ) : (
                                      <>
                                        {isReturnEligible && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() =>
                                              router.push(`/customer/orders/${orderId}/returns?itemId=${item.order_item_id}`)
                                            }
                                          >
                                            <Undo2 className="h-4 w-4" />
                                            Return
                                          </Button>
                                        )}
                                        {isExchangeEligible && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() =>
                                              router.push(`/customer/orders/${orderId}/exchange?itemId=${item.order_item_id}`)
                                            }
                                          >
                                            <ArrowLeftRight className="h-4 w-4" />
                                            Exchange
                                          </Button>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>


                {/* Order Summary */}
                <div className="pt-6 space-y-2 border-t mt-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatCurrency(order.shipping_cost)}</span>
                  </div>
                  {order.discount > 0 && (
  <div className="flex justify-between items-center text-green-600  rounded-lg p-0">
    <div className="flex items-center gap-3">
 
      <div className="flex flex-col">
        <span className="font-medium">Discount</span>
        {order.coupon_code && (
          <span className="text-xs text-gray-500 mt-1">
            Coupon:{" "}
            <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[11px] font-medium tracking-wide">
              {order.coupon_code}
            </span>
          </span>
        )}
      </div>
    </div>
    <span className="font-semibold text-green-700">-{formatCurrency(order.discount)}</span>
  </div>
)}
                

      

 

                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Shipping Information Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          {order.shipping_address1 && <p>{order.shipping_address1}</p>}
                          {order.shipping_address2 && <p>{order.shipping_address2}</p>}
                          <p>
                            {order.shipping_city_name}, {order.shipping_state_name} {order.shipping_pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="break-all">{order.shipping_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{order.shipping_phone_number}</span>
                      </div>
                    </div>
                  </div>

                 
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile fixed bottom nav cancel button */}
     
    </div>
  )
}
