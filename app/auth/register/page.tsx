import type { Metadata } from "next"
import { redirect } from "next/navigation"
import RegisterForm from "./register-form"

export const metadata: Metadata = {
  title: "Register | MultiVendor Marketplace",
  description: "Create a new account",
}

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const type = searchParams.type as string

  // Validate user type
  if (type !== "customer" && type !== "vendor") {
    redirect("/auth/register?type=customer")
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto">
       
        <RegisterForm/>
      </div>
    </div>
  )
}
