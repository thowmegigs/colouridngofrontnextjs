// components/ErrorPage.tsx
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function ErrorPage({
  title = "Something went wrong",
  message = "We're working to fix it. Please try again later.",
   // customizable
}: {
  title?: string
  message?: string
 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-md text-center space-y-6">
       
        <div className="flex justify-center">
          <AlertTriangle className="h-10 w-10 text-[#ae1313]" />
        </div>
        <h1 className="text-3xl font-bold text-[#ae1313]">{title}</h1>
        <p className="text-[#ae1313]">{message}</p>
        <Link
          href="/"
          className="inline-block bg-[#ae1313] hover:bg-[#ae1313] text-white font-medium px-6 py-2 rounded-md transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
