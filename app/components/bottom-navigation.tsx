"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { useMobile } from "@/hooks/use-mobile"
import {
  ChevronRight,
  ClipboardList,
  Heart,
  Home,
  HomeIcon,
  LogOut,
  MapPin,
  Package,
  Repeat,
  RotateCcw,
  ShoppingBag,
  User,
  User2
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "../providers/auth-provider"
import { useCart } from "../providers/cart-provider"
import { useWishlist } from "../providers/wishlist-provider"
import BottomCategryLink from "./BottomCategoryLink"
import { AuthModal } from "./auth-modal"


export default function BottomNavigation() {
  const pathname = usePathname()
  const {logout,isAuthenticated,user}=useAuth()
 
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

  const [isOpenAuthModal,setOpenAuthModal]=useState(false)
  const {totalItems}=useCart();
  const {items:wishListItems}=useWishlist();
  const router=useRouter()
const isMobile=useMobile()
  // Mock user data

  const isActive = (path) => {
    return pathname === path
  }

  const currentCategory = null

  const accountMenuSections = [
    {
      title: "Account",
      items: [
        { icon: <HomeIcon className="h-5 w-5" />, label: "Dashboard", href: "/customer/dashboard" },

        { icon: <Package className="h-5 w-5" />, label: "My Orders", href: "/customer/orders" },
        { icon: <User2 className="h-5 w-5" />, label: "Profile", href: "/customer/profile", },
         { icon: <MapPin className="h-5 w-5" />, label: "Saved Addresses", href: "/customer/addresses" },
        // { icon: <CreditCard className="h-5 w-5" />, label: "Payment Methods", href: "/account/payment" },
      ],
    },
    {
      title: "Policy",
      items: [
         { icon: <Package className="h-5 w-5" />, label: "Shipping Policy", href: "/shipping_policy" },
         { icon: <RotateCcw className="h-5 w-5" />, label: "Terms & Conditions", href: "/terms" },
         { icon: <ClipboardList className="h-5 w-5" />, label: "Refund Policy", href: "/refund_policy" },
         { icon: <Repeat className="h-5 w-5" />, label: "Return Policy", href: "/return_policy" },
      ],
    }
   
  ]
 
const pathAr=['/cart','/category/','/product/','/collection/','/customer/','/checkout'];
 if(!isMobile ) return null
  const showSomething = pathAr.some((base) =>
    pathname.includes(base) 
  );
 if(showSomething) return null
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t md:hidden">
        <div className="flex justify-around items-center h-16 px-2 relative">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center w-1/5 py-1 ${
              isActive("/") ? "text-primary-600" : "text-gray-500"
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </Link>

          {/* Categories */}
       
          {/* Cart */}
          <Link
            href="/cart"
            className={`flex flex-col items-center justify-center w-1/5 py-1 ${
              isActive("/cart") ? "text-primary" : "text-gray-500"
            }`}
          >
            <div className="relative">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-700 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
               {totalItems}
              </span>
            </div>
            <span className="text-xs mt-1 font-medium">Cart</span>
          </Link>
  <BottomCategryLink />

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className={`flex flex-col items-center justify-center w-1/5 py-1 ${
              isActive("/wishlist") ? "text-primary" : "text-gray-500"
            }`}
          >
            <div className="relative">
              <Heart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-700 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
               {wishListItems.length}
              </span>
            </div>
            <span className="text-xs mt-1 font-medium">Wishlist</span>
          </Link>

          {/* Account */}
          <button
            onClick={() =>{

              isAuthenticated? setIsAccountMenuOpen(true):router.push('/auth/login')
            }}
            className={`flex flex-col items-center justify-center w-1/5 py-1 ${
              pathname.startsWith("/account") || pathname.startsWith("/customer") ? "text-primary-600" : "text-gray-500"
            }`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1 font-medium">Account</span>
          </button>
        </div>
      </div>

      {/* Account Menu Sheet */}
      <AuthModal initialView="login" isOpen={isOpenAuthModal} onClose={function (): void {
        setOpenAuthModal(false)
      } } onSuccess={function (): void {
      
       setOpenAuthModal(false)
      } } />
      <Sheet open={isAccountMenuOpen} onOpenChange={setIsAccountMenuOpen}>
        <SheetContent side="bottom" className="h-[92vh] p-0 rounded-t-3xl overflow-hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>My Account</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            {/* Header with close button */}
          

            <div className="overflow-y-auto flex-1 pb-20">
              {/* User profile card */}
              <div className="bg-primary p-6 text-white">
                <div className="flex items-start">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-4 border-white/30">
                      <AvatarImage src={'/abstract-user-icon.png'} alt={user?.name} />
                      <AvatarFallback className="bg-white/20 text-white">{user?.name}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Active
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-xl">{user?.name}</h3>
                    <p className="text-white/80 text-sm">{user?.phone}</p>
                    <p className="text-white/80 text-sm">{user?.email}</p>
                   
                  </div>
                </div>

                {/* Points card */}
                {/* <div className="mt-4 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
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
                </div> */}
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
                          href={item.href} passHref
                          className={`flex items-center justify-between p-4 ${
                            itemIdx !== section.items.length - 1 ? "border-b" : ""
                          } ${item.highlight ? "bg-primary-50" : "hover:bg-gray-50"} active:bg-gray-100 transition-colors`}
                          onClick={() => setIsAccountMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <div className={`mr-3 ${item.highlight ? "text-primary-600" : "text-gray-500"}`}>
                              {item.icon}
                            </div>
                            <span className={item.highlight ? "font-medium text-primary-600" : ""}>{item.label}</span>
                            {item.badge && (
                              <div className="ml-2 bg-primary-100 text-primary-600 text-xs px-2 py-0.5 rounded-full">
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
                onClick={logout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Log Out</span>
              </Button>
              {/* <p className="text-center text-xs text-gray-500 mt-2">App Version 2.4.1</p> */}
            </div>
          </div>
        </SheetContent>
      </Sheet>

    
    </>
  )
}
