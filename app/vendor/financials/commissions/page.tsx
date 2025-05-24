import type { Metadata } from "next"
import CommissionsList from "./commissions-list"

export const metadata: Metadata = {
  title: "Commissions | Vendor Dashboard",
  description: "View your commission details",
}

export default function CommissionsPage() {
  return <CommissionsList />
}
