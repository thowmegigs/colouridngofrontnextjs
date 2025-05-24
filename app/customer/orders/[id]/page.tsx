import type { Metadata } from "next"
import OrderDetailPage from "./order-detail-page"

export const metadata: Metadata = {
  title: "Order Details | Colour Indigo",
  description: "View your order details and track your shipment",
}

export default function OrderDetailPageWrapper({ params }: { params: { id: string } }) {
  return <OrderDetailPage orderId={params.id} />
}
