import type { Metadata } from "next"
import OrderReturnPage from "./order-return-page"

export const metadata: Metadata = {
  title: "Create Return Request",
  description: "Request a return for your order",
}

export default function Page({ params }: { params: { id: string } }) {
  return <OrderReturnPage orderId={params.id} />
}
