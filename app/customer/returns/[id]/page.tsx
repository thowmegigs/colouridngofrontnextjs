import type { Metadata } from "next"
import ReturnDetailPage from "./return-detail-page"

export const metadata: Metadata = {
  title: "Return Details",
  description: "View your return request details and status",
}

export default function Page({ params }: { params: { id: string } }) {
  return <ReturnDetailPage returnId={params.id} />
}
