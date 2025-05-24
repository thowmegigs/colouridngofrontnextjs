"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import {
  Bell,
  ChevronRight,
  Clock,
  CreditCard,
  Gift,
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  Package,
  Settings,
  Shield,
  Smartphone,
  User,
  X,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type AccountMenuProps = {
  isOpen: boolean
  onClose: () => void
}

export default function AccountMenu({ isOpen, onClose }: AccountMenuProps) {
  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/abstract-user-icon.png",
    memberSince: "March 2023",
    points: 2450,
  }

  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(false)

  // Simulate loading state
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const menuSections = [
    {
      title: "Shopping",
      items: [
        { icon: <Package className="h-5 w-5" />, label: "My Orders", href: "/account/orders", badge: "3" },
        { icon: <Heart className="h-5 w-5" />, label: "My Wishlist", href: "/wishlist", badge: "12" },
        { icon: <MapPin className="h-5 w-5" />, label: "Saved Addresses", href: "/account/addresses" },
        { icon: <CreditCard className="h-5 w-5" />, label: "Payment Methods", href: "/account/payment" },
      ],
    },
    {
      title: "Account",
      items: [
        { icon: <User className="h-5 w-5" />, label: "Profile Information", href: "/account/profile" },
        { icon: <Bell className="h-5 w-5" />, label: "Notifications", href: "/account/notifications" },
        { icon: <Gift className="h-5 w-5" />, label: "Rewards & Points", href: "/account/rewards", highlight: true },
        { icon: <Clock className="h-5 w-5" />, label: "Recently Viewed", href: "/account/recently-viewed" },
      ],
    },
    {
      title: "Settings & Support",
      items: [
        {
          icon: <Settings className="h-5 w-5" />,
          label: "App Settings",
          href: "/account/settings",
          toggle: true,
          toggleState: darkMode,
          onToggle: () => setDarkMode(!darkMode),
          toggleLabel: "Dark Mode",
        },
        {
          icon: <Shield className="h-5 w-5" />,
          label: "Privacy & Security",
          href: "/account/privacy",
          toggle: true,
          toggleState: biometricEnabled,
          onToggle: () => setBiometricEnabled(!biometricEnabled),
          toggleLabel: "Biometric Login",
        },
        { icon: <Smartphone className="h-5 w-5" />, label: "Connected Devices", href: "/account/devices" },
        { icon: <HelpCircle className="h-5 w-5" />, label: "Help & Support", href: "/help" },
      ],
    },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[92vh] p-0 rounded-t-3xl overflow-hidden">
        <SheetHeader className="sr-only">
          <SheetTitle>My Account</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="w-48 h-6 mt-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-4 mt-2 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-lg" id="account-menu-title">
                My Account
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            <div className="overflow-y-auto flex-1 pb-20">
              {/* User profile card */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
                <div className="flex items-start">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-4 border-white/30">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-white/20 text-white">JD</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Active
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-xl">{user.name}</h3>
                    <p className="text-white/80 text-sm">{user.phone}</p>
                    <p className="text-white/80 text-sm">{user.email}</p>
                    <div className="flex items-center mt-2">
                      <div className="text-xs bg-white/20 px-2 py-1 rounded-full">Member since {user.memberSince}</div>
                    </div>
                  </div>
                </div>

                {/* Points card */}
                <div className="mt-4 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-white/80">Reward Points</p>
                      <p className="text-xl font-bold">{user.points} pts</p>
                    </div>
                    <Button size="sm" variant="secondary" className="bg-white text-pink-600 hover:bg-white/90">
                      Redeem
                    </Button>
                  </div>
                  <div className="mt-2 w-full bg-white/20 rounded-full h-1.5">
                    <div className="bg-white h-1.5 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                  <p className="text-xs mt-1 text-white/70">450 points until next tier</p>
                </div>
              </div>

              {/* Menu sections */}
              <div className="px-4 py-2">
                {menuSections.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2 px-2">{section.title}</h3>
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                      {section.items.map((item, itemIdx) => (
                        <Link
                          key={itemIdx}
                          href={item.href}
                          className={`flex items-center justify-between p-4 ${
                            itemIdx !== section.items.length - 1 ? "border-b" : ""
                          } ${item.highlight ? "bg-pink-50" : "hover:bg-gray-50"} active:bg-gray-100 transition-colors`}
                          onClick={onClose}
                        >
                          <div className="flex items-center">
                            <div className={`mr-3 ${item.highlight ? "text-pink-600" : "text-gray-500"}`}>
                              {item.icon}
                            </div>
                            <span className={item.highlight ? "font-medium text-pink-600" : ""}>{item.label}</span>
                            {item.badge && (
                              <div className="ml-2 bg-pink-100 text-pink-600 text-xs px-2 py-0.5 rounded-full">
                                {item.badge}
                              </div>
                            )}
                          </div>

                          {item.toggle ? (
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 mr-2">{item.toggleLabel}</span>
                              <Switch checked={item.toggleState} onCheckedChange={item.onToggle} />
                            </div>
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  // Handle logout
                  onClose()
                }}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Log Out</span>
              </Button>
              <p className="text-center text-xs text-gray-500 mt-2">App Version 2.4.1</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
