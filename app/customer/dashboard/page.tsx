import type { Metadata } from "next"
import CustomerDashboardContent from "./dashboard-content"

export const metadata: Metadata = {
  title: "Customer Dashboard | MultiVendor Marketplace",
  description: "Manage your orders and account",
}

export default function CustomerDashboardPage() {
  return <CustomerDashboardContent />
}
