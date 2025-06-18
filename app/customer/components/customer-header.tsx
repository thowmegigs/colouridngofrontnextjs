"use client"

import { usePathname } from "next/navigation"

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
    
    </header>
  )
}
