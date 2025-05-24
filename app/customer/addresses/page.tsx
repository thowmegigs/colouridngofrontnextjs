import type { Metadata } from "next"
import AddressesPage from "./addresses-page"

export const metadata: Metadata = {
  title: "My Addresses | Colour Indigo",
  description: "Manage your shipping and billing addresses",
}

export default function AddressesPageWrapper() {
  return <AddressesPage />
}
