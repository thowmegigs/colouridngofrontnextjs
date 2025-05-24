import type { Metadata } from "next"
import { Suspense } from "react"
import OrderSuccessPage from "./order-success-page"

export const metadata: Metadata = {
  title: "Order Successful",
  description: "Your order has been successfully placed",
}

export default function Page() {
  return    <Suspense fallback={<div>Loading...</div>}>
    <OrderSuccessPage />
    </Suspense>
}
