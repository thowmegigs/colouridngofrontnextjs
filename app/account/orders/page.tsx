import type { Metadata } from "next"
import OrderHistoryPage from "./order-history-page"

export const metadata: Metadata = {
  title: "Order History",
  description: "View your order history and track your purchases",
}

export default function Page() {
  return <OrderHistoryPage />
}
