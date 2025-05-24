import type { Metadata } from "next"
import CheckoutAuthPage from "./checkout-auth-page"


export const metadata: Metadata = {
  title: "Sign In to Continue",
  description: "Sign in or create an account to continue to checkout",
}

export default function Page() {
  return <CheckoutAuthPage />
}
