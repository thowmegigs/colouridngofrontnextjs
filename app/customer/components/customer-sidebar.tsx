"use client"

import { useAuth } from "@/app/providers/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, CreditCard, HelpCircle, LayoutDashboard, LogOut, MapPin, ShoppingBag, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type React from "react"

interface MenuItem {
  title: string
  path: string
  icon: React.ReactNode
}

interface CustomerSidebarProps {
  isDrawer?: boolean
}

export default function CustomerSidebar({ isDrawer = false }: CustomerSidebarProps) {
  const pathname = usePathname()
const {user}=useAuth()
  // Update the menuItems array to include the profile link
  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      path: "/customer/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "My Orders",
      path: "/customer/orders",
      icon: <ShoppingBag size={20} />,
    },
    
    {
      title: "Addresses",
      path: "/customer/addresses",
      icon: <MapPin size={20} />,
    },
    {
      title: "Payment Method",
      path: "/customer/payment",
      icon: <CreditCard  size={20} />,
    },
   
    {
      title: "Profile",
      path: "/customer/profile",
      icon: <User size={20} />,
    },
    {
      title: "Help & Supprot",
      path: "/customer/help",
      icon: <HelpCircle  size={20} />,
    },
  ]

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
        <div className="flex items-center">
          {isDrawer && (
            <Avatar className="h-12 w-12 mr-3">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          )}
          <div>
            <div className="text-sm text-gray-500">Welcome back,</div>
            <div className="text-lg font-semibold">{user && user.name}</div>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.path}
                className={`flex items-center px-4 py-3 text-sm ${
                  isActive(item.path) ? "bg-pink-50 text-pink-600" : "text-gray-700 hover:bg-pink-50"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.title}</span>
              </Link>
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
