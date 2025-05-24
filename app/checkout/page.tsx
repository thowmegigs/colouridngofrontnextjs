import type { Metadata } from "next"
import CheckoutPage from "./checkout-page"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase",
}

export default function Page() {
  return <CheckoutPage />
}
