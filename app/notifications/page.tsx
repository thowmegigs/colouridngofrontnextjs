import type { Metadata } from "next"
import NotificationPage from "./notification"

export const metadata: Metadata = {
  title: "Notifications | Colour Indigo",
  description: "Notifcations",
}

export default function Page() {
  return <NotificationPage />
}
