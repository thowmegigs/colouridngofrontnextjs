"use client"

import ErrorPage from "@/app/components/Error"
import OrderItemCard from "@/app/components/order-item-card"
import SafeImage from "@/app/components/SafeImage"
import { formatCurrency, formatDate, getStatusColor } from "@/app/lib/utils"
import LoadingScreen from "@/app/loading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { image_base_url } from "@/contant"
import { useMobile } from "@/hooks/use-mobile"
import { fetchOrderById } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import {
  MapPin,
  Phone,
  RefreshCcw,
  Truck,
  User
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Dummy order data


type TabType = "items" | "shipping" | "payment" | "returns"

export default function OrderDetailPage({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("items")
  const isMobile = useMobile()
    const [returnItems, setReturnItems] = useState<any>([])
const { data:order, isLoading, error } =useQuery<any>({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId, // don't run until ID exists
  });
  // Use dummy data
 useEffect(()=>{
     if(!isLoading && order){
       const t=order.items.filter((item:any) => item.return_id !== null)
        setReturnItems([...t]);
 
     }
   },[order,isLoading])

  // Get color based on order status
 

  // Get icon based on order status


  // Tab options for the select dropdown
  const tabOptions = [
    { value: "items", label: "Items" },
    { value: "shipping", label: "Shipping To" },
    // { value: "payment", label: "Payment" },
    { value: "returns", label: "Returns & Exchanges" },
  ]
  
if(isLoading){
  return <LoadingScreen/>
}
if(error){
  return <ErrorPage/>
}
  return (
    <div className="container p-0 mx-auto m-0">
     

      <div className="grid grid-cols-1  gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <Card className="p-0">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <CardTitle className="text-xl">Order #{order.orderId}</CardTitle>
                <CardDescription>Placed on {formatDate(order.created_at)}</CardDescription>
              </div>
            
            </CardHeader>

            <CardContent>
              {/* Responsive Tabs - Dropdown for Mobile, Tabs for Desktop */}
              {/* {isMobile ? (
                <div className="mb-4">
                  <Select value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select tab" />
                    </SelectTrigger>
                    <SelectContent>
                      {tabOptions.map((tab) => (
                        <SelectItem key={tab.value} value={tab.value}>
                          {tab.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : ( */}
                <div className="flex border-b mb-4 overflow-x-auto scrollbar-hide">
                  {tabOptions.map((tab) => (
                    <Button
                      key={tab.value}
                      variant="ghost"
                      className={`pb-2 rounded-none whitespace-nowrap ${
                        activeTab === tab.value ? "border-b-2 border-primary" : "text-muted-foreground"
                      }`}
                      onClick={() => setActiveTab(tab.value as TabType)}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>
              {/* // )} */}

              {activeTab === "items" && (
                <div className="space-y-6">
                  {order.items.map((item: any,index:any) => {
                                                              
                    return  <OrderItemCard key={index}  item={item} index={index} imageBaseUrl={ image_base_url} 
                    orderId={order.id} orderUid={orderId} />
})}

                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{formatCurrency(order.shipping_cost)}</span>
                    </div>
                   
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(order.discount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          {order.shipping_address1 && <p>{order.shipping_address1}</p>}
                          {order.shipping_address2 && <p>{order.shipping_address2}</p>}
                        
                          <p>
                            {order.shipping_city_name}, {order.shipping_state_name}{" "}
                            {order.shipping_pincode}
                          </p>
                         
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Contact Information</h3>
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

                  {order.tracking_number && (
                    <div>
                      <h3 className="font-medium mb-2">Tracking Information</h3>
                      <div className="bg-muted p-3 rounded-md">
                        <div className="flex items-start gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="break-all">
                              Tracking Number: <span className="font-medium">445555</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Carrier:  "Standard Shipping"
                            </p>
                            <Button variant="link" size="sm" className="h-auto p-0 mt-1">
                              Track Package
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "payment" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className="bg-muted p-3 rounded-md">
                      <p>{order.payment_method}</p>
                     
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Billing Address</h3>
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          {order.billing_address1 && <p>{order.billing_address1}</p>}
                          {order.billing_address2 && <p>{order.billing_address2}</p>}
                        
                          <p>
                            {order.billing_city_name}, {order.billing_state_name}{" "}
                            {order.billing_pincode}
                          </p>
                         
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{formatCurrency(order.shipping_cost)}</span>
                    </div>
                   
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(order.discount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "returns" && (
                <div className="space-y-6">
                  {returnItems.length > 0 ? (
                    <>
                      <h3 className="font-medium mb-4">Returns & Exchanges</h3>
                      <div className="space-y-4">
                        {returnItems.map((item:any) =>
                         {
                             const imageurl = item.variant_id
                                             ? `${image_base_url}/storage/products/${item.product_id}/variants/${item.variant_image}`
                                                                    : `${image_base_url}/storage/products/${item.product_id}/${item.product_image}`
                    const original_attributes=item.original_atributes?JSON.parse(item.original_atributes):null
                    const exchange_attributes=item.exchange_atributes?JSON.parse(item.exchange_atributes):null
                 

                         return  <Card key={item.return_id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="flex flex-col border-b">
                                <div className="p-4 flex-grow">
                                  <div className="flex gap-4">
                                    <div className="flex-shrink-0  sm:block">
                                      
                                      <div className="relative h-16 w-16 rounded-md">
                                        <SafeImage
                                          src={imageurl}
                                          alt={item.name}
                                         width={200}
                                         height={200}
                                          className=" w-full h-auto object-fit"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex-grow">
                                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                        <div>
                                          <div className="flex items-center flex-wrap gap-2">
                                            <h4 className="font-medium">
                                              {item.type} #{item.return_id}
                                            </h4>
                                            
                                          </div>
                                          <p className="text-xs text-muted-foreground mt-1">
                                            {formatDate(item.returned_date)}
                                          </p>
                                        </div>
                                        <Badge className={`${getStatusColor(item.return_status)} max-w-[150px] justify-center`}>
                                          {item.return_status.includes('Cancelled')?'Cancelled':item.return_status}</Badge>
                                      </div>

                                      <div className="mt-3">
                                        <p className="text-sm">
                                          <span className="text-muted-foreground">Item:</span> {item.name}
                                        </p>
                                        <p className="text-sm">
                                          <span className="text-muted-foreground">Reason:</span> {item.return_reason}
                                        </p>

                                        {item.type === "Return" && item.refund_amount && (
                                          <p className="text-sm">
                                            <span className="text-muted-foreground">Refund Amount:</span>{" "}
                                            {formatCurrency(item.refund_amount)}
                                          </p>
                                        )}

                                        {item.type === "Exchange" &&  (
                                          <div className="text-sm mt-1">
                                           {original_attributes?.Size && (original_attributes?.Size !==exchange_attributes?.Size) && (
                                              <p>
                                                <span className="text-muted-foreground">Size:</span>{" "}
                                                {original_attributes?.Size} → {exchange_attributes?.Size}
                                              </p>
                                            )}
                                            {original_attributes?.Color && (original_attributes?.Color !== exchange_attributes?.Color) && (
                                              <p>
                                                <span className="text-muted-foreground">Color:</span>{" "}
                                                 {original_attributes?.Color} → {exchange_attributes?.Color}
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="p-3 bg-muted/30 flex justify-end">
                                <Button variant="outline" size="sm" asChild>
                                  <Link
                                    href={
                                      item.type === "Return"
                                        ? `${window.location.origin}/customer/returns/${item.return_id}`
                                        : `${window.location.origin}/customer/exchanges/${item.return_id}`
                                       
                                    }
                                  >
                                    View Details
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
})}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <RefreshCcw className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-lg font-medium">No Returns or Exchanges</h3>
                      <p className="text-muted-foreground mt-1">
                        You haven't made any returns or exchanges for this order yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-6 h-[300px] overflow-y-auto">
                {order.timelines && Array.isArray(order.timelines) && order?.timelines?.map((update, index) => (
                  <div key={index} className="relative pl-8">
                    {index !== order.timelines.length - 1 && (
                      <div className="absolute left-[11px] top-8 h-full w-0.5 bg-gray-200"></div>
                    )}
                    <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white ">
                      <StatusIcon status={update.status} />
                    </div>
                    <div>
                      <h4 className="font-medium">{capitalize(update.status??update.name)}</h4>
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
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" onClick={()=>router.push(`${orderId}/shipments`)} className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Track Order
                </Button>
               
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  )
}
