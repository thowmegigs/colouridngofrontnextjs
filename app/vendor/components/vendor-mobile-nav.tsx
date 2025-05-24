"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Users, DollarSign, Settings, Store } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function VendorMobileNav() {
  const pathname = usePathname()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const menuItems = [
    {
      title: "Dashboard",
      path: "/vendor/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Products",
      path: "/vendor/products",
      icon: <Package size={20} />,
    },
    {
      title: "Orders",
      path: "/vendor/orders",
      icon: <ShoppingCart size={20} />,
    },
    {
      title: "Customers",
      path: "/vendor/customers",
      icon: <Users size={20} />,
    },
    {
      title: "Financials",
      path: "/vendor/financials",
      icon: <DollarSign size={20} />,
    },
    {
      title: "Settings",
      path: "/vendor/settings",
      icon: <Settings size={20} />,
    },
  ]

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t">
        <div className="grid grid-cols-5">
          {menuItems.slice(0, 5).map((item) => (
            <Link
              key={item.title}
              href={item.path}
              className={`flex flex-col items-center py-2 ${isActive(item.path) ? "text-primary" : "text-gray-500"}`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.title.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </div>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="left" className="w-[85%] max-w-sm p-0">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center">
                <Store className="h-6 w-6 mr-2 text-primary" />
                <h2 className="font-semibold text-lg">Vendor Portal</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="p-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.path}
                        className={`flex items-center px-4 py-3 rounded-lg ${
                          isActive(item.path) ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setIsDrawerOpen(false)}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full" onClick={() => setIsDrawerOpen(false)}>
                Close Menu
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
