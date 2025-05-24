import type { Metadata } from "next"
import OrderList from "./order-list"

export const metadata: Metadata = {
  title: "Orders | Vendor Dashboard",
  description: "Manage your orders",
}

export default function OrdersPage() {
  return <OrderList />
}
