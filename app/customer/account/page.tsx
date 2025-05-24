import type { Metadata } from "next"
import AccountDetailsPage from "./account-details-page"

export const metadata: Metadata = {
  title: "Account Details | Colour Indigo",
  description: "Manage your account details and preferences",
}

export default function AccountDetailsPageWrapper() {
  return <AccountDetailsPage />
}
