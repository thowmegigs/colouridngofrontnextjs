"use client"

import { Button } from "@/components/ui/button"
import { Category } from "@/interfaces"
import { fetchTopCategories } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import algoliasearch from "algoliasearch/lite"
import {
  ArrowLeft,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  Store,
  User,
  X
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import {
  InstantSearch,
  useHits,
  useInstantSearch,
  useSearchBox
} from 'react-instantsearch'
import { useAuth } from "../providers/auth-provider"
import { useCart } from "../providers/cart-provider"
import { useWishlist } from "../providers/wishlist-provider"
import CartDrawer from "./cart-drawer"
import MegaMenu from "./mega-menu"
import SafeImage from "./SafeImage"

const searchClient = algoliasearch('T55UYZ1VAO', 'edca52cad205b2840b5f090e24b83149')

const CustomSearchBox = () => {
  const { query, refine } = useSearchBox()
  const { setUiState }: any = useInstantSearch()
  const [inputValue, setInputValue] = useState(query)

  const parseQuery = (query: string) => {
    const filters: string[] = []
    let cleanedQuery = query
    // ... existing parseQuery implementation ...
    return { query: cleanedQuery.trim(), filters: filters.join(' AND ') }
  }

  useEffect(() => {
    const { query, filters } = parseQuery(inputValue)
    refine(query)
    setUiState((uiState: any) => ({
      ...uiState,
      products: { ...uiState.products, filters }
    }))
  }, [inputValue])

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Search product, category, color, brand..."
      className="w-full rounded-full border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  )
}

const SearchResults = () => {
  const { hits } = useHits()
  const { query } = useSearchBox()
  const router = useRouter()

  const groupedHits = hits.reduce((acc: Record<string, any[]>, hit: any) => {
    const category = hit.category || 'Uncategorized'
    if (!acc[category]) acc[category] = []
    acc[category].push(hit)
    return acc
  }, {})

  if (!query.trim()) return null

  return (
    <>
      {Object.entries(groupedHits).length > 0 ? (
        Object.entries(groupedHits).map(([category, items]) => (
          <div key={category} className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">{category}</h4>
            <div className="space-y-3">
              {items.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex items-center p-2 hover:bg-muted rounded-md"
                  onClick={() => router.push(product.link)}
                >
                  <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <SafeImage
                      src={product.image}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">{product.name}</div>
                    <div className="text-sm text-primary font-medium">${product.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">No results found</div>
      )}
    </>
  )
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const { isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { totalItems, setIsOpen } = useCart()
  const [isHoveringMenu, setIsHoveringMenu] = useState(false)
  const [isHoveringMegaMenu, setIsHoveringMegaMenu] = useState(false)
  const { items: wishlistItems } = useWishlist()
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchTopCategories,
  })

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setActiveMegaMenu(null)
    setShowAccountDropdown(false)
    setShowMobileSearch(false)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowMobileSearch(false)
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getPageTitle = () => {
    if (pathname === '/') return 'Home'
    const parts = pathname.split('/').filter(p => p)
    return parts[parts.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background"}`}>
        <div className="bg-primary text-primary-foreground py-2 text-center text-sm">
          <p>Free shipping on orders over $50! Use code FREESHIP50</p>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="container py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {pathname !== '/' ? (
                <>
                  <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <span className="font-medium">{getPageTitle()}</span>
                </>
              ) : (
                <Link href="/" className="flex items-center">
                  <Image src="/images/logo.png" alt="Colour Indigo" width={80} height={80} />
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowMobileSearch(true)}>
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="container pb-2">
            <div className="relative cursor-text" onClick={() => setShowMobileSearch(true)}>
              <input
                type="text"
                placeholder="Search products..."
                readOnly
                className="w-full rounded-full border border-input bg-background px-4 py-2 text-sm"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Mobile Search Bottom Sheet */}
        {showMobileSearch && (
          <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setShowMobileSearch(false)}>
            <div
              className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl p-4 h-[90vh] max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
              ref={searchRef}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Search Products</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowMobileSearch(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <InstantSearch searchClient={searchClient} indexName="products">
                <div className="flex-1 overflow-hidden flex flex-col">
                  <CustomSearchBox />
                  <div className="flex-1 overflow-y-auto">
                    <SearchResults />
                  </div>
                </div>
              </InstantSearch>
            </div>
          </div>
        )}

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <Image src="/images/logo.png" alt="Colour Indigo" width={150} height={50} className="h-10 w-auto" />
              </Link>

              <div className="relative flex-1 mx-8" ref={searchRef}>
                <InstantSearch searchClient={searchClient} indexName="products">
                  <CustomSearchBox />
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background  rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto">
                    <SearchResults />
                  </div>
                </InstantSearch>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative" ref={accountRef}>
                  {isAuthenticated ? (
                    <button
                      className="flex items-center text-sm font-medium"
                      onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                    >
                      <User className="h-5 w-5 mr-1" />
                      <span>Account</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      className="flex items-center text-sm font-medium"
                      onClick={() => router.push('/auth/login')}
                    >
                      <User className="h-5 w-5 mr-1" />
                      <span>Login</span>
                    </button>
                  )}
                  {showAccountDropdown && (
                    <div className="absolute top-full right-0 mt-1 w-64 bg-background border rounded-lg shadow-lg z-50">
                      {/* Account dropdown content */}
                    </div>
                  )}
                </div>

                <Link href="/wishlist" className="flex items-center text-sm font-medium">
                  <Button variant="ghost" size="icon" className="relative">
                    <Heart className="h-5 w-5" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Button>
                </Link>

                <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            <nav className="flex items-center justify-between mt-4">
              <ul className="flex space-x-8">
                <li>
                  <Link href="/" className="text-sm font-medium hover:text-primary relative group">
                    Home
                    <span className="absolute left-0 -bottom-1.5 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="relative"
                    onMouseEnter={() => {
                      setActiveMegaMenu(category.slug)
                      setIsHoveringMenu(true)
                    }}
                    onMouseLeave={() => setIsHoveringMenu(false)}
                  >
                    <button className="flex items-center text-sm font-medium hover:text-primary relative group">
                      {category.name}
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeMegaMenu === category.slug ? "rotate-180" : ""}`} />
                      <span className="absolute left-0 -bottom-1.5 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </li>
                ))}
                <li>
                  <Link href="/brands" className="text-sm font-medium hover:text-primary relative group">
                    Brands
                    <span className="absolute left-0 -bottom-1.5 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li>
                  <Link href="/sale" className="text-sm font-medium text-destructive hover:text-destructive/80 relative group">
                    Sale
                    <span className="absolute left-0 -bottom-1.5 w-0 h-0.5 bg-destructive transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              </ul>

              <div className="flex items-center space-x-4">
                <Link href="/vendor/login" className="flex items-center text-sm font-medium hover:text-primary relative group">
                  <Store className="h-4 w-4 mr-1" />
                  <span>Sell on Colour Indigo</span>
                  <span className="absolute left-0 -bottom-1.5 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
            </nav>
          </div>
        </div>

        {activeMegaMenu && (
          <div
            ref={megaMenuRef}
            onMouseEnter={() => setIsHoveringMegaMenu(true)}
            onMouseLeave={() => setIsHoveringMegaMenu(false)}
          >
            <MegaMenu slug={activeMegaMenu} categories={categories} onClose={() => setActiveMegaMenu(null)} />
          </div>
        )}
      </header>

      {/* <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} /> */}
      <CartDrawer />
    </>
  )
}