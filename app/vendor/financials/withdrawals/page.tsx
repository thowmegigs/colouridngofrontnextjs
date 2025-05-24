import type { Metadata } from "next"
import WithdrawalsList from "./withdrawals-list"

export const metadata: Metadata = {
  title: "Withdrawals | Vendor Dashboard",
  description: "Manage your withdrawals",
}

export default function WithdrawalsPage() {
  return <WithdrawalsList />
}
