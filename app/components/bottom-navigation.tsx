"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  Bell,
  ChevronRight,
  Clock,
  CreditCard,
  Gift,
  Heart,
  HelpCircle,
  Home,
  LogOut,
  MapPin,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  Smartphone,
  User,
  X
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import BottomCategryLink from "./BottomCategoryLink"


export default function BottomNavigation() {
  const pathname = usePathname()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedTab, setSelectedTab] = useState("subcategories")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [selectedFilterParam, setSelectedFilterParam] = useState("price")
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/abstract-user-icon.png",
    memberSince: "March 2023",
    points: 2450,
  }

  const isActive = (path) => {
    return pathname === path
  }

  const currentCategory = null

  const accountMenuSections = [
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
        { icon: <User className="h-5 w-5" />, label: "Profile Information", href: "/customer/profile" },
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
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t md:hidden">
        <div className="flex justify-around items-center h-16 px-2 relative">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center w-1/5 py-1 ${
              isActive("/") ? "text-pink-600" : "text-gray-500"
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </Link>

          {/* Categories */}
         <BottomCategryLink />

          {/* Cart */}
          <Link
            href="/cart"
            className={`flex flex-col items-center justify-center w-1/5 py-1 ${
              isActive("/cart") ? "text-pink-600" : "text-gray-500"
            }`}
          >
            <div className="relative">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </div>
            <span className="text-xs mt-1 font-medium">Cart</span>
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className={`flex flex-col items-center justify-center w-1/5 py-1 ${
              isActive("/wishlist") ? "text-pink-600" : "text-gray-500"
            }`}
          >
            <div className="relative">
              <Heart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                12
              </span>
            </div>
            <span className="text-xs mt-1 font-medium">Wishlist</span>
          </Link>

          {/* Account */}
          <button
            onClick={() => setIsAccountMenuOpen(true)}
            className={`flex flex-col items-center justify-center w-1/5 py-1 ${
              pathname.startsWith("/account") || pathname.startsWith("/customer") ? "text-pink-600" : "text-gray-500"
            }`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1 font-medium">Account</span>
          </button>
        </div>
      </div>

      {/* Account Menu Sheet */}
      <Sheet open={isAccountMenuOpen} onOpenChange={setIsAccountMenuOpen}>
        <SheetContent side="bottom" className="h-[92vh] p-0 rounded-t-3xl overflow-hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>My Account</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-lg" id="account-dialog-title">
                My Account
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsAccountMenuOpen(false)} className="rounded-full">
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" />
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
                {accountMenuSections.map((section, idx) => (
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
                          onClick={() => setIsAccountMenuOpen(false)}
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
                  setIsAccountMenuOpen(false)
                }}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Log Out</span>
              </Button>
              <p className="text-center text-xs text-gray-500 mt-2">App Version 2.4.1</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Filter Sheet - Two Column Layout */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="bottom" className="h-[80vh] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Filter Products</SheetTitle>
          </SheetHeader>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Filter Products</h2>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Left column - Filter parameters */}
              <div className="w-1/3 border-r overflow-y-auto">
                <div className="p-2">
                  <button
                    className={cn(
                      "w-full text-left px-4 py-3 text-sm rounded-lg",
                      selectedFilterParam === "price"
                        ? "bg-pink-50 text-pink-600 border-l-4 border-pink-600 pl-3"
                        : "text-gray-700 hover:bg-gray-50",
                    )}
                    onClick={() => setSelectedFilterParam("price")}
                  >
                    Price Range
                  </button>
                  <button
                    className={cn(
                      "w-full text-left px-4 py-3 text-sm rounded-lg",
                      selectedFilterParam === "brand"
                        ? "bg-pink-50 text-pink-600 border-l-4 border-pink-600 pl-3"
                        : "text-gray-700 hover:bg-gray-50",
                    )}
                    onClick={() => setSelectedFilterParam("brand")}
                  >
                    Brand
                  </button>
                  <button
                    className={cn(
                      "w-full text-left px-4 py-3 text-sm rounded-lg",
                      selectedFilterParam === "rating"
                        ? "bg-pink-50 text-pink-600 border-l-4 border-pink-600 pl-3"
                        : "text-gray-700 hover:bg-gray-50",
                    )}
                    onClick={() => setSelectedFilterParam("rating")}
                  >
                    Rating
                  </button>
                  <button
                    className={cn(
                      "w-full text-left px-4 py-3 text-sm rounded-lg",
                      selectedFilterParam === "discount"
                        ? "bg-pink-50 text-pink-600 border-l-4 border-pink-600 pl-3"
                        : "text-gray-700 hover:bg-gray-50",
                    )}
                    onClick={() => setSelectedFilterParam("discount")}
                  >
                    Discount
                  </button>
                  <button
                    className={cn(
                      "w-full text-left px-4 py-3 text-sm rounded-lg",
                      selectedFilterParam === "availability"
                        ? "bg-pink-50 text-pink-600 border-l-4 border-pink-600 pl-3"
                        : "text-gray-700 hover:bg-gray-50",
                    )}
                    onClick={() => setSelectedFilterParam("availability")}
                  >
                    Availability
                  </button>
                </div>
              </div>

              {/* Right column - Filter options */}
              <div className="w-2/3 overflow-y-auto p-4">
                {selectedFilterParam === "price" && (
                  <div>
                    <h3 className="font-medium mb-4">Price Range</h3>
                    <div className="px-2">
                      <Slider defaultValue={[0, 1000]} min={0} max={1000} step={10} />
                      <div className="flex justify-between mt-2 text-sm text-gray-500">
                        <span>$0</span>
                        <span>$1000</span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        Under $50
                      </Button>
                      <Button variant="outline" size="sm">
                        $50 - $100
                      </Button>
                      <Button variant="outline" size="sm">
                        $100 - $200
                      </Button>
                      <Button variant="outline" size="sm">
                        $200 - $500
                      </Button>
                      <Button variant="outline" size="sm">
                        $500 - $1000
                      </Button>
                      <Button variant="outline" size="sm">
                        Over $1000
                      </Button>
                    </div>
                  </div>
                )}

                {selectedFilterParam === "brand" && (
                  <div>
                    <h3 className="font-medium mb-4">Brand</h3>
                    <div className="space-y-2">
                      {["Apple", "Samsung", "Sony", "Nike", "Adidas", "LG", "Bose", "Canon", "Dell", "HP"].map(
                        (brand) => (
                          <div key={brand} className="flex items-center">
                            <Checkbox id={`brand-${brand}`} />
                            <Label htmlFor={`brand-${brand}`} className="ml-2">
                              {brand}
                            </Label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {selectedFilterParam === "rating" && (
                  <div>
                    <h3 className="font-medium mb-4">Rating</h3>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center">
                          <Checkbox id={`rating-${rating}`} />
                          <Label htmlFor={`rating-${rating}`} className="ml-2 flex items-center">
                            <div className="flex">
                              {Array.from({ length: rating }).map((_, i) => (
                                <span key={i} className="text-green-500">
                                  ★
                                </span>
                              ))}
                              {Array.from({ length: 5 - rating }).map((_, i) => (
                                <span key={i} className="text-gray-300">
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="ml-1 text-sm text-gray-500">& Up</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFilterParam === "discount" && (
                  <div>
                    <h3 className="font-medium mb-4">Discount</h3>
                    <div className="space-y-2">
                      {[
                        "10% or more",
                        "20% or more",
                        "30% or more",
                        "40% or more",
                        "50% or more",
                        "60% or more",
                        "70% or more",
                      ].map((discount) => (
                        <div key={discount} className="flex items-center">
                          <Checkbox id={`discount-${discount}`} />
                          <Label htmlFor={`discount-${discount}`} className="ml-2">
                            {discount}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFilterParam === "availability" && (
                  <div>
                    <h3 className="font-medium mb-4">Availability</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox id="in-stock" />
                        <Label htmlFor="in-stock" className="ml-2">
                          In Stock
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="on-sale" />
                        <Label htmlFor="on-sale" className="ml-2">
                          On Sale
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="new-arrivals" />
                        <Label htmlFor="new-arrivals" className="ml-2">
                          New Arrivals
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="free-shipping" />
                        <Label htmlFor="free-shipping" className="ml-2">
                          Free Shipping
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsFilterOpen(false)}>
                  Reset
                </Button>
                <Button className="flex-1" onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sort Sheet */}
      <Sheet open={isSortOpen} onOpenChange={setIsSortOpen}>
        <SheetContent side="bottom" className="h-[50vh]">
          <SheetHeader className="sr-only">
            <SheetTitle>Sort Products</SheetTitle>
          </SheetHeader>
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Sort By</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              <RadioGroup defaultValue="featured">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="featured" id="featured" />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="newest" id="newest" />
                    <Label htmlFor="newest">Newest Arrivals</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price-low" id="price-low" />
                    <Label htmlFor="price-low">Price: Low to High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price-high" id="price-high" />
                    <Label htmlFor="price-high">Price: High to Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rating" id="rating" />
                    <Label htmlFor="rating">Customer Rating</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="pt-4 border-t mt-4">
              <Button className="w-full" onClick={() => setIsSortOpen(false)}>
                Apply
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
