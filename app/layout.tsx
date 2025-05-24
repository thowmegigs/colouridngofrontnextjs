import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient } from "@tanstack/react-query"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import BottomNavigation from "./components/bottom-navigation"
import Footer from "./components/footer"
import Header from "./components/header"
import "./globals.css"
 
const inter = Inter({ subsets: ["latin"] })
const queryClient = new QueryClient()
export const metadata: Metadata = {
  title: {
    default: "MultiVendor Marketplace",
    template: "%s | MultiVendor Marketplace",
  },
  description: "A multi-vendor marketplace for all your shopping needs",
  keywords: ["ecommerce", "marketplace", "shopping", "multi-vendor"],
  authors: [{ name: "MultiVendor Team" }],
  creator: "MultiVendor Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://multivendor-marketplace.com",
    title: "MultiVendor Marketplace",
    description: "A multi-vendor marketplace for all your shopping needs",
    siteName: "MultiVendor Marketplace",
  },
  twitter: {
    card: "summary_large_image",
    title: "MultiVendor Marketplace",
    description: "A multi-vendor marketplace for all your shopping needs",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  // manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gradient-to-br from-indigo-50 to-white min-h-screen`}>
      
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <AuthProvider>
        <QueryClientWrapper>
          <ToastProvider>
        <WishlistProvider>
        <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
                <BottomNavigation />
              </div>
            </CartProvider> </WishlistProvider>
            </ToastProvider></QueryClientWrapper></AuthProvider>

        </ThemeProvider>
        
        
      </body>
    </html>
  )
}


import QueryClientWrapper from "@/components/QueryClientWrapper"
import './globals.css'
import { AuthProvider } from "./providers/auth-provider"
import { CartProvider } from "./providers/cart-provider"
import { ToastProvider } from "./providers/ToastProvider"
import { WishlistProvider } from "./providers/wishlist-provider"

