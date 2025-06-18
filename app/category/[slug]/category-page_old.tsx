// "use client"

// import CategoryCircles from "@/app/components/category-circles"
// import CategoryPageSkeleton from "@/app/components/category-page-skeleton"
// import CategoryPageSkeletonDesktop from "@/app/components/category-page-skelton-dekstop"
// import EmptyProductState from "@/app/components/empty-product"
// import FacetFilter from "@/app/components/facet_filter"
// import FilterAccordionItem from "@/app/components/FilterAccordion"
// import ProductCard from "@/app/components/product-card"
// import { formatCurrency } from "@/app/lib/utils"

// import { Button } from "@/components/ui/button"
// import { Pagination } from "@/components/ui/pagination"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
// import { Slider } from "@/components/ui/slider"
// import { image_base_url } from "@/contant"
// import { useMobile } from "@/hooks/use-mobile"
// import { fetchFacetOptions, fetchFilterOptions, fetchProductsByCategory } from "@/lib/api"
// import { useQuery } from "@tanstack/react-query"
// import { Check, Filter, SlidersHorizontal, SortAsc, X } from "lucide-react"
// import Link from "next/link"
// import { useCallback, useEffect, useMemo, useRef, useState } from "react"

// const FilterContentSkeleton = () => {
//   return (
//     <div className="space-y-6 animate-pulse">
//       {/* Header Skeleton */}
//       <div className="flex items-center justify-between">
//         <div className="h-5 w-24 bg-muted rounded" />
//         <div className="h-8 w-16 bg-muted rounded" />
//       </div>

//       {/* Price Range Skeleton */}
//       <div>
//         <div className="h-5 w-28 bg-muted rounded mb-2" />
//         <div className="h-4 w-full bg-muted rounded" />
//         <div className="flex items-center justify-between mt-2 text-sm">
//           <div className="h-4 w-12 bg-muted rounded" />
//           <div className="h-4 w-12 bg-muted rounded" />
//         </div>
//       </div>

//       {/* Accordion Skeleton */}
//       <div className="space-y-4">
//         {/* Categories */}
//         <div>
//           <div className="h-5 w-24 bg-muted rounded mb-2" />
//           <div className="space-y-2">
//             {[...Array(4)].map((_, idx) => (
//               <div key={idx} className="h-4 w-full bg-muted rounded" />
//             ))}
//           </div>
//         </div>

//         {/* Brands */}
//         <div>
//           <div className="h-5 w-24 bg-muted rounded mb-2" />
//           <div className="space-y-2">
//             {[...Array(4)].map((_, idx) => (
//               <div key={idx} className="h-4 w-full bg-muted rounded" />
//             ))}
//           </div>
//         </div>

//         {/* Ratings */}
//         <div>
//           <div className="h-5 w-24 bg-muted rounded mb-2" />
//           {[...Array(3)].map((_, idx) => (
//             <div key={idx} className="flex items-center space-x-2">
//               <div className="h-4 w-4 bg-muted rounded" />
//               <div className="h-4 w-32 bg-muted rounded" />
//             </div>
//           ))}
//         </div>

//         {/* Discounts */}
//         <div>
//           <div className="h-5 w-24 bg-muted rounded mb-2" />
//           {[...Array(3)].map((_, idx) => (
//             <div key={idx} className="flex items-center space-x-2">
//               <div className="h-4 w-4 bg-muted rounded" />
//               <div className="h-4 w-24 bg-muted rounded" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// // Sort options
// const sortOptions = [
//   // { value: "featured", label: "Featured" },
//   // { value: "newest", label: "Newest Arrivals" },
//   { value: "price-low-high", label: "Price: Low to High" },
//   { value: "price-high-low", label: "Price: High to Low" },
//   { value: "rating", label: "Highest Rated" },
// ]

// type CategoryPageProps = {
//   slug: string
// }

// export default function CategoryPage({ slug }: CategoryPageProps) {
//     const isMobile = useMobile()
//   const [sortBy, setSortBy] = useState("price-low-high")

//   const [priceRange, setPriceRange] = useState([0, 100000])

