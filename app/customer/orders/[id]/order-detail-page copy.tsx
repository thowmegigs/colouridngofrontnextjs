"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
// Add the import for the tracking link
import { formatCurrency } from "@/app/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchOrderById } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Clock,
  MapPin,
  Package,
  Truck
} from "lucide-react"

type OrderDetailPageProps = {
  orderId: string
}

export default function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [returnItems, setReturnItems] = useState<any>([])
 const { data:orderData, isLoading, error } =useQuery<any>({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId, // don't run until ID exists
  });
useEffect(()=>{
    if(!isLoading && orderData){
      const t=orderData.items.filter((item:any) => item.return_id !== null)
       setReturnItems([...t]);

    }
  },[orderData,isLoading])
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching order.</div>;
  
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ordered":
        return "bg-blue-500"
      case "processing":
        return "bg-yellow-500"
      case "shipped":
        return "bg-indigo-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ordered":
        return <Clock className="h-5 w-5" />
      case "processing":
        return <AlertCircle className="h-5 w-5" />
      case "shipped":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <CheckCircle className="h-5 w-5" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getReturnStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "approved":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="flex items-center mb-6 px-4 md:px-0">
        <Link href="/customer/orders" className="mr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">Order #{orderData.orderId}</h1>
          <p className="text-sm text-muted-foreground">Placed on {orderData.created_at}</p>
        </div>
      </div>

      <div className="px-4 md:px-0 pb-20 md:pb-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="details" className="flex-1">
              Order Details
            </TabsTrigger>
            <TabsTrigger value="returns" className="flex-1">
              Returns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-0 space-y-6">
            {/* Order Status */}
            {/* Add a tracking button in the Order Status card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {orderData.timelines.map((event, index) => (
                      <div key={index} className="relative flex items-start mb-4">
                        <div
                          className={`absolute left-3 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center ${getStatusColor(event.status)} text-white z-10`}
                        >
                          {getStatusIcon(event.icon)}
                        </div>
                        <div className="ml-8">
                          <div className="font-medium">{event.status}</div>
                          <div className="text-sm text-muted-foreground">
                            {event.date} 
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link href={`/order/tracking?id=${orderData.orderId}`}>
                    <Button className="w-full flex items-center justify-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Track Your Order
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map((item:any) => (
                    <div key={item.order_item_id} className="flex flex-col sm:flex-row border rounded-lg p-4">
                      <div className="flex items-center mb-4 sm:mb-0">
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
                            {formatCurrency(item.sale_price)} x {item.qty}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:ml-auto">
                        <Badge
                          variant="outline"
                          className={`${
                            item.delivery_status === "delivered"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}
                        >
                          {item.delivery_status}
                        </Badge>
                        {item.is_return_eligible=='Yes' && 
                        (item.delivery_status==="Delivered" || item.delivery_status==="Return Cancelled") && (
               <Link href={`/customer/orders/${orderId}/returns?item=${item.order_item_id}`}>
                            <Button variant="outline" size="sm" className="ml-4">
                              Return Item
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(orderData.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{formatCurrency(orderData.shipping_cost)}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatCurrency(orderData.tax)}</span>
                    </div> */}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatCurrency(orderData.total)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="text-sm">
                    <div className="font-medium">Payment Method</div>
                    <div className="text-muted-foreground">{orderData.payment_method}</div>
                  </div>
                  {/* <Button variant="outline" size="sm" className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Invoice
                  </Button> */}
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium">Shipping Address</div>
                      <div className="text-sm text-muted-foreground">
                        <div>{orderData.shipping_name}</div>
                        <div>{orderData.shipping_address1}</div>
                        <div>{orderData.shipping_address2}</div>
                        <div>
                          {orderData.shipping_city_name}, {orderData.shipping_state_name??''}{" "}
                          {orderData.shipping_pincode}
                        </div>
                       
                      </div>
                    </div>

                    <div>
                      <div className="font-medium">Billing Address</div>
                      <div className="text-sm text-muted-foreground">
                        <div>{orderData.billing_name}</div>
                        <div>{orderData.billing_address1}</div>
                        <div>{orderData.billing_address2}</div>
                        <div>
                          {orderData.billing_city_name}, {orderData.billing_state_name??''}{" "}
                          {orderData.billing_pincode}
                        </div>
                       {/* <div>{orderData.billingAddress.country}</div> */}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="returns" className="mt-0 space-y-6">
            {returnItems.length > 0 ? (
              <div className="space-y-6">
                {returnItems.map((returnItem:any) => (
                  <Card key={returnItem.order_item_id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Return #{returnItem.return_id}</CardTitle>
                        <Badge
                          variant="outline"
                          className={`${getReturnStatusColor(returnItem.return_status)} bg-opacity-10 text-opacity-100`}
                        >
                          {returnItem.return_status}
                        </Badge>
                      </div>
                      <CardDescription>Requested on {returnItem.returned_date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                         <div key={returnItem.return_id} className="flex border rounded-lg p-4">
                            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={returnItem.image || "/placeholder.svg"}
                                alt={returnItem.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium">{returnItem.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatCurrency(returnItem.sale_price)} x {returnItem.qty}
                              </div>
                              <div className="text-sm mt-1">
                                <span className="font-medium">Reason:</span> 
                                {returnItem.return_reason}
                              </div>
                            </div>
                          </div>

                        <div className="border-t pt-4 mt-4">
                          <div className="flex justify-between font-medium">
                            <span>Refund Amount</span>
                            <span>{formatCurrency(isNaN(returnItem.refund_amount)?0.0:returnItem.refund_amount)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground mt-1">
                            <span>Refund Method</span>
                            <span>{returnItem.refund_method}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    { returnItem.return_id && 
                    <CardFooter className="border-t pt-4">
                      <Link href={`/customer/returns/${returnItem.return_id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View Return Details
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardFooter>
}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Returns</h3>
                <p className="text-muted-foreground mb-6">You haven't made any returns for this order yet.</p>
                <Link href={`/customer/orders/${orderId}`}>
                  <Button>Return to Order Details</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
