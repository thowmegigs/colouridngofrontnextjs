import type { Metadata } from "next"
import ProductList from "./product-list"

export const metadata: Metadata = {
  title: "Products | Vendor Dashboard",
  description: "Manage your products",
}

export default function ProductsPage() {
  return <ProductList />
}