//   const [isFilterOpen, setIsFilterOpen] = useState(false)
//   const [filterOptions, setFilterOptions] = useState<any>({})
//   const [sortOpen, setSortOpen] = useState(false)
//   const [page, setPage] = useState(1)
//   const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null)
//   const [filterParams, setFilterParams] = useState<{ [key: string]: string[] }>({})
//   const Breadcrumb = (breadcrumbs: any) => {
//     return (
//       <nav className="flex text-sm text-gray-700" aria-label="Breadcrumb">
//         <ol className="inline-flex items-center space-x-1">
//           {breadcrumbs.map((crumb, index) => (
//             <li key={crumb.slug} className="inline-flex items-center">
//               {index !== 0 && (
//                 <svg
//                   className="w-4 h-4 mx-2 text-gray-400"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M7.05 4.05a1 1 0 011.414 0L13 8.586l-4.536 4.536a1 1 0 11-1.414-1.414L10.586 9 7.05 5.464a1 1 0 010-1.414z" />
//                 </svg>
//               )}

//               {index === breadcrumbs.length - 1 ? (
//                 <span className="text-gray-500">{crumb.name}</span>
//               ) : (
//                 <Link href={`/category/${crumb.slug}`} className="text-gray-700 hover:text-blue-600">
//                   {crumb.name}
//                 </Link>
//               )}
//             </li>
//           ))}
//         </ol>
//       </nav>
//     );
//   };

//   const limit = 40
//   const rating_values = useMemo(() => [
//     { id: "1", name: "1" },
//     { id: "2", name: "2" },
//     { id: "3", name: "3" },
//     { id: "4", name: "4" },
//     { id: "5", name: "5" },
//   ], []);
//   const discount_values = useMemo(() => [
//     { id: "10", name: "10% and  above" },
//     { id: "20", name: "20% and  above" },
//     { id: "30", name: "30% and  above" },
//     { id: "40", name: "40% and  above" },
//     { id: "50", name: "50% and  above" },
//     { id: "60", name: "60% and  above" },
//     { id: "70", name: "70% and  above" },
//     { id: "80", name: "80% and  above" },
//     { id: "90", name: "90% and  above" },
//   ], [])

//   const sidebarRef = useRef<HTMLDivElement>(null)

//   const [headerHeight, setHeaderHeight] = useState(80) // Default header height

//   // Calculate sidebar dimensions on mount and resize
//   useEffect(() => {
//     const calculateDimensions = () => {
//       // if (sidebarRef.current) {
//       //   setSidebarHeight(sidebarRef.current.scrollHeight)
//       // }

//       // Try to get header height - assuming header has an ID or class
//       const header = document.querySelector("header")
//       if (header) {
//         setHeaderHeight(header.clientHeight)
//       }
//     }

//     calculateDimensions()
//     window.addEventListener("resize", calculateDimensions)

//     return () => {
//       window.removeEventListener("resize", calculateDimensions)
//     }
//   }, [])
//   const {
//     data: facet_options,

//   } = useQuery({
//     queryKey: ["facet_options", slug],
//     queryFn: () => fetchFacetOptions(slug),
//     staleTime: 0,
//     enabled: !!slug

//   })
//   const {
//     data: options,
//     isLoading: isLoadingOptions,
//     isFetching: isFetchingOptions,
//     isError: isOptionsError,
//   } = useQuery({
//     queryKey: ["filter_options", slug],
//     queryFn: () => fetchFilterOptions(slug as string, limit),
//     enabled: !!slug, // only fetch when slug is available
//   })
//   const handleMultiOptionChange = (attribute: string, selectedOptions: any[]) => {

//     setFilterParams(prev => {
//       if (selectedOptions.length === 0) {
//         // Remove the attribute if no options are selected
//         const { [attribute]: _, ...rest } = prev;
//         return rest;
//       }

//       // Otherwise, update or add the attribute
//       return {
//         ...prev,
//         [attribute]: [...selectedOptions],
//       };
//     });
//   };

//   const handleOptionChange = (attribute: string, option: any) => {

//     // Ensure `option` is a single object, not an array


//     setFilterParams(prev => {
//       const currentOptions = prev[attribute] || [];

//       const newOptions = currentOptions.some((op: any) => op.id === option.id)
//         ? currentOptions.filter((o: any) => o.id !== option.id)
//         : [...currentOptions, option];

//       return {
//         ...prev,
//         [attribute]: newOptions,
//       };
//     });
//   };

//   const filterString: string = useMemo(() => {
//     const params = new URLSearchParams();

//     for (const [key, values] of Object.entries(filterParams)) {
//       if (Array.isArray(values) && values.length > 0) {
//         const ids = values.map((v: any) => v.id).join(',');
//         params.append(encodeURIComponent(key), encodeURIComponent(ids));
//       }
//     }

