"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, Menu, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import VendorSidebar from "./vendor-sidebar"

export default function VendorHeader() {
  const pathname = usePathname()

  // Get page title based on pathname
  const getPageTitle = () => {
    const path = pathname.split("/").pop()

    switch (path) {
      case "dashboard":
        return "Dashboard"
      case "products":
        return "Products"
      case "add":
        return "Add Product"
      case "import":
        return "Import Products"
      case "orders":
        return "Orders"
      case "customers":
        return "Customers"
      case "financials":
        return "Financials"
      case "commissions":
        return "Commissions"
      case "withdrawals":
        return "Withdrawals"
      case "payments":
        return "Payment History"
      case "settings":
        return "Settings"
      default:
        return "Vendor Portal"
    }
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="md:hidden mr-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="mr-2">
            <Bell className="h-5 w-5" />
          </Button>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <VendorSidebar isDrawer />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
