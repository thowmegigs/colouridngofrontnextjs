// "use client"

// import CategoryCircles from "@/app/components/category-circles"
// import CategoryPageSkeleton from "@/app/components/category-page-skeleton"
// import CategoryPageSkeletonDesktop from "@/app/components/category-page-skelton-dekstop"
// import EmptyProductState from "@/app/components/empty-product"
// import FacetFilter from "@/app/components/facet_filter"
// import FilterAccordionItem from "@/app/components/FilterAccordion"
// import ProductCard from "@/app/components/product-card"
// import { useMediaQuery } from "@/app/hooks/use-mobile"
// import { formatCurrency } from "@/app/lib/utils"

// import { Button } from "@/components/ui/button"
// import { Pagination } from "@/components/ui/pagination"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
// import { Slider } from "@/components/ui/slider"
// import { fetchFacetOptions, fetchFilterOptions, fetchProductsByCategory } from "@/lib/api"
// import { useQuery } from "@tanstack/react-query"
// import { Check, Filter, SlidersHorizontal, SortAsc, X } from "lucide-react"
// import Link from "next/link"
// import { useCallback, useEffect, useMemo, useRef, useState } from "react"

// const FilterContentSkeleton = () => (
//   <div className="space-y-6 animate-pulse">
//     <div className="flex items-center justify-between">
//       <div className="h-5 w-24 bg-muted rounded" />
//       <div className="h-8 w-16 bg-muted rounded" />
//     </div>
//     <div>
//       <div className="h-5 w-28 bg-muted rounded mb-2" />
//       <div className="h-4 w-full bg-muted rounded" />
//       <div className="flex items-center justify-between mt-2 text-sm">
//         <div className="h-4 w-12 bg-muted rounded" />
//         <div className="h-4 w-12 bg-muted rounded" />
//       </div>
//     </div>
//     <div className="space-y-4">
//       {[...Array(4)].map((_, idx) => (
//         <div key={idx}>
//           <div className="h-5 w-24 bg-muted rounded mb-2" />
//           <div className="space-y-2">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="h-4 w-full bg-muted rounded" />
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// )

// const SORT_OPTIONS = [
//   { value: "price-low-high", label: "Price: Low to High" },
//   { value: "price-high-low", label: "Price: High to Low" },
//   { value: "rating", label: "Highest Rated" },
// ]

// const RATING_VALUES = [
//   { id: "1", name: "1" },
//   { id: "2", name: "2" },
//   { id: "3", name: "3" },
//   { id: "4", name: "4" },
//   { id: "5", name: "5" },
// ]

// const DISCOUNT_VALUES = [
//   { id: "10", name: "10% and above" },
//   { id: "20", name: "20% and above" },
//   { id: "30", name: "30% and above" },
//   { id: "40", name: "40% and above" },
//   { id: "50", name: "50% and above" },
//   { id: "60", name: "60% and above" },
//   { id: "70", name: "70% and above" },
//   { id: "80", name: "80% and above" },
//   { id: "90", name: "90% and above" },
// ]

// type CategoryPageProps = {
//   slug: string
// }

// const Breadcrumb = ({ breadcrumbs }: { breadcrumbs: any[] }) => (
//   <nav className="flex text-sm text-gray-700" aria-label="Breadcrumb">
//     <ol className="inline-flex items-center space-x-1">
//       {breadcrumbs.map((crumb, index) => (
//         <li key={crumb.slug} className="inline-flex items-center">
//           {index !== 0 && (
//             <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M7.05 4.05a1 1 0 011.414 0L13 8.586l-4.536 4.536a1 1 0 11-1.414-1.414L10.586 9 7.05 5.464a1 1 0 010-1.414z" />
//             </svg>
//           )}
//           {index === breadcrumbs.length - 1 ? (
//             <span className="text-gray-500">{crumb.name}</span>
//           ) : (
//             <Link href={`/category/${crumb.slug}`} className="text-gray-700 hover:text-primary">
//               {crumb.name}
//             </Link>
//           )}
//         </li>
//       ))}
//     </ol>
//   </nav>
// )

// const BottomActions = ({ onFilterOpen, onSortOpen }: { 
//   onFilterOpen: () => void, 
//   onSortOpen: () => void 
// }) => (
//   <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-between gap-4 z-50">
//     <Button className="w-full" variant="outline" onClick={onFilterOpen}>
//       <Filter className="w-4 h-4 mr-2" /> Filter
//     </Button>
//     <Button className="w-full" variant="outline" onClick={onSortOpen}>
//       <SortAsc className="w-4 h-4 mr-2" /> Sort By
//     </Button>
//   </div>
// )

