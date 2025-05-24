import type React from "react"

import ProtectedRoute from "@/app/components/protected-route"
import CustomerHeader from "./components/customer-header"
import CustomerMobileNav from "./components/customer-mobile-nav"
import CustomerSidebar from "./components/customer-sidebar"

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <CustomerHeader />
        <div className="flex flex-1">
          <div className="hidden md:block w-64 bg-white border-r">
            <CustomerSidebar />
          </div>
          <main className="flex-1 p-4 md:p-6 bg-gray-50">{children}</main>
        </div>
        <CustomerMobileNav />
      </div>
    </ProtectedRoute>
  )
}
