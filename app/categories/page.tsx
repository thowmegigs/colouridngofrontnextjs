import type { Metadata } from "next"
import CategoriesPage from "./categories-page"

export const metadata: Metadata = {
  title: "Categories | MultiVendor Marketplace",
  description: "Browse all product categories",
}

export default function Page() {
  return <CategoriesPage />
}
