import type { Metadata } from "next"

import AddPaymentDetails from "./payment-page.tsx"

export const metadata: Metadata = {
  title: "Payment Methods | Colour Indigo",
  description: "Manage your payment methods",
}

export default function PaymentMethodsPageWrapper() {
  return <AddPaymentDetails />
}
