import type { Metadata } from "next"
import LoginForm from "./login-form"

export const metadata: Metadata = {
  title: "Login | Colourindigo",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4  bg-transparent">
      <div className="max-w-md mx-auto">
        {/* <h1 className="text-2xl font-bold text-center mb-6">Login to Your Account</h1> */}
       {/* <Suspense fallback={<div>Loading...</div>}> */}
      
        <LoginForm />
         {/* </Suspense> */}
      </div>
    </div>
  )
}
