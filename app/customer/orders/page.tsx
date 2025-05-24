import type { Metadata } from "next"
import OrderHistoryPage from "./order-history-page"

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history and track your purchases",
}

export default function Page() {
  return <OrderHistoryPage />
}
