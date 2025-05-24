import type { Metadata } from "next"
import LoginForm from "./login-form"

export const metadata: Metadata = {
  title: "Login | MultiVendor Marketplace",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto">
        {/* <h1 className="text-2xl font-bold text-center mb-6">Login to Your Account</h1> */}
        <LoginForm />
      </div>
    </div>
  )
}
