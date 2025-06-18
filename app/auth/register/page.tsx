import type { Metadata } from "next"
import RegisterForm from "./register-form"

export const metadata: Metadata = {
  title: "Register | Colourindigo Marketplace",
  description: "Create a new account",
}

export default function RegisterPage() {
  

  return (
    <div className="container mx-auto px-4 py-10 bg-transparent">
      <div className="max-w-md mx-auto">
       
        <RegisterForm/>
      </div>
    </div>
  )
}
