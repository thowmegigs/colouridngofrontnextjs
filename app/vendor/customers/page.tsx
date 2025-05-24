import type { Metadata } from "next"
import CustomersList from "./customers-list"

export const metadata: Metadata = {
  title: "Customers | Vendor Dashboard",
  description: "Manage your customers",
}

export default function CustomersPage() {
  return <CustomersList />
}
