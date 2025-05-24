import type { Metadata } from "next"
import ReturnsPage from "./returns-page"

export const metadata: Metadata = {
  title: "Returns & Replacements",
  description: "Learn about our return and replacement policies",
}

export default function Page() {
  return <ReturnsPage />
}
