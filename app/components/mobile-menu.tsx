"use client"

import { useEffect } from "react"
import Link from "next/link"
import { X, ChevronRight, Home, ShoppingBag, Heart, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Close menu when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Menu */}
      <div
        className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-background shadow-lg transform transition-transform duration-300 ease-in-out"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-lg">Menu</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4">
              <ul className="space-y-1">
                <li>
                  <Link href="/" className="flex items-center px-3 py-2 rounded-md hover:bg-muted" onClick={onClose}>
                    <Home className="h-5 w-5 mr-3" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <div className="px-3 py-2 text-sm font-medium text-muted-foreground">Categories</div>
                </li>
                <li>
                  <Link
                    href="/category/fashion"
                    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted"
                    onClick={onClose}
                  >
                    <span>Fashion</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/electronics"
                    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted"
                    onClick={onClose}
                  >
                    <span>Electronics</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/home-living"
                    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted"
                    onClick={onClose}
                  >
                    <span>Home & Living</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/beauty"
                    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted"
                    onClick={onClose}
                  >
                    <span>Beauty</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/sports"
                    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted"
                    onClick={onClose}
                  >
                    <span>Sports & Outdoors</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </li>
                <li>
                  <div className="px-3 py-2 text-sm font-medium text-muted-foreground">Account</div>
                </li>
                <li>
                  <Link
                    href="/account"
                    className="flex items-center px-3 py-2 rounded-md hover:bg-muted"
                    onClick={onClose}
                  >
                    <User className="h-5 w-5 mr-3" />
                    <span>My Account</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/orders"
                    className="flex items-center px-3 py-2 rounded-md hover:bg-muted"
                    onClick={onClose}
                  >
                    <ShoppingBag className="h-5 w-5 mr-3" />
                    <span>Orders</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wishlist"
                    className="flex items-center px-3 py-2 rounded-md hover:bg-muted"
                    onClick={onClose}
                  >
                    <Heart className="h-5 w-5 mr-3" />
                    <span>Wishlist</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/settings"
                    className="flex items-center px-3 py-2 rounded-md hover:bg-muted"
                    onClick={onClose}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    <span>Settings</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="flex items-center px-3 py-2 rounded-md hover:bg-muted"
                    onClick={onClose}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Logout</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="p-4 border-t">
            <Link href="/vendor/login" className="block text-center text-sm text-primary hover:underline">
              Become a Seller
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