// export default function CategoryPage({ slug }: CategoryPageProps) {
//   const [sortBy, setSortBy] = useState("price-low-high")
//   const [priceRange, setPriceRange] = useState([0, 100000])
//   const [isFilterOpen, setIsFilterOpen] = useState(false)
//   const [sortOpen, setSortOpen] = useState(false)
//   const [page, setPage] = useState(1)
//   const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null)
//   const [filterParams, setFilterParams] = useState<Record<string, any[]>>({})
//   const sidebarRef = useRef<HTMLDivElement>(null)
//   const [headerHeight, setHeaderHeight] = useState(80)
//   const isMobile = useMediaQuery("(max-width: 768px)")

//   const { data: facet_options } = useQuery({
//     queryKey: ["facet_options", slug],
//     queryFn: () => fetchFacetOptions(slug),
//     staleTime: 60_000,
//     enabled: !!slug
//   })

//   const { 
//     data: options, 
//     isLoading: isLoadingOptions, 
//     isError: isOptionsError 
//   } = useQuery({
//     queryKey: ["filter_options", slug],
//     queryFn: () => fetchFilterOptions(slug, 40),
//     enabled: !!slug,
//   })

//   const filterString = useMemo(() => {
//     const params = new URLSearchParams()
//     params.append("sort_by", sortBy)
//     params.append("page", page.toString())
//     params.append("limit", "40")

//     if (priceRange[0] !== null) params.append("minPrice", priceRange[0].toString())
//     if (priceRange[1] !== null) params.append("maxPrice", priceRange[1].toString())

//     for (const [key, values] of Object.entries(filterParams)) {
//       if (values?.length) {
//         params.append(key, values.map(v => v.id).join(','))
//       }
//     }

//     return params.toString()
//   }, [priceRange, filterParams, sortBy, page])

//   const { 
//     data: product_list, 
//     isLoading: isLoadingProducts, 
//     isFetching: isFetchingProducts 
//   } = useQuery({
//     queryKey: ["products", slug, filterString],
//     queryFn: () => fetchProductsByCategory(slug, filterString),
//     enabled: !!slug && !!options,
//     staleTime: 30000
//   })

//   const child_cats = useMemo(() => options?.child_categories_list || [], [options])
//   const filterOptions = useMemo(() => {
//     if (!options) return null
//     return {
//       categories: options.child_categories_list,
//       brands: options.brand_list,
//       priceRange: options.price_range,
//       discounts: DISCOUNT_VALUES,
//       sizes: options.sizes_list,
//       colors: options.colors_list,
//       ratings: RATING_VALUES,
//     }
//   }, [options])

//   const handleOptionChange = useCallback((attribute: string, option: any) => {
//     setFilterParams(prev => {
//       const current = prev[attribute] || []
//       const exists = current.some((v: any) => v.id === option.id)
      
//       return {
//         ...prev,
//         [attribute]: exists 
//           ? current.filter((v: any) => v.id !== option.id) 
//           : [...current, option]
//       }
//     })
//   }, [])

//   const handleMultiOptionChange = useCallback((attribute: string, selected: any[]) => {
//     setFilterParams(prev => {
//       if (!selected.length) {
//         const { [attribute]: _, ...rest } = prev
//         return rest
//       }
//       return { ...prev, [attribute]: selected }
//     })
//   }, [])

//   const handleRemoveFilter = useCallback((type: string, idToRemove: string) => {
//     setFilterParams(prev => {
//       const updated = { ...prev }
//       if (updated[type]) {
//         updated[type] = updated[type].filter(item => item.id !== idToRemove)
//         if (!updated[type].length) delete updated[type]
//       }
//       return updated
//     })
//   }, [])

//   const resetFilters = useCallback(() => {
//     if (filterOptions) {
//       setPriceRange([filterOptions.priceRange.min, filterOptions.priceRange.max])
//     }
//     setFilterParams({})
//   }, [filterOptions])

//   useEffect(() => {
//     const calculateDimensions = () => {
//       if (sidebarRef.current) {
//         const header = document.querySelector("header")
//         if (header) setHeaderHeight(header.clientHeight)
//       }
//     }

//     calculateDimensions()
//     window.addEventListener("resize", calculateDimensions)
//     return () => window.removeEventListener("resize", calculateDimensions)
//   }, [])

//   useEffect(() => {
//     if (options?.price_range) {
//       setPriceRange([options.price_range.min, options.price_range.max])
//     }
//   }, [options])

//   const FilterContent = useCallback(() => {
//     if (!filterOptions) return <FilterContentSkeleton />