//     if (priceRange[0] != null) {
//       params.append("minPrice", encodeURIComponent(priceRange[0].toString()));
//     }

//     if (priceRange[1] != null) {
//       params.append("maxPrice", encodeURIComponent(priceRange[1].toString()));
//     }

//     params.append("sort_by", encodeURIComponent(sortBy));
//     params.append("page", encodeURIComponent(page.toString()));
//     params.append("limit", encodeURIComponent(limit.toString()));

//     return params.toString();
//   }, [priceRange, filterParams, sortBy, page, limit]);
//   const {
//     data: product_list,
//     isLoading: isLoadingProducts,
//     isFetching: isFetchingProducts,
//     isError: isProductsError,
//   } = useQuery({
//     queryKey: ["products", slug, filterString],
//     queryFn: () => fetchProductsByCategory(slug as string, filterString),
//     enabled: !!slug && !!options,
//     // Added staleTime to prevent unnecessary refetches
//     staleTime: 30000 // only fetch when slug is available
//   })


//   const resetFilters = () => {
//     setPriceRange([filterOptions.priceRange.min, filterOptions.priceRange.max])
//     setFilterParams({})
//   }
//   const child_cats = options ? options?.child_categories_list : []
//   console.log(child_cats)
//   useEffect(() => {
//     let updated_filter: any = {}

//     if (options) {
//       updated_filter = { ...updated_filter, categories: options.child_categories_list }
//       updated_filter = { ...updated_filter, brands: options.brand_list }
//       updated_filter = { ...updated_filter, priceRange: options.price_range }
//       updated_filter = { ...updated_filter, discounts: discount_values }
//       updated_filter = { ...updated_filter, sizes: options.sizes_list }
//       updated_filter = { ...updated_filter, colors: options.colors_list }

//       updated_filter = { ...updated_filter, ratings: rating_values }
//       updated_filter = { ...updated_filter, page: page }
//       setPriceRange([options.price_range.min, options.price_range.max])
//     }
//     //if(isLoadingOptions)
//     setFilterOptions({ ...filterOptions, ...updated_filter })
//   }, [options, page])

//   const BottomActions = () => {
//     return (
//       <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-between gap-4 z-50">
//         <Button className="w-full" variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
//           <Filter className="w-4 h-4 mr-2" /> Filter
//         </Button>
//         <Button className="w-full" variant="outline" onClick={() => setSortOpen(!sortOpen)}>
//           <SortAsc className="w-4 h-4 mr-2" />  Sort By
//         </Button>
//       </div>
//     )
//   }

//   const FilterContent = useCallback(() => {

//     if (!filterOptions
//     ) {
//       return <FilterContentSkeleton />
//     }

//     let filterSections = [

//       { key: "categories", title: "Categories", options: filterOptions.categories },
//       { key: "brands", title: "Brands", options: filterOptions.brands },
//       { key: "discounts", title: "Discounts", options: filterOptions.discounts },
//       { key: "ratings", title: "Ratings", options: filterOptions.ratings },
//       { key: "sizes", title: "Sizes", options: filterOptions.sizes },
//     ]

//     const mobilefilterSections = Array.isArray(facet_options) ? [...filterSections, ...facet_options] : [...filterSections];


//     const selectedSection = mobilefilterSections.find(section => section.key === selectedAttribute)
//     return isMobile ? (
//       <div className="flex h-full border rounded shadow-sm">
//         {/* Left Navigation Rail */}
//         <div className="w-1/3 max-w-[250px] border-r overflow-y-auto bg-gray-50 ">
//           <ul className="divide-y">
//             {mobilefilterSections.map(section => {
//               if (section.options?.length === 0) return null
//               return <li
//                 key={section.key}
//                 className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${selectedAttribute === section.key ? "bg-white font-semibold" : ""
//                   }`}
//                 onClick={() => setSelectedAttribute(section.key)}
//               >
//                 {section.title}
//               </li>
//             })}
//           </ul>
//         </div>

//         {/* Right: Options for selected attribute */}
//         <div className="flex-1 overflow-y-auto p-4">

//           {selectedSection ? (
//             <div>
//               <h3 className="text-xl font-semibold mb-4">{selectedSection.title}</h3>
//               <div className="space-y-2">
//                 {selectedSection.options.map((option: any, index: number) => {

