// "use client"

// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { api_url } from "@/contant"
// import { useQuery } from "@tanstack/react-query"
// import axios from "axios"
// import { CheckCircle, Clock, MapPin, Package, Truck } from "lucide-react"
// import Image from "next/image"

// const getStatusConfig = (status: string) => {
//   switch (status) {
//     case "delivered":
//       return {
//         label: "Delivered",
//         variant: "default" as const,
//         icon: CheckCircle,
//         color: "text-green-600",
//       }
//     case "in_transit":
//       return {
//         label: "In Transit",
//         variant: "secondary" as const,
//         icon: Truck,
//         color: "text-blue-600",
//       }
//     case "processing":
//       return {
//         label: "Processing",
//         variant: "outline" as const,
//         icon: Clock,
//         color: "text-orange-600",
//       }
//     default:
//       return {
//         label: "Unknown",
//         variant: "outline" as const,
//         icon: Package,
//         color: "text-gray-600",
//       }
//   }
// }

// export default function ShipmentTracker({ orderId }: { orderId: string }) {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["order-shipments", orderId],
//     queryFn: async () => {
//       const res = await axios.get(`${api_url}/orders/shipment/${orderId}`)
//       return res.data
//     },
//   })

//   if (isLoading) return <div className="text-center py-10">Loading shipment data...</div>
//   if (error) return <div className="text-center text-red-600 py-10">Failed to load data.</div>

//   const { orderId: id, orderDate, shipments } = data

//   return (
//     <div className="max-w-4xl mx-auto p-4 space-y-6">
//       {/* Order Header */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Order Shipments {orderId}</h1>
//             <p className="text-gray-600 mt-1">
//               Order ID: <span className="font-semibold">{id}</span>
//             </p>
//             <p className="text-sm text-gray-500">Placed on {orderDate}</p>
//           </div>
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Package className="h-4 w-4" />
//             <span>{shipments.length} Shipments</span>
//           </div>
//         </div>
//       </div>

//       {/* Shipments List */}
//       <div className="space-y-6">
//         {shipments.map((shipment) => {
//           const statusConfig = getStatusConfig(shipment.status)
//           const StatusIcon = statusConfig.icon

//           return (
//             <Card key={shipment.id} className="overflow-hidden">
//               <CardHeader className="bg-gray-50 border-b">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                   <div className="space-y-1">
//                     <CardTitle className="text-lg">{shipment.vendor}</CardTitle>
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <span>Shipment ID: {shipment.id}</span>
//                       <span>•</span>
//                       <span>{shipment.carrier}</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <Badge variant={statusConfig.variant} className="flex items-center gap-1">
//                       <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
//                       {statusConfig.label}
//                     </Badge>
//                   </div>
//                 </div>
//               </CardHeader>

//               <CardContent className="p-6">
//                 {/* Tracking Info */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2 text-sm">
//                       <MapPin className="h-4 w-4 text-gray-500" />
//                       <span className="font-medium">Tracking Number:</span>
//                       <span className="font-mono text-blue-600">{shipment.trackingNumber}</span>
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       <span className="font-medium">Estimated Delivery:</span> {shipment.estimatedDelivery}
//                     </div>
//                     {shipment.actualDelivery && (
//                       <div className="text-sm text-green-600">
//                         <span className="font-medium">Delivered:</span> {shipment.actualDelivery}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <Separator className="my-4" />

//                 {/* Items */}
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                     <Package className="h-4 w-4" />
//                     Items in this shipment ({shipment.items.length})
//                   </h4>
//                   <div className="space-y-3">
//                     {shipment.items.map((item) => (
//                       <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
//                         <div className="flex-shrink-0">
//                           <Image
//                             src={item.image || "/placeholder.svg"}
//                             alt={item.name}
//                             width={60}
//                             height={60}
//                             className="rounded-md object-cover border"
//                           />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h5 className="font-medium text-gray-900 truncate">{item.name}</h5>
//                           <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
//                             <span>Qty: {item.quantity}</span>
//                             <span>•</span>
//                             <span className="font-semibold text-gray-900">${item.price}</span>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Shipment Total */}
//                 <div className="mt-4 pt-4 border-t">
//                   <div className="flex justify-between items-center">
//                     <span className="font-medium text-gray-900">Shipment Total:</span>
//                     <span className="font-bold text-lg">
//                       ${shipment.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>

//       {/* Order Summary */}
//       <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
//         <CardContent className="p-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h3 className="font-semibold text-gray-900">Order Total</h3>
//               <p className="text-sm text-gray-600">
//                 {shipments.reduce((total, shipment) => total + shipment.items.length, 0)} items across {shipments.length} shipments
//               </p>
//             </div>
//             <div className="text-right">
//               <div className="text-2xl font-bold text-gray-900">
//                 $
//                 {shipments
//                   .reduce(
//                     (total, shipment) =>
//                       total +
//                       shipment.items.reduce((shipmentTotal, item) => shipmentTotal + item.price * item.quantity, 0),
//                     0,
//                   )
//                   .toFixed(2)}
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