//     const filterSections = [
//       { key: "categories", title: "Categories", options: filterOptions.categories },
//       { key: "brands", title: "Brands", options: filterOptions.brands },
//       { key: "discounts", title: "Discounts", options: filterOptions.discounts },
//       { key: "ratings", title: "Ratings", options: filterOptions.ratings },
//       { key: "sizes", title: "Sizes", options: filterOptions.sizes },
//     ]

//     const mobileSections = facet_options 
//       ? [...filterSections, ...facet_options] 
//       : [...filterSections]

//     const selectedSection = mobileSections.find(s => s.key === selectedAttribute)

//     if (isMobile) {
//       return (
//         <div className="flex h-full border rounded shadow-sm">
//           <div className="w-1/3 max-w-[250px] border-r overflow-y-auto bg-gray-50">
//             <ul className="divide-y">
//               {mobileSections.map(section => (
//                 section.options?.length > 0 && (
//                   <li
//                     key={section.key}
//                     className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
//                       selectedAttribute === section.key ? "bg-white font-semibold" : ""
//                     }`}
//                     onClick={() => setSelectedAttribute(section.key)}
//                   >
//                     {section.title}
//                   </li>
//                 )
//               ))}
//             </ul>
//           </div>
          
//           <div className="flex-1 overflow-y-auto p-4">
//             {selectedSection ? (
//               <div>
//                 <h3 className="text-xl font-semibold mb-4">{selectedSection.title}</h3>
//                 <div className="space-y-2">
//                   {selectedSection.options.map((option: any) => {
//                     const isChecked = filterParams[selectedSection.key]?.some(
//                       (op: any) => op.id === option.id
//                     )
//                     return (
//                       <label key={option.id} className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           checked={isChecked}
//                           onChange={() => handleOptionChange(selectedSection.key, option)}
//                         />
//                         <span>{option.name}</span>
//                       </label>
//                     )
//                   })}
//                 </div>
//               </div>
//             ) : (
//               <p className="text-gray-500">Select a filter attribute</p>
//             )}
//           </div>
//         </div>
//       )
//     }

//     return (
//       <>
//         {filterSections.map(section => section.options?.length > 0 && (
//           <FilterAccordionItem
//             key={section.key}
//             value={section.key}
//             title={section.title}
//             options={section.options}
//             onChange={selected => handleMultiOptionChange(section.key, selected)}
//             showSearch={true}
//           />
//         ))}
//       </>
//     )
//   }, [filterOptions, facet_options, selectedAttribute, isMobile, filterParams])

//   if (isLoadingOptions) {
//     return isMobile ? <CategoryPageSkeleton /> : <CategoryPageSkeletonDesktop />
//   }

//   const { products, breadcrumbs, current_page, total_pages } = product_list || {}
//   const hasActiveFilters = Object.keys(filterParams).length > 0 || 
//     (filterOptions?.priceRange && (
//       priceRange[0] > filterOptions.priceRange.min || 
//       priceRange[1] < filterOptions.priceRange.max
//     ))

//   return (
//     <div className="container py-8">
//       <div className="mb-8 hidden md:block">
//         {breadcrumbs && <Breadcrumb breadcrumbs={breadcrumbs} />}
//         <h1 className="text-md md:text-xl font-bold mb-2">
//           {options?.categoryName || "Category"}
//         </h1>
//       </div>

//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Desktop Filters */}
//         {child_cats.length > 0 && (
//           <div className="md:hidden">
//             <CategoryCircles categories={child_cats} />
//           </div>
//         )}
        
//         <div className="hidden md:block w-64 flex-shrink-0">
//           <div
//             ref={sidebarRef}
//             className="sticky border rounded-lg p-4 bg-card shadow-sm"
//             style={{
//               top: `${headerHeight + 20}px`,
//               maxHeight: `calc(100vh - ${headerHeight + 40}px)`,
//               overflowY: "auto",
//             }}
//           >
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-medium">Filters</h3>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={resetFilters}
//                   className="h-8 text-muted-foreground hover:text-foreground"
//                 >
//                   Reset
//                 </Button>
//               </div>
              
//               {filterOptions ? (
//                 <>
//                   <h4 className="font-medium mb-6 text-sm">Price Range</h4>
//                   <div className="px-2 !text-xs mb-3">
//                     <Slider
//                       min={filterOptions.priceRange.min}
//                       max={filterOptions.priceRange.max}
//                       step={1}
//                       value={priceRange}
//                       onValueChange={setPriceRange}
//                     />
//                     <div className="flex items-center justify-between mt-4 text-xs">
//                       <span>{formatCurrency(priceRange[0])}</span>
//                       <span>{formatCurrency(priceRange[1])}</span>
//                     </div>
//                   </div>
//                   <FilterContent />
//                 </>
//               ) : (
//                 <FilterContentSkeleton />
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1">
//           <div className="hidden md:flex items-center justify-between mb-6">
//             {facet_options && (
//               <FacetFilter
//                 attributes={facet_options}
//                 onFilterChange={handleMultiOptionChange}
//               />
//             )}
            
