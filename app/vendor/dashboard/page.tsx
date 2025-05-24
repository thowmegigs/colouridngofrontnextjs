import type { Metadata } from "next"
import VendorDashboardContent from "./dashboard-content"

export const metadata: Metadata = {
  title: "Vendor Dashboard | MultiVendor Marketplace",
  description: "Manage your store and products",
}

export default function VendorDashboardPage() {
  return <VendorDashboardContent />
}
