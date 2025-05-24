"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Bell, ChevronLeft, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import CustomerSidebar from "./customer-sidebar"

export default function CustomerHeader() {
  const pathname = usePathname()

  // Get page title based on pathname
  const getPageTitle = () => {
    const path = pathname.split("/").pop()

    switch (path) {
      case "dashboard":
        return "Dashboard"
      case "orders":
        return "My Orders"
      case "wishlist":
        return "My Wishlist"
      case "addresses":
        return "My Addresses"
     
      case "account":
        return "Account Details"
      default:
        return "My Account"
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
                <CustomerSidebar isDrawer />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
