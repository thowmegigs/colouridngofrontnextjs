import type { Metadata } from "next"
import CreateReturnPage from "./create-return-page"

export const metadata: Metadata = {
  title: "Create Return Request",
  description: "Request a return for your order",
}

export default function Page({ searchParams }: { searchParams: { orderId?: string } }) {
  return <CreateReturnPage orderId={searchParams.orderId} />
}