//                   const isChecked = filterParams[selectedSection.key]?.some((op: any) => op.id === option.id)
//                   return (
//                     <label key={option.name} className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                        className="accent-red-600"
//                         checked={isChecked}
//                         onChange={() => handleOptionChange(selectedSection.key, option)}
//                       />
//                       <span>{option.name}</span>
//                     </label>
//                   )
//                 })}
//               </div>
//             </div>
//           ) :
//             <p className="text-gray-500">Select a filter attribute from the left panel.</p>
//           }
//         </div>

//       </div>
//     ) : (<div>
//       {filterSections.map((section) => {
//         if (section.options?.length === 0) return null
//         return <FilterAccordionItem
//           key={section.key}
//           value={section.key}
//           title={section.title}
//           options={section.options}
//           onChange={(selected: any) => handleMultiOptionChange(section.key, selected)}
//           showSearch={true}
//         />
//       })}



//     </div>)
//   }, [selectedAttribute, isMobile, setSelectedAttribute, setFilterParams,
//     filterOptions, facet_options])



//   const handleRemoveFilter = useCallback((type: any, idToRemove: any) => {
//     const updated: any = { ...filterParams }
//     if (idToRemove) {
//       updated[type] = updated[type].filter(item => item.id !== idToRemove)

//       // Optionally remove the key if the array becomes empty
//       if (updated[type].length === 0) {
//         delete updated[type]
//       }
//       setFilterParams(updated)
//     }
//   }, [filterParams])

//   if (isLoadingOptions)
//     return (
//        isMobile?<CategoryPageSkeleton />:<CategoryPageSkeletonDesktop />
//     )
//   const { products, breadcrumbs, current_page, total_pages, total_products, next_page, prev_page } = product_list || {}
//   const paginationButtonStyles = {
//     base: "h-9 min-w-9 flex items-center justify-center rounded-md border border-input text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
//     active:
//       "bg-red-500 text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground shadow-md shadow-primary/30 ring-2 ring-primary/30 font-medium scale-105 transform transition-transform",
//     inactive: "bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
//     disabled: "pointer-events-none opacity-50 bg-muted text-muted-foreground border-muted-foreground/20",
//   }

//   return (
//     <div className="container py-8">

//       <div className="mb-8 ">
//         {breadcrumbs && Breadcrumb(breadcrumbs)}
//         <h1 className="text-md md:text-xl font-bold mb-2">{options !== undefined && options.categoryName}</h1>

//       </div>

//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Filters - Desktop */}
//         {child_cats.length > 0 && <div className="md:hidden">
//           <CategoryCircles categories={child_cats} />
//         </div>
//         }
//         <div className="hidden md:block w-64 flex-shrink-0">
//           <div
//             ref={sidebarRef}
//             className="sticky border rounded-lg p-4 bg-card shadow-sm"
//             style={{
//               top: `${headerHeight + 20}px`,
//               maxHeight: `calc(100vh - ${headerHeight + 40}px)`,
//               overflowY: "auto",
//               scrollbarWidth: "thin",
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
//               {isLoadingOptions ? (
//                 <div className="flex items-center justify-center h-screen">
//                   <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//                 </div>
//               ) : (
//                 <div>
//                   <h4 className="font-medium mb-6 text-sm">Price Range</h4>
//                   <div className="px-2 !text-xs mb-3">
//                     {filterOptions.priceRange !== undefined && (
//                       <>
//                         <Slider
//                           min={filterOptions.priceRange.min}
//                           max={filterOptions.priceRange.max}
//                           step={1}
//                           value={priceRange}
//                           defaultValue={priceRange}
//                           onValueChange={setPriceRange}
//                         />
//                         <div className="flex items-center justify-between mt-4 text-xs">
//                           <span>{formatCurrency(priceRange[0])}</span>
//                           <span>{formatCurrency(priceRange[1])}</span>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                   <FilterContent />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex-1">
//           {/* Filters and Sort - Mobile */}
//           <div className="hidden md:flex items-center justify-between mb-6 ">
//             {!isMobile && facet_options && <FacetFilter
//               attributes={facet_options}
//               onFilterChange={(attribute: any, selected: any) => handleMultiOptionChange(attribute, selected)} />}

//             <div className="md:hidden">
//               <Button variant="outline" size="sm" className="h-8" onClick={() => setIsFilterOpen(true)}>
//                 <Filter className="h-4 w-4 mr-2" />
//                 Filters
//               </Button>

