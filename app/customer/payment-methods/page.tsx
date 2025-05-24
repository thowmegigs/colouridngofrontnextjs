import type { Metadata } from "next"
import PaymentMethodsPage from "./payment-methods-page"

export const metadata: Metadata = {
  title: "Payment Methods | Colour Indigo",
  description: "Manage your payment methods",
}

export default function PaymentMethodsPageWrapper() {
  return <PaymentMethodsPage />
}
