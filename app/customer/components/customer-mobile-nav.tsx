"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"
import { Home, LayoutDashboard, MapPin, ShoppingBag, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function CustomerMobileNav() {
  const pathname = usePathname()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
const isMobile=useMobile()
  const menuItems = [
    {
      title: "Dashboard",
      path: "/customer/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Orders",
      path: "/customer/orders",
      icon: <ShoppingBag size={20} />,
    },
    
    {
      title: "Addresses",
      path: "/customer/addresses",
      icon: <MapPin size={20} />,
    },
   
    {
      title: "Profile",
      path: "/customer/profile",
      icon: <User size={20} />,
    },
  ]
 if(!isMobile) return null
  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t">
        <div className="grid grid-cols-5">
            <Link
              key={'Home'}
              href={'/'}
              className={`flex flex-col items-center py-2 ${isActive('/') ? "text-primary" : "text-gray-500"}`}
            >
              <Home />
              <span className="text-xs mt-1">Home</span>
            </Link>
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
              <h2 className="font-semibold text-lg">My Account</h2>
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
