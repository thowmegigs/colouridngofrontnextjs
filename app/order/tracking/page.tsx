import type { Metadata } from "next"
import OrderTrackingPage from "./order-tracking-page"

export const metadata: Metadata = {
  title: "Track Your Order | Colour Indigo",
  description: "Track the status and location of your order",
}

export default function OrderTrackingWrapper({ searchParams }: { searchParams: { id?: string } }) {
  return <OrderTrackingPage orderId={searchParams.id || "ORD-12345"} />
}
