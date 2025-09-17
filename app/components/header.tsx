"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"
import { Category } from "@/interfaces"
import { fetchTopCategories } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import algoliasearch from "algoliasearch/lite"
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  CreditCard,
  Heart,
  HeartIcon,
  HelpCircle,
  LogOut,
  MapPin,
  Package,
  Search,
  SearchIcon,
  ShoppingCart,
  User
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
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
import WhatsAppChatButton from "./whatsapp-chat-btn"

const searchClient = algoliasearch('T55UYZ1VAO', 'edca52cad205b2840b5f090e24b83149')

const CustomSearchBox = ({ setOpen }) => {
  const { query, refine } = useSearchBox()
  const { setUiState }: any = useInstantSearch()
  const [inputValue, setInputValue] = useState(query)
  const { totalItems } = useCart()
  const { items: wishListItems } = useWishlist()
  const pathname = usePathname()
   

  const parseQuery = (query: string) => {
    const filters: string[] = []
    let cleanedQuery = query
    // ... existing parseQuery implementation ...
    return { query: cleanedQuery.trim(), filters: filters.join(' AND ') }
  }

  useLayoutEffect(() => {
    const { query, filters } = parseQuery(inputValue)
    refine(query)
    setUiState((uiState: any) => ({
      ...uiState,
      products: { ...uiState.products, filters }
    }))
    setOpen(true)
  }, [inputValue])

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Search here ..."
      className="w-full  border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  )
}

