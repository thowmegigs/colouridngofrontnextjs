import type { ReactNode } from "react"
import VendorSidebar from "./components/vendor-sidebar"
import VendorHeader from "./components/vendor-header"
import VendorMobileNav from "./components/vendor-mobile-nav"

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <VendorSidebar />
      </div>

      <div className="flex-1">
        <VendorHeader />
        <main className="p-0 md:p-6 w-full">{children}</main>

        {/* Mobile navigation */}
        <div className="md:hidden">
          <VendorMobileNav />
        </div>
      </div>
    </div>
  )
}