//             </div>

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
//                   {sortOptions.map((option) => (
//                     <SelectItem key={option.value} value={option.value}>
//                       {option.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Active Filters */}
//           {(Object.keys(filterParams).length > 0 ||
//             (filterOptions.priceRange &&
//               (priceRange[0] > filterOptions.priceRange.min || priceRange[1] < filterOptions.priceRange.max))) && (
//               <div className="flex flex-wrap gap-2 mb-6">
//                 {/* Price Filter Chip */}
//                 {filterOptions.priceRange &&
//                   (priceRange[0] > filterOptions.priceRange.min || priceRange[1] < filterOptions.priceRange.max) && (
//                     <div className="flex items-center bg-muted text-sm rounded-full px-3 py-1">
//                       <span>
//                         Price: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
//                       </span>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="h-5 w-5 p-0 ml-1"
//                         onClick={() => setPriceRange([filterOptions.priceRange.min, filterOptions.priceRange.max])}
//                       >
//                         <X className="h-3 w-3" />
//                         <span className="sr-only">Remove price filter</span>
//                       </Button>
//                     </div>
//                   )}

//                 {/* Dynamic Filter Chips */}
//                 {Object.keys(filterParams).map((key) => {
//                   const values = filterParams[key];
//                   if (!Array.isArray(values) || values.length === 0) return null;

//                   return values.map((op: any, index) => (
//                     <div key={`${op.id}-${index}`} className="flex items-center bg-muted text-sm rounded-full px-3 py-1">
//                       <span>{op.name}</span>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="h-5 w-5 p-0 ml-1"
//                         onClick={() => handleRemoveFilter(key, op.id)}
//                       >
//                         <X className="h-3 w-3" />
//                         <span className="sr-only">Remove {key} filter</span>
//                       </Button>
//                     </div>
//                   ));
//                 })}

//                 {/* Show "Clear All" only if filterParams is not empty */}
//                 {Object.keys(filterParams).length > 0 && (
//                   <Button variant="outline" size="sm" className="h-7 text-xs" onClick={resetFilters}>
//                     Clear All
//                   </Button>
//                 )}
//               </div>
//             )}

//           {isLoadingProducts || isFetchingProducts ? (
//             <div className="flex items-center justify-center">
//               <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
//             </div>
//           ) : !products || products.length === 0 ? (
//             <EmptyProductState />
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1">
//               {products.map((product: any) => (
//                 <ProductCard key={product.id} {...product} image={`${image_base_url}/products/${product.id}/${product.image}`}/>
//               ))}
//             </div>
//           )}


//           {total_pages > 1 && (
//             <div className="flex justify-center mt-8 mb-4">
//               <Pagination currentPage={current_page} totalPages={total_pages} onPageChange={function (page: number): void {
//                 page <= total_pages && setPage(page)
//               }} />

//             </div>
//           )}
//         </div>
//       </div>
//       <BottomActions />
//       {/* Mobile Filter Sheet */}
//       <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
//         <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl py-5 px-0">
//           <SheetHeader className="border-b p-4 ">
//             <SheetTitle className="text-left">Filters</SheetTitle>
//           </SheetHeader>
//           <div className="overflow-y-auto h-full ">
//             <FilterContent />
//           </div>
//           <div className="absolute bottom-0  left-0 right-0 p-4 bg-background border-t">
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
//       <Sheet open={sortOpen} onOpenChange={setSortOpen}>
//         {/* <SheetTrigger asChild>
//             <Button className="w-full">
//               <SortAsc className="w-4 h-4 mr-2" />
//               Sort&nbsp;By
//             </Button>
//           </SheetTrigger> */}

//         <SheetContent side="bottom" className="space-y-4 pb-8">
//           <SheetHeader>
//             <SheetTitle className="text-center">Sort By</SheetTitle>
//           </SheetHeader>

//           <div className="space-y-3">
//             {sortOptions.map((option) => (
//               <button
//                 key={option.value}
//                 onClick={() => setSortBy(option.value)}
//                 className="w-full flex items-center text-left px-4 py-2 rounded-md hover:bg-gray-100 transition"
//               >
//                 <div className="w-5">
//                   {sortBy === option.value && (
//                     <Check className="w-4 h-4 text-green-500" />
//                   )}
//                 </div>
//                 <div className="flex items-center">

//                   <span className="ml-2">{option.label}</span>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   )
// }
