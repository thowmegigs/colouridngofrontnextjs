import { redirect } from "next/navigation"

export default function ExchangesPage() {
  // Redirect to the returns page which handles both returns and exchanges
  redirect("/customer/returns")
}
