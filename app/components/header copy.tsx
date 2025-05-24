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
  ShoppingCart,
  Store,
  User
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import {
  InstantSearch
} from 'react-instantsearch'
import { useAuth } from "../providers/auth-provider"
import { useCart } from "../providers/cart-provider"
import { useWishlist } from "../providers/wishlist-provider"
import CartDrawer from "./cart-drawer"
import MegaMenu from "./mega-menu"

const searchClient = algoliasearch('T55UYZ1VAO', 'edca52cad205b2840b5f090e24b83149');

// Search components and mock data remain the same
const CustomSearchBox = () => {
  const { query, refine } = useSearchBox();
  const { setUiState }: any = useInstantSearch();
  const [inputValue, setInputValue] = useState(query);
  const parseQuery = (query: string): any => {
    const filters: string[] = [];
    let cleanedQuery = query;

    // Match "under 1000"
    const underMatch = cleanedQuery.match(/under\s+(\d+)/i);
    if (underMatch) {
      filters.push(`price < ${underMatch[1]}`);
      cleanedQuery = cleanedQuery.replace(underMatch[0], '');
    }

    // Match "above 500"
    const aboveMatch = cleanedQuery.match(/above\s+(\d+)/i);
    if (aboveMatch) {
      filters.push(`price > ${aboveMatch[1]}`);
      cleanedQuery = cleanedQuery.replace(aboveMatch[0], '');
    }

    // Known values
    const knownCategories = ['Shirts', 'Jeans', 'T-Shirts', 'Dresses'];
    const knownBrands = ['Nike', 'Adidas', 'Rajmuli', 'Tatw'];
    const knownColors = ['Red', 'Blue', 'Black', 'Yellow', 'Green'];
    const knownSizes = ['XS', 'S', 'M', 'L', 'XL'];
    const knownFabrics = ['Cotton', 'Denim', 'Silk', 'Linen'];

    const words = cleanedQuery.split(/\s+/);

    words.forEach((word) => {
      const lowercaseWord = word.toLowerCase();

      const matchedCategory = knownCategories.find(cat => cat.toLowerCase().includes(lowercaseWord));
      if (matchedCategory) {
        filters.push(`category:"${matchedCategory}"`);
        cleanedQuery = cleanedQuery.replace(new RegExp(`\\b${word}\\b`, 'i'), '');
        return;
      }

      const matchedBrand = knownBrands.find(brand => brand.toLowerCase().includes(lowercaseWord));
      if (matchedBrand) {
        filters.push(`brand:"${matchedBrand}"`);
        cleanedQuery = cleanedQuery.replace(new RegExp(`\\b${word}\\b`, 'i'), '');
        return;
      }

      const matchedColor = knownColors.find(color => color.toLowerCase().includes(lowercaseWord));
      if (matchedColor) {
        filters.push(`colors:"${matchedColor}"`);
        cleanedQuery = cleanedQuery.replace(new RegExp(`\\b${word}\\b`, 'i'), '');
        return;
      }

      const matchedSize = knownSizes.find(size => size.toLowerCase() === lowercaseWord);
      if (matchedSize) {
        filters.push(`sizes:"${matchedSize}"`);
        cleanedQuery = cleanedQuery.replace(new RegExp(`\\b${word}\\b`, 'i'), '');
        return;
      }

      const matchedFabric = knownFabrics.find(fabric => fabric.toLowerCase().includes(lowercaseWord));
      if (matchedFabric) {
        filters.push(`fabric:"${matchedFabric}"`);
        cleanedQuery = cleanedQuery.replace(new RegExp(`\\b${word}\\b`, 'i'), '');
        return;
      }
    });

    return {
      query: cleanedQuery.trim(),
      filters: filters.join(' AND '),
    };
  };

  useEffect(() => {
    const { query, filters } = parseQuery(inputValue);
   
    refine(query);
    setUiState((uiState: any) => ({
      ...uiState,
      products: {
        ...uiState.products,
        filters,
      },
    }));
  }, [inputValue]);

  return (

    <input
      type="text"
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);

      }}
      placeholder="Search product, category, color, brand..."
      className="w-full rounded-full border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

    />
  );
}
const Hit = ({ hit }: any) => {
  const { results } = useInstantSearch();
  const { hits } = useHits();
  const { query } = useSearchBox();
  const groupedHits = hits.reduce((acc, hit) => {
    const category = hit.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(hit);
    return acc;
  }, {} as Record<string, any[]>);
  
  if (query.trim().length === 0) return null
  return <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-[70vh] overflow-y-auto">
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Search Results</h3>

      </div>

      {
        Object.entries(groupedHits).length > 0 ? Object.entries(groupedHits).map(([category, items]: any) => (
          <div key={category.objectID} className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">{category}</h4>
            <div className="space-y-3">
              {items.map((product: any) => (
                <Link
                  key={product.objectID}
                  href={"/dfgdfg"}
                  className="flex items-center p-2 hover:bg-muted rounded-md"
                  onClick={() => { }}
                >
                  <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image || "/placeholder.svg"}
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
        )) : <div className="text-center">No result found</div>
      }

      
    </div>
  </div>
}
export default function Header() {


  const [isScrolled, setIsScrolled] = useState(false)
  const { isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchState, setSearchState] = useState<any>()
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const router = useRouter()
  const isHome = pathname === '/';
  const { totalItems, setIsOpen } = useCart()
  const [isHoveringMenu, setIsHoveringMenu] = useState(false)
  const [isHoveringMegaMenu, setIsHoveringMegaMenu] = useState(false)
  const { items: wishlistItems } = useWishlist()
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchTopCategories,
  });

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Route change handlers
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setActiveMegaMenu(null)
    setShowSearchResults(false)
    setShowAccountDropdown(false)
  }, [pathname])

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Dynamic page title for mobile header
  const getPageTitle = () => {
    if (pathname === '/') return 'Home'
    const parts = pathname.split('/').filter(p => p)
    if (parts.length === 0) return 'Home'
    const lastPart = parts[parts.length - 1]
    return lastPart
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background"}`}>
        {/* Announcement Bar */}
        <div className="bg-primary text-primary-foreground py-2 text-center text-sm">
          <p>Free shipping on orders over $50! Use code FREESHIP50</p>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="container py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {pathname !== '/' ? (<>
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="font-medium">{getPageTitle()}</span>
              </>)
                : <Link href="/" className="flex items-center">
                  <Image src="/images/logo.png" alt="Colour Indigo" width={80} height={80}  />
                </Link>}

            </div>

            <div className="flex items-center gap-2">
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
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Image src="/images/logo.png" alt="Colour Indigo" width={150} height={50} className="h-10 w-auto" />
              </Link>

              {/* Search Bar */}
              <div className="relative flex-1 mx-8" ref={searchRef}>
                <InstantSearch searchClient={searchClient} indexName="products">
                  <CustomSearchBox />
                  <Hit />
                </InstantSearch>
              </div>

              {/* Navigation Icons */}
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

            {/* Desktop Navigation */}
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

        {/* Mega Menu */}
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

      {/* Mobile Menu */}

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  )
}