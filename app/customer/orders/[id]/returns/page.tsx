import type { Metadata } from "next"
import OrderReturnPage from "./order-return-page"

export const metadata: Metadata = {
  title: "Create Return Request",
  description: "Request a return for your order",
}

export default async function Page({ params }: any) {
  const { id } = await params
  return <OrderReturnPage orderId={id} />
}
