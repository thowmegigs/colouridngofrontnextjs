import type { Metadata } from "next"
import ImportProductsForm from "./import-products-form"

export const metadata: Metadata = {
  title: "Import Products | Vendor Dashboard",
  description: "Import products from Excel or CSV",
}

export default function ImportProductsPage() {
  return <ImportProductsForm />
}
