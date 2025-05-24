import type { Metadata } from "next"
import OrderDetailPage from "./order-detail-page"

export const metadata: Metadata = {
  title: "Order Details",
  description: "View your order details and tracking information",
}

export default function Page({ params }: { params: { id: string } }) {
  return <OrderDetailPage orderId={params.id} />
}
