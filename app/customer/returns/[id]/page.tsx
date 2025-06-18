import type { Metadata } from "next"
import ReturnDetailPage from "./return-detail-page"

export const metadata: Metadata = {
  title: "Return Details",
  description: "View your return request details and status",
}

export default async function Page({ params }: any) {
  const { id } = await params
  return <ReturnDetailPage returnId={id} />
}
