import type { Metadata } from "next"
import CartPage from "./cart-page"

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review and manage items in your shopping cart",
}

export default function Page() {
  return <CartPage />
}
