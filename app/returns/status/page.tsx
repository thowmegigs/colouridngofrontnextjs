import type { Metadata } from "next"
import ReturnStatusPage from "./return-status-page"

export const metadata: Metadata = {
  title: "Return Request Status",
  description: "Check the status of your return requests",
}

export default function Page() {
  return <ReturnStatusPage />
}
