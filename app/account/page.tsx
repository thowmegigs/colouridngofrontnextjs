"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, ShoppingBag, Heart, Settings, LogOut, Store, ChevronRight } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-mobile"

export default function AccountPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Simulate checking login status
  useEffect(() => {
    // In a real app, you would check if the user is logged in
    // For demo purposes, we'll assume they're not logged in
    setIsLoggedIn(false)
  }, [])

  // Redirect to login if not logged in
  useEffect(() => {
    if (isLoggedIn === false) {
      router.push("/auth/login")
    }
  }, [isLoggedIn, router])

  // Show loading state while checking login status
  if (isLoggedIn === null) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  const menuItems = [
    { icon: <User className="h-5 w-5" />, title: "Profile", path: "/customer/dashboard" },
    { icon: <ShoppingBag className="h-5 w-5" />, title: "Orders", path: "/account/orders" },
    { icon: <Heart className="h-5 w-5" />, title: "Wishlist", path: "/wishlist" },
    { icon: <Settings className="h-5 w-5" />, title: "Settings", path: "/customer/settings" },
    { icon: <LogOut className="h-5 w-5" />, title: "Logout", path: "/auth/logout" },
  ]

  const vendorMenuItems = [
    { icon: <Store className="h-5 w-5" />, title: "Vendor Dashboard", path: "/vendor/dashboard" },
    { icon: <Settings className="h-5 w-5" />, title: "Store Settings", path: "/vendor/settings" },
    { icon: <LogOut className="h-5 w-5" />, title: "Logout", path: "/auth/logout" },
  ]

  // This part won't render due to the redirect, but we'll include it for completeness
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>

      <Tabs defaultValue="customer" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="customer">Customer Account</TabsTrigger>
          <TabsTrigger value="vendor">Vendor Account</TabsTrigger>
        </TabsList>

        <TabsContent value="customer">
          {isMobile ? (
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 flex items-center justify-between"
                  onClick={() => router.push(item.path)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                      {item.icon}
                    </div>
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" /> Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Manage your personal information and preferences</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/customer/dashboard")}>
                    Go to Profile
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5" /> Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>View your order history and track current orders</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/account/orders")}>
                    View Orders
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-5 w-5" /> Wishlist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>View and manage your saved items</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/wishlist")}>
                    View Wishlist
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="vendor">
          {isMobile ? (
            <div className="space-y-2">
              {vendorMenuItems.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 flex items-center justify-between"
                  onClick={() => router.push(item.path)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                      {item.icon}
                    </div>
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Store className="mr-2 h-5 w-5" /> Vendor Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Manage your store, products, and orders</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/vendor/dashboard")}>
                    Go to Dashboard
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" /> Store Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Configure your store settings and preferences</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/vendor/settings")}>
                    Manage Settings
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LogOut className="mr-2 h-5 w-5" /> Logout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Sign out from your vendor account</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Logout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
