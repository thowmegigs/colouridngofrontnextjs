"use client"

import SafeImage from "@/app/components/SafeImage"
import ShipmentTimeline from "@/app/components/ShipmentTimeline"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { api_url, image_base_url } from "@/contant"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { CheckCircle, Clock, Package, Truck } from "lucide-react"

const getStatusConfig = (status: string) => {
  switch (status) {
    case "delivered":
      return {
        label: "Delivered",
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-green-600",
      }
    case "in_transit":
      return {
        label: "In Transit",
        variant: "secondary" as const,
        icon: Truck,
        color: "text-blue-600",
      }
    case "processing":
      return {
        label: "Processing",
        variant: "outline" as const,
        icon: Clock,
        color: "text-orange-600",
      }
    default:
      return {
        label: "Unknown",
        variant: "outline" as const,
        icon: Package,
        color: "text-gray-600",
      }
  }
}

export default function ShipmentTracker({ orderId }: { orderId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["order-shipments", orderId],
    queryFn: async () => {
      const res = await axios.get(`${api_url}/orders/shipment/${orderId}`, { withCredentials: true })
      return res.data.data
    },
  })

  if (isLoading) return <div className="text-center py-10">Loading shipment data...</div>
  if (error) return <div className="text-center text-red-600 py-10">Failed to load data.</div>
  const shipmentData = [
    { code: 19, date: "2025-05-28" },
    { code: 6, date: "2025-05-29" },
    { code: 18, date: "2025-05-30" },
    { code: 17, date: "2025-06-01" },
    { code: 7, date: "2025-06-02" },
  ];
  console.log('data', data)
  return (
    <div className="max-w-4xl mx-auto">
      {/* Order Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Shipments</h1>
            <p className="text-gray-600 mt-1">
              Order ID: <span className="font-semibold"> {orderId}</span>
            </p>
            {/* <p className="text-sm text-gray-500">Placed on {orderDate}</p> */}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span>{data.result.length} Shipments</span>
          </div>
        </div>
      </div>

      {/* Shipments List */}
      <div className="space-y-6">
        {data.result.map((shipment, index) => {
          const statusConfig = getStatusConfig('New')
          const StatusIcon = statusConfig.icon

          return (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{shipment.vendor_name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Shipment ID: {shipment.shipment_id}</span>
                      <span>•</span>
                      <span>Shipping Carrier</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                      <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Tracking Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Order Shipping Status</span>
                      </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Estimated Delivery:</span> {shipment.estimated_delivery}
                    </div>
                    {shipment.delivered_date && (
                      <div className="text-sm text-green-600">
                        <span className="font-medium">Delivered:</span> {shipment.delivered_date}
                      </div>
                    )}
                    <ShipmentTimeline
                      statuses={shipmentData}
                      currentStatusCode={7}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Items in this shipment ({shipment.items.length})
                  </h4>
                  <div className="space-y-3">
                    {shipment.items.map((item,index) => {
                      const imageurl = item.variant_id
                        ? `${image_base_url}/storage/products/${item.product_id}/variants/${item.variant_image}`
                        : `${image_base_url}/storage/products/${item.product_id}/${item.product_image}`

                      return <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <SafeImage
                            src={imageurl}
                            alt={"sdg"}
                            width={60}
                            height={60}
                            className="rounded-md object-cover border"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-gray-900 truncate">{item.name}</h5>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span className="font-semibold text-gray-900">${item.sale_price}</span>
                          </div>
                        </div>
                      </div>
                    })}
                  </div>
                </div>

                {/* Shipment Total */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Shipment Total:</span>
                    <span className="font-bold text-lg">
                      ₹{shipment.amount}
                    </span>
                   
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
 
      {/* Order Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900">Order Total</h3>
              <p className="text-sm text-gray-600">
                ₹{data.order.net_payable}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ₹{data.order.total_amount}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
