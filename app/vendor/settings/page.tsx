import type { Metadata } from "next"
import VendorSettings from "./vendor-settings"

export const metadata: Metadata = {
  title: "Vendor Settings",
  description: "Manage your vendor account settings",
}

export default function Page() {
  return <VendorSettings />
}
