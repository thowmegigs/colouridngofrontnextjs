import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient } from "@tanstack/react-query"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import type React from "react"
import BottomNavigation from "./components/bottom-navigation"
import Footer from "./components/footer"
import Header from "./components/header"
import "./globals.css"
const hammersmithOne = Nunito({
  subsets: ['latin'],
  weight: ['400','500','600','700'],
  style: ['normal'],
  variable: '--font-hammersmithOne',
})

const queryClient = new QueryClient()
export const metadata: Metadata = {
  title: {
    default: "Colorindigo  Marketplace",
    template: "%s | Colorindigo Marketplace",
  },
  description: "Colorindigo marketplace for all your shopping needs",
  keywords: ["ecommerce", "marketplace", "shopping", "multi-vendor"],
  authors: [{ name: "Colorindigo Team" }],
  creator: "Colorindigo Team",
   icons: {
    icon: "/favicon.png", 
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://colourindigo.com",
    title: "Colorindigo Marketplace",
    description: "Colorindigo marketplace for all your shopping needs",
    siteName: "Colorindigo Marketplace",
  },
  twitter: {
    card: "summary_large_image",
    title: "Colorindigo Marketplace",
    description: "Colorindigo marketplace for all your shopping needs",
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
    <html lang="en" suppressHydrationWarning className={`${hammersmithOne.variable} `}>
      <body className={`${hammersmithOne.variable} bg-gradient-to-br from-indigo-50 to-white min-h-screen`}>

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <QueryClientWrapper>

              <WishlistProvider>
                <CartProvider>
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow mb-10">{children}</main>
                    <Footer />
                    
                    <BottomNavigation />
                  </div>
                  <ToastProvider />
                </CartProvider> </WishlistProvider>
            </QueryClientWrapper></AuthProvider>

        </ThemeProvider>


      </body>
    </html>
  )
}


import QueryClientWrapper from "@/components/QueryClientWrapper"
import './globals.css'
import { AuthProvider } from "./providers/auth-provider"
import { CartProvider } from "./providers/cart-provider"
import ToastProvider from "./providers/ToastProvider"
import { WishlistProvider } from "./providers/wishlist-provider"

