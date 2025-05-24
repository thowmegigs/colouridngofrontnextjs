import type { Metadata } from "next"
import AddProductForm from "./add-product-form"

export const metadata: Metadata = {
  title: "Add Product | Vendor Dashboard",
  description: "Add a new product to your store",
}

export default function AddProductPage() {
  return <AddProductForm />
}
