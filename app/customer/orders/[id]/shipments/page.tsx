import type { Metadata } from "next"
import ShipmentTracker from "./shipment-page"

export const metadata: Metadata = {
  title: "Create Return Request",
  description: "Request a return for your order",
}

export default async function Page({ params }: any) {
  const { id } = await params
  return <ShipmentTracker orderId={id} />
}
