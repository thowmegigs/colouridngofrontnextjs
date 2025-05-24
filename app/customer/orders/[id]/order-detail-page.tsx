"use client"

import { formatCurrency, formatDate } from "@/app/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useMobile } from "@/hooks/use-mobile"
import { fetchOrderById } from "@/lib/api"
import { colorNameToHex } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  MapPin,
  Package,
  Phone,
  RefreshCcw,
  Truck,
  User
} from "lucide-react"
import Image from "next/image"
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Processing":
        return "bg-blue-100 text-blue-800"
      case "Shipped":
        return "bg-purple-100 text-purple-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get icon based on order status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <AlertCircle className="h-5 w-5" />
      case "Processing":
        return <Package className="h-5 w-5" />
      case "Shipped":
        return <Truck className="h-5 w-5" />
      case "Delivered":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  // Tab options for the select dropdown
  const tabOptions = [
    { value: "items", label: "Items" },
    { value: "shipping", label: "Shipping" },
    // { value: "payment", label: "Payment" },
    { value: "returns", label: "Returns & Exchanges" },
  ]
if(isLoading){
  return <h1>loading.....</h1>
}
if(error){
  return <h1>error.....</h1>
}
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <CardTitle className="text-xl">Order #{order.orderId}</CardTitle>
                <CardDescription>Placed on {formatDate(order.created_at)}</CardDescription>
              </div>
              <div className="flex flex-col items-end">
                <Badge className={getStatusColor(order.delivery_status)}>{order.delivery_status}</Badge>
                {/* <Button variant="link" size="sm" className="h-auto p-0 mt-1">
                  <Download className="h-4 w-4 mr-1" /> Invoice
                </Button> */}
              </div>
            </CardHeader>

            <CardContent>
              {/* Responsive Tabs - Dropdown for Mobile, Tabs for Desktop */}
              {isMobile ? (
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
              ) : (
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
              )}

              {activeTab === "items" && (
                <div className="space-y-6">
                  {order.items.map((item: any,index:any) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row gap-4 pb-4 border-b last:border-0"
                    >
                      <div className="flex-shrink-0">
                        <div className="relative h-24 w-24 rounded-md overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg?height=96&width=96&query=product"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              {item.original_atributes?.Size && <span className="text-sm text-muted-foreground">Size: {item.original_atributes?.Size}</span>}
                              {item.original_atributes?.Color && (
                                <div className="flex items-center gap-1">
                                  <span className="text-sm text-muted-foreground">Color: {item.original_atributes?.Color}</span>
                                  <div
                                    className="w-3 h-3 rounded-full border"
                                    style={{ backgroundColor:colorNameToHex(item.original_atributes?.Color) || "#ccc" }}
                                  />
                                </div>
                              )}
                            </div>
                            <p className="text-sm mt-1">
                              {formatCurrency(item.sale_price)} x {item.qty}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0 sm:text-right">
                            <p className="font-medium">{formatCurrency(item.sale_price * item.qty)}</p>

                            {/* Return/Exchange Options */}
                            {order.delivery_status === "Delivered" && !item.return_id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="mt-2">
                                    <RefreshCcw className="h-4 w-4 mr-1" /> Return Options
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/customer/orders/${order.orderId}/returns?itemId=${item.order_item_id}`}
                                    >
                                      Return Item
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/customer/orders/${order.orderId}/exchange?itemId=${item.order_item_id}`}>
                                      Exchange Item
                                    </Link>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}

                            {item.return_id && (
                              <Badge variant="outline" className="mt-2">
                                {item.type=='Exchange' ? "Exchanged" : "Returned"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

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
                        {returnItems.map((item:any) => (
                          <Card key={item.return_id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="flex flex-col border-b">
                                <div className="p-4 flex-grow">
                                  <div className="flex gap-4">
                                    <div className="flex-shrink-0 hidden sm:block">
                                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                        <Image
                                          src={item.image || "/placeholder.svg?height=64&width=64&query=product"}
                                          alt={item.name}
                                          fill
                                          className="object-cover"
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
                                            <Badge variant={item.type === "Exchange" ? "outline" : "default"}>
                                              {item.type}
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {new Date(item.returned_date).toLocaleDateString()}
                                          </p>
                                        </div>
                                        <Badge className={getStatusColor(item.return_status)}>{item.return_status}</Badge>
                                      </div>

                                      <div className="mt-3">
                                        <p className="text-sm">
                                          <span className="text-muted-foreground">Item:</span> {item.name}
                                        </p>
                                        <p className="text-sm">
                                          <span className="text-muted-foreground">Reason:</span> {item.reason}
                                        </p>

                                        {item.type === "Return" && item.refund_amount && (
                                          <p className="text-sm">
                                            <span className="text-muted-foreground">Refund Amount:</span>{" "}
                                            {formatCurrency(item.refund_amount)}
                                          </p>
                                        )}

                                        {item.type === "Exchange" &&  (
                                          <div className="text-sm mt-1">
                                           {item.original_atributes.Size && (item.original_atributes.Size !==item.exchange_atributes.Size) && (
                                              <p>
                                                <span className="text-muted-foreground">Size:</span>{" "}
                                                {item.original_atributes.Size} → {item.exchange_atributes.Size}
                                              </p>
                                            )}
                                            {item.original_atributes.Color && (item.original_atributes.Color !== item.exchange_atributes.Color) && (
                                              <p>
                                                <span className="text-muted-foreground">Color:</span>{" "}
                                                 {item.original_atributes.Color} → {item.exchange_atributes.Color}
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
                                        : `${window.location.origin}/customer/exchange/${item.return_id}`
                                       
                                    }
                                  >
                                    View Details
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
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

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-6">
                {order.timelines.map((update, index) => (
                  <div key={index} className="relative pl-8">
                    {index !== order.timelines.length - 1 && (
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
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Track Order
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Return Items
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Report an Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
