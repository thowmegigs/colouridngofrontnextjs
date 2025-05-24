import type { Metadata } from "next"
import ReturnHistoryPage from "./return-history-page"

export const metadata: Metadata = {
  title: "My Returns",
  description: "View your return history and track your return requests",
}

export default function Page() {
  return <ReturnHistoryPage />
}
