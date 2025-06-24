"use client"

import ErrorPage from "@/app/components/Error"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import SafeImage from "@/app/components/SafeImage"
import { formatCurrency, formatDate } from "@/app/lib/utils"
import { Button } from "@/components/ui/button"
import { image_base_url } from "@/contant"
import { fetchOrders } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { AlertCircle, CheckCircle, ChevronRight, Clock, Package, Truck } from "lucide-react"
import Link from "next/link"
import { useState } from "react"


const getStatusIcon = (status: string) => {
  switch (status) {
    case "ordered":
      return <Package className="h-5 w-5 text-primary" />
    case "processing":
      return <Clock className="h-5 w-5 text-amber-500" />
    case "shipped":
      return <Truck className="h-5 w-5 text-blue-500" />
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "cancelled":
      return <AlertCircle className="h-5 w-5 text-destructive" />
    default:
      return <Package className="h-5 w-5" />
  }
}

export default function OrderHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });;
  const filteredOrders:any = []


  if (isLoading) return <LoadingSpinner/>;
  if (isError) return <ErrorPage/>;
  return (
    <div className="container py-8">
      <div className="hidden md:flex items-center mb-8">
        <Link href="/customer/dashboard" className="text-muted-foreground hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
        <span>Order History</span>
      </div>

      <div className="hidden md:flex flex-col md:flex-row justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Order History</h1>

      
      </div>

      <div className="flex flex-col md:flex-row">
     

        <div className="flex-1">
          {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-2">No orders found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery
                      ? `No orders matching "${searchQuery}"`
                      : activeTab === "all"
                        ? "You haven't placed any orders yet"
                        : `You don't have any ${activeTab} orders`}
                  </p>
                  <Link href="/">
                    <Button>Continue Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order:any) => (
                    <div
                      key={order.id}
                      className="border rounded-lg overflow-hidden bg-white shadow hover:border-primary transition-colors"
                    >
                      <div className="p-4 border-b bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="font-medium">Order #{order.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(order.date)}
                          </div>
                        </div>
                       <div className="flex items-center justify-end">
                           
                            <Link href={`/customer/orders/${order.id}`}>
                              <Button size="sm">Show Details</Button>
                            </Link>
                          </div>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex -space-x-4 rtl:space-x-reverse">
                            {order.items.slice(0, 3).map((item, index) => {
                                const imageurl = item.variant_id
                                                ? `${image_base_url}/storage/products/${item.product_id}/variants/${item.variant_image}`
                                                : `${image_base_url}/storage/products/${item.product_id}/${item.product_image}`
                                           
                            return  <div
                                key={index}
                                className="w-12 h-12 rounded-md border overflow-hidden bg-muted flex-shrink-0"
                              >
                                <SafeImage
                                  src={imageurl}
                                  alt={item.product_name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            })}
                            {order.items.length > 3 && (
                              <div className="w-12 h-12 rounded-md border overflow-hidden bg-muted flex items-center justify-center text-xs font-medium">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm line-clamp-1">
                              {order.items
                                .slice(0, 2)
                                .map((item) => item.product_name)
                                .join(", ")}
                              {order.items.length > 2 && ` and ${order.items.length - 2} more`}
                            </div>
                            <div className="font-medium mt-1">{formatCurrency(order.total)}</div>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </div>
      </div>
    </div>
  )
}
