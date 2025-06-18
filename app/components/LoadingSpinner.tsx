import { Loader2 } from "lucide-react"

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  )
}