//             <div className="flex items-center ml-auto">
//               <div className="flex items-center mr-2 text-sm text-muted-foreground">
//                 <span className="hidden sm:inline">Sort by:</span>
//                 <SlidersHorizontal className="h-4 w-4 sm:hidden mr-2" />
//               </div>
//               <Select value={sortBy} onValueChange={setSortBy}>
//                 <SelectTrigger className="w-[180px] h-8 text-sm">
//                   <SelectValue placeholder="Sort by" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {SORT_OPTIONS.map(option => (
//                     <SelectItem key={option.value} value={option.value}>
//                       {option.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Active Filters */}
//           {hasActiveFilters && (
//             <div className="flex flex-wrap gap-2 mb-6">
//               {filterOptions?.priceRange && (
//                 priceRange[0] > filterOptions.priceRange.min || 
//                 priceRange[1] < filterOptions.priceRange.max
//               ) && (
//                 <div className="flex items-center bg-muted text-sm rounded-full px-3 py-1">
//                   <span>
//                     Price: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
//                   </span>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-5 w-5 p-0 ml-1"
//                     onClick={() => setPriceRange([
//                       filterOptions.priceRange.min, 
//                       filterOptions.priceRange.max
//                     ])}
//                   >
//                     <X className="h-3 w-3" />
//                   </Button>
//                 </div>
//               )}

//               {Object.entries(filterParams).map(([key, values]) => 
//                 values.map((op: any) => (
//                   <div key={`${key}-${op.id}`} className="flex items-center bg-muted text-sm rounded-full px-3 py-1">
//                     <span>{op.name}</span>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="h-5 w-5 p-0 ml-1"
//                       onClick={() => handleRemoveFilter(key, op.id)}
//                     >
//                       <X className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 ))
//               )}

//               <Button 
//                 variant="outline" 
//                 size="sm" 
//                 className="h-7 text-xs" 
//                 onClick={resetFilters}
//               >
//                 Clear All
//               </Button>
//             </div>
//           )}

//           {/* Product Grid */}
//           {isLoadingProducts || isFetchingProducts ? (
//             <div className="flex items-center justify-center h-64">
//               <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
//             </div>
//           ) : !products?.length ? (
//             <EmptyProductState />
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1">
//               {products.map((product: any) => (
//                 <ProductCard key={product.id} {...product} />
//               ))}
//             </div>
//           )}

//           {/* Pagination */}
//           {total_pages > 1 && (
//             <div className="flex justify-center mt-8 mb-4">
//               <Pagination 
//                 currentPage={current_page || 1} 
//                 totalPages={total_pages || 1} 
//                 onPageChange={setPage} 
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile Actions */}
//       <BottomActions 
//         onFilterOpen={() => setIsFilterOpen(true)} 
//         onSortOpen={() => setSortOpen(true)} 
//       />

//       {/* Mobile Filter Sheet */}
//       <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
//         <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl py-5 px-0">
//           <SheetHeader className="border-b p-4">
//             <SheetTitle className="text-left">Filters</SheetTitle>
//           </SheetHeader>
//           <div className="overflow-y-auto h-full">
//             <FilterContent />
//           </div>
//           <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
//             <div className="flex gap-4">
//               <Button variant="outline" className="flex-1" onClick={resetFilters}>
//                 Reset
//               </Button>
//               <Button className="flex-1" onClick={() => setIsFilterOpen(false)}>
//                 Apply Filters
//               </Button>
//             </div>
//           </div>
//         </SheetContent>
//       </Sheet>

//       {/* Mobile Sort Sheet */}
//       <Sheet open={sortOpen} onOpenChange={setSortOpen}>
//         <SheetContent side="bottom" className="space-y-4 pb-8">
//           <SheetHeader>
//             <SheetTitle className="text-center">Sort By</SheetTitle>
//           </SheetHeader>
//           <div className="space-y-3">
//             {SORT_OPTIONS.map(option => (
//               <button
//                 key={option.value}
//                 onClick={() => {
//                   setSortBy(option.value)
//                   setSortOpen(false)
//                 }}
//                 className="w-full flex items-center text-left px-4 py-2 rounded-md hover:bg-gray-100 transition"
//               >
//                 <div className="w-5">
//                   {sortBy === option.value && <Check className="w-4 h-4 text-green-500" />}
//                 </div>
//                 <span className="ml-2">{option.label}</span>
//               </button>
//             ))}
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   )
// }