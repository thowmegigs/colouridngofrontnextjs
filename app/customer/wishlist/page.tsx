import type { Metadata } from "next"
import WishlistPage from "./wishlist-page"

export const metadata: Metadata = {
  title: "My Wishlist | Colour Indigo",
  description: "View and manage your wishlist items",
}

export default function WishlistPageWrapper() {
  return <WishlistPage />
}