const SearchResults = () => {
  const { hits } = useHits()
  const { query } = useSearchBox()
  const router = useRouter()

  // const groupedHits = hits.reduce((acc: Record<string, any[]>, hit: any) => {
  //   const category = hit.category || 'Uncategorized'
  //   if (!acc[category]) acc[category] = []
  //   acc[category].push(hit)
  //   return acc
  // }, {})

  if (!query.trim()) return null

  return (
    <>
      {hits.length > 0 ? (
        hits.map((item: any, index: number) => (
          <div key={index} className="p-3">
            <Link href={`/category/${item.slug}`} >
              <h4 className="text-xs font-medium items-center text-muted-foreground flex flex-row gap-2">
                <SearchIcon size={13} /> {query} <span className="font-bold text-black text-xs">{item?.name}</span></h4>
            </Link>
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
  const [showSearch, setShowSearch] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMobile()
  const { totalItems, setIsOpen } = useCart()
  const [isHoveringMenu, setIsHoveringMenu] = useState(false)
  const [isHoveringMegaMenu, setIsHoveringMegaMenu] = useState(false)
  const { items: wishlistItems } = useWishlist()
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringOther, setIsHoveringOther] = useState(false);

  useEffect(() => {
    // Show bar after component mounts
    setIsVisible(true);
  }, []);
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
        setShowSearch(false)
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
   // document.addEventListener("mouseover", handleClickOutside)
    
     const nav = document.querySelector(".olip");

    if (!nav) return;

    const handleEnter = () => setIsHoveringOther(true);
  const handleLeave = () => setIsHoveringOther(false);
    nav.addEventListener("mouseenter", handleEnter);
    nav.addEventListener("mouseleave", handleLeave);
    return () => {
      
      nav.removeEventListener("mouseenter", handleEnter);
      nav.removeEventListener("mouseleave", handleLeave);
     
    };
  }, [])
const menuMouseEvent=()=>{
  setIsHoveringMegaMenu(false)
  setIsHoveringMenu(false)
  //setActiveMegaMenu(null)
}
useEffect(()=>{
  console.log('isHoveringOther',isHoveringOther)
  isHoveringOther && setActiveMegaMenu(null)
},[isHoveringOther])
  const getPageTitle = () => {

    if (pathname === '/') return 'Home'
    else if (pathname === '/auth/login' || pathname === '/auth/register' || pathname.includes('/product')) return 'Back'
    else {
      const parts = pathname.split('/').filter(p => p)
      const lastSegment = parts[parts.length - 1]

      return lastSegment
        .split(/[-_]/) // split on both hyphen and underscore
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }




  }

  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register'
  const isHeaderVisible = !isMobile || (isMobile && !isAuthPage)
  const handlWishlistOpen = useCallback(() => {
    router.push('/wishlist')
  }, [])
  useEffect(()=>{

  },[
isHoveringOther
  ])

   
  return (
    <>
      <header className={`sticky top-0 md:static md:top-auto z-40 w-full transition-all duration-200 ${isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background"}`}>
       {/* Mobile Header */}
        <div
          className="md:hidden"
         >
          <div className="container py-3 flex px-3 items-center justify-between  gap-3">
            <div className="flex items-center gap-2">
              {pathname !== '/' ? (
                <>
                  <Button variant="ghost" size="icon" onClick={() => router.back()} className="bg-gray-100">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <span className="font-bold text-lg truncate text-primary ">{getPageTitle()}</span>
                </>
              ) : (
                <Link href="/" className="flex items-center">
                   <Image src="/images/logo.png" alt="Colour Indigo" width={110} height={130}  />                </Link>
              )}
            </div>
             {pathname === '/' &&
                  <div className="relative cursor-text w-full" onClick={() => setShowMobileSearch(true)}>
                    <input
                      type="text"
                      placeholder="Search products.."
                      readOnly
                      className="w-full rounded-full border border-input bg-background px-4 py-2 text-sm"
                    />
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>

                }
            <div className="flex items-center gap-1">
              {pathname === '/' && <div className="flex flex-row gap-3 items-center">
              <Bell  size={38} onClick={()=>router.push('/notifications')} />
                 <WhatsAppChatButton />
              </div>
              
             
              }


              
              {(pathname.includes('/product') || pathname.includes('/category') || pathname.includes('/collection')) &&
                <>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="relative">
                    <ShoppingCart className="h-10 w-10" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handlWishlistOpen}
                   className="relative mr-2">
                    <HeartIcon className="h-10 w-10" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Button>
                </>
              }

            </div>

           


          </div>

        </div>


        {/* Mobile Search Bottom Sheet */}
        <Sheet open={showMobileSearch} onOpenChange={setShowMobileSearch}>
          <SheetContent
            ref={searchRef}
            side="bottom"
            className="w-full h-[92vh] rounded-t-2xl p-0 flex flex-col border-none shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <SheetHeader>
              <SheetTitle></SheetTitle></SheetHeader>
            {/* Sticky Header */}


            {/* Search Content */}

            <div className="flex-1 overflow-y-auto px-4 py-6">
              <InstantSearch searchClient={searchClient} indexName="categories">
                <div className="flex flex-col gap-3">
                  <CustomSearchBox setOpen={(v) => setShowSearch(v)} />
                  <div className="flex-1 overflow-y-auto">
                    <SearchResults />
                  </div>
                </div>
              </InstantSearch>
            </div>
          </SheetContent>
        </Sheet>



        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="container py-4 px-0 ">
            <div className="flex items-center justify-between olip">
              <Link href="/" className="flex items-center">
                <Image src="/images/logo.png" alt="Colour Indigo" width={150} height={50} className="h-14 w-auto" />
              </Link>

              <div className="relative flex-1 mx-8" ref={searchRef}>
                <InstantSearch searchClient={searchClient} indexName="categories">
                  <CustomSearchBox setOpen={() => setShowSearch(true)} />
                  {showSearch &&
                    <div className="absolute top-full left-0 right-0 mt-1 bg-background  rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto">
                      <SearchResults />
                    </div>
                  }
                </InstantSearch>
              </div>


              <div className="flex items-center justify-content-end gap-0">
                <div className="relative" ref={accountRef}>
                  {isAuthenticated ? (
                    <button
                      className="flex items-center text-sm font-medium"
                      onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                    >
                      <User className="h-5 w-5 mr-1" />
                      <span>Profile</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      className="flex items-center text-md font-medium"
                      onClick={() => router.push('/auth/login')}
                    >
                      <User className="h-5 w-5 mr-1" />
                      <span>Login</span>
                    </button>
                  )}
                  {showAccountDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-3 border-b bg-gray-50">
                        <p className="text-sm font-medium text-gray-800">Hello, {user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      {/* Menu */}
                      <ul className="divide-y divide-gray-100">
                        <li>
                          <a
                            href="/customer/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <User size={16} /> My Profile
                          </a>
                        </li>
                        <li>
                          <a
                            href="/customer/orders"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Package size={16} /> My Orders
                          </a>
                        </li>
                        <li>
                          <a
                            href="/wishlist"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Heart size={16} /> My Wishlist
                          </a>
                        </li>
                        <li>
                          <a
                            href="/customer/addresses"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <MapPin size={16} /> My Addresses
                          </a>
                        </li>
                        <li>
                          <a
                            href="/customer/payment"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <CreditCard size={16} />Payment Methods
                          </a>
                        </li>
                        <li>
                          <a
                            href="/customer/help"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <HelpCircle size={16} /> Help & Support
                          </a>
                        </li>
                       
                        <li>
                          <button
                            onClick={logout}
                            className="flex items-center w-full gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}

                </div>

                <Link href="/wishlist" className="p-0 m-0 flex items-center text-sm font-medium">
                  <Button variant="ghost" size="icon" className="p-0 m-0 relative">
                    <Heart className="h-5 w-5" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link href="/notifications" className="text-sm font-medium">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    
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
            <div className="hidden md:flex items-center justify-center w-full space-x-4 px-4 ">

              {/* <div className="flex-1 border-t border-red-300"></div> */}


              <div className="text-center font-semibold text-gray-700 text-lg">
                <nav className="grid grid-cols-3 items-center  border-2 border-[#cca6a6] bg-red-800 md:max-w-[700px] mx-auto py-1 rounded-full" >
                  {/* Centered Menu */}
                  <div className="col-start-2 flex justify-center ">
                    <ul className="flex space-x-8">
                      <li onMouseLeave={menuMouseEvent}
                        onMouseOut={() => setIsHoveringMenu(false)}>
                        <Link href="/"
                          className=" mt-1 transition-all duration-300 
                              transform hover:bg-black w-26 h-8 px-5 py-2 hover:rounded-none hover:text-white text-white flex items-center text-sm font-medium uppercase relative group">
                          Home
                          {/* <span className="absolute left-0 -bottom-1.5 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span> */}
                        </Link>
                      </li>
                      {categories.map((category) => (
                        <li
                          key={category.id}
                          className="relative pt-[3px]"
                          onMouseEnter={() => {
                            setActiveMegaMenu(category.slug)
                            setIsHoveringMenu(true)
                          }}
                          onMouseLeave={menuMouseEvent}
                          onMouseOut={menuMouseEvent}
                        >
                          <button className="transition-all duration-300 transform hover:bg-black w-25 h-8 px-5 py-2 rounded-none hover:text-white text-white flex items-center text-sm font-medium uppercase  relative group">
                            {category.name}
                            {/* <span className="absolute left-0 -bottom-1.5 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span> */}

                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Aligned Sell Button */}

                </nav>
              </div>


              {/* <div className="flex-1 border-t border-red-300"></div> */}
            </div>


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


      <CartDrawer />
    </>
  )
}