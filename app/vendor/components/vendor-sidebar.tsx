"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MenuItem {
  title: string
  path: string
  icon: React.ReactNode
  submenu?: { title: string; path: string }[]
}

interface VendorSidebarProps {
  isDrawer?: boolean
}

export default function VendorSidebar({ isDrawer = false }: VendorSidebarProps) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      path: "/vendor/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Products",
      path: "/vendor/products",
      icon: <Package size={20} />,
      submenu: [
        { title: "All Products", path: "/vendor/products" },
        { title: "Add Product", path: "/vendor/products/add" },
        { title: "Import Products", path: "/vendor/products/import" },
      ],
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
      submenu: [
        { title: "Commissions", path: "/vendor/financials/commissions" },
        { title: "Withdrawals", path: "/vendor/financials/withdrawals" },
        { title: "Payment History", path: "/vendor/financials/payments" },
      ],
    },
    {
      title: "Settings",
      path: "/vendor/settings",
      icon: <Settings size={20} />,
    },
  ]

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null)
    } else {
      setOpenSubmenu(title)
    }
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className={`${isDrawer ? "w-full" : "w-64"} bg-white shadow-md min-h-screen`}>
      {isDrawer && (
        <div className="p-4 border-b flex items-center">
          <Link href="/" className="flex items-center">
            <ArrowLeft size={20} className="mr-2" />
            <span className="text-lg font-semibold">Back to Shop</span>
          </Link>
        </div>
      )}

      <div className={`${isDrawer ? "p-4" : "p-4 border-b"}`}>
        {isDrawer ? (
          <div className="flex items-center">
            <Avatar className="h-12 w-12 mr-3">
              <AvatarImage src="/placeholder.svg" alt="Vendor" />
              <AvatarFallback>VS</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm text-gray-500">Vendor</div>
              <div className="text-lg font-semibold">Vendor Store</div>
            </div>
          </div>
        ) : (
          <Link href="/vendor/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-pink-600">Vendor Portal</span>
          </Link>
        )}
      </div>

      <nav className="mt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={`flex items-center justify-between w-full px-4 py-3 text-sm hover:bg-pink-50 ${
                      pathname.startsWith(item.path) ? "bg-pink-50 text-pink-600" : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.title}</span>
                    </div>
                    {openSubmenu === item.title ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {openSubmenu === item.title && (
                    <ul className="pl-10 bg-gray-50">
                      {item.submenu.map((subitem) => (
                        <li key={subitem.path}>
                          <Link
                            href={subitem.path}
                            className={`block px-4 py-2 text-sm ${
                              isActive(subitem.path) ? "text-pink-600" : "text-gray-700 hover:text-pink-600"
                            }`}
                          >
                            {subitem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center px-4 py-3 text-sm ${
                    isActive(item.path) ? "bg-pink-50 text-pink-600" : "text-gray-700 hover:bg-pink-50"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              )}
            </li>
          ))}

          <li className="mt-6">
            <Link href="/auth/login" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-pink-50">
              <span className="mr-3">
                <LogOut size={20} />
              </span>
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
