"use client"

import FilterAccordionItem from "@/app/components/FilterAccordion"
import ProductCard from "@/app/components/product-card"
import { useMediaQuery } from "@/app/hooks/use-mobile"
import { cn, formatCurrency } from "@/app/lib/utils"

import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { fetchCollectionProducts, fetchColletionCatAndBrand } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight, Filter, SlidersHorizontal, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

const FilterContentSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 bg-muted rounded" />
        <div className="h-8 w-16 bg-muted rounded" />
      </div>

      {/* Price Range Skeleton */}
      <div>
        <div className="h-5 w-28 bg-muted rounded mb-2" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="flex items-center justify-between mt-2 text-sm">
          <div className="h-4 w-12 bg-muted rounded" />
          <div className="h-4 w-12 bg-muted rounded" />
        </div>
      </div>

      {/* Accordion Skeleton */}
      <div className="space-y-4">
        {/* Categories */}
        <div>
          <div className="h-5 w-24 bg-muted rounded mb-2" />
          <div className="space-y-2">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-4 w-full bg-muted rounded" />
            ))}
          </div>
        </div>

        {/* Brands */}
        <div>
          <div className="h-5 w-24 bg-muted rounded mb-2" />
          <div className="space-y-2">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-4 w-full bg-muted rounded" />
            ))}
          </div>
        </div>

        {/* Ratings */}
        <div>
          <div className="h-5 w-24 bg-muted rounded mb-2" />
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
          ))}
        </div>

        {/* Discounts */}
        <div>
          <div className="h-5 w-24 bg-muted rounded mb-2" />
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Sort options
const sortOptions = [
  // { value: "featured", label: "Featured" },
  // { value: "newest", label: "Newest Arrivals" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
]

type CategoryPageProps = {
  slug: string
}

export default function CollectionPage({ slug }: CategoryPageProps) {
  const [sortBy, setSortBy] = useState("price-low-high")
  const [totalages, setTotalPages] = useState(0)
  const [priceRange, setPriceRange] = useState([0, 100000])

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterOptions, setFilterOptions] = useState<any>({})
  const [facetOptions, setFacetOptions] = useState<any>({})
  const [page, setPage] = useState(1)
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null)
  const [filterParams, setFilterParams] = useState<{ [key: string]: string[] }>({})

 
  const limit = 1
  const rating_values = useMemo(() => [
  { id: "1", name: "1" },
  { id: "2", name: "2" },
  { id: "3", name: "3" },
  { id: "4", name: "4" },
  { id: "5", name: "5" },
], []);
  const discount_values = useMemo(()=>[
    { id: "10", name: "10% and  above" },
    { id: "20", name: "20% and  above" },
    { id: "30", name: "30% and  above" },
    { id: "40", name: "40% and  above" },
    { id: "50", name: "50% and  above" },
    { id: "60", name: "60% and  above" },
    { id: "70", name: "70% and  above" },
    { id: "80", name: "80% and  above" },
    { id: "90", name: "90% and  above" },
  ],[])

  const sidebarRef = useRef<HTMLDivElement>(null)
  const [sidebarHeight, setSidebarHeight] = useState(0)
  const [headerHeight, setHeaderHeight] = useState(80) // Default header height

  // Calculate sidebar dimensions on mount and resize
  useEffect(() => {
    const calculateDimensions = () => {
      if (sidebarRef.current) {
        setSidebarHeight(sidebarRef.current.scrollHeight)
      }

      // Try to get header height - assuming header has an ID or class
      const header = document.querySelector("header")
      if (header) {
        setHeaderHeight(header.clientHeight)
      }
    }

    calculateDimensions()
    window.addEventListener("resize", calculateDimensions)

    return () => {
      window.removeEventListener("resize", calculateDimensions)
    }
  }, [])
  const {
    data: collection_cat_and_brands_options,
    isLoading:isLoadingCatAndBrandOptions

  } = useQuery({
    queryKey: ["collection_cat_and_brands",slug],
    queryFn: () => fetchColletionCatAndBrand(slug),
     staleTime: 30000
  })
  
  const filterString: string = useMemo(() => {
    const params = new URLSearchParams();

    for (const [key, values] of Object.entries(filterParams)) {
      if (Array.isArray(values) && values.length > 0) {
        const ids = values.map((v: any) => v.id).join(',');
        params.append(encodeURIComponent(key), encodeURIComponent(ids));
      }
    }

    if (priceRange[0] != null) {
      params.append("minPrice", encodeURIComponent(priceRange[0].toString()));
    }

    if (priceRange[1] != null) {
      params.append("maxPrice", encodeURIComponent(priceRange[1].toString()));
    }

    params.append("sort_by", encodeURIComponent(sortBy));
    params.append("page", encodeURIComponent(page.toString()));
    params.append("limit", encodeURIComponent(limit.toString()));

    return params.toString();
  }, [priceRange, filterParams, sortBy, page, limit]);
  const {
    data: product_list,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
    isError: isProductsError,
  } = useQuery({
    queryKey: ["collection_products", slug, filterString],
    queryFn: () => fetchCollectionProducts(slug as string, filterString),
    enabled: !!slug,
  // Added staleTime to prevent unnecessary refetches
  staleTime: 30000 // only fetch when slug is available
  })

  const isMobile = useMediaQuery("(max-width: 768px)")
  const resetFilters = () => {
    setPriceRange([filterOptions.priceRange.min, filterOptions.priceRange.max])
    setFilterParams({})
  }
  useEffect(() => {
    let updated_filter: any = {}
    const options=collection_cat_and_brands_options
    if (options) {
      updated_filter = { ...updated_filter, categories: options.categories }
      updated_filter = { ...updated_filter, brands: options.brands }
      updated_filter = { ...updated_filter, priceRange: options.price_range }
      updated_filter = { ...updated_filter, discounts: discount_values }
      updated_filter = { ...updated_filter, ratings: rating_values }
      updated_filter = { ...updated_filter, page: page }
      updated_filter = { ...updated_filter, priceRange: {min:Number(collection_cat_and_brands_options.price_range.min),max:Number(collection_cat_and_brands_options.price_range.max)} }
      setPriceRange([collection_cat_and_brands_options.price_range.min, collection_cat_and_brands_options.price_range.max])
   
    }
    //if(isLoadingOptions)
    setFilterOptions({ ...filterOptions, ...updated_filter })
  }, [collection_cat_and_brands_options, page])
 useEffect(()=>{
   if(product_list)
     setTotalPages(3)
 },[product_list])


 
  const FilterContent = useCallback(() => {

    if (!filterOptions ||
      !filterOptions.priceRange ||
      !filterOptions.categories ||
      !filterOptions.brands ||
      !filterOptions.discounts
    ) {
      return <FilterContentSkeleton />
    }

    let filterSections = [

      { key: "categories", title: "Categories", options: filterOptions.categories },
      { key: "brands", title: "Brands", options: filterOptions.brands },
      { key: "discounts", title: "Discounts", options: filterOptions.discounts },
      { key: "ratings", title: "Ratings", options: filterOptions.ratings },
    
    ]
  
    const handleMultiOptionChange = (attribute: string, selectedOptions: any[]) => {
       setFilterParams(prev => {
      const existingOptions = prev[attribute] || [];

      // Merge selectedOptions into existingOptions, avoiding duplicates by `id`
      const merged = [
        ...existingOptions.filter(
          (existing: any) => !selectedOptions.some((selected: any) => selected.id === existing.id)
        ),
      ...selectedOptions
    ];

    return {
      ...prev,
      [attribute]: merged,
    };
  });
};

   const handleOptionChange = (attribute: string, option: any) => {

  // Ensure `option` is a single object, not an array
 

  setFilterParams(prev => {
    const currentOptions = prev[attribute] || [];

    const newOptions = currentOptions.some((op: any) => op.id === option.id)
      ? currentOptions.filter((o: any) => o.id !== option.id)
      : [...currentOptions, option];

    return {
      ...prev,
      [attribute]: newOptions,
    };
  });
};


    const selectedSection = filterSections.find(section => section.key === selectedAttribute)
    return isMobile ? (
      <div className="flex h-full border rounded shadow-sm">
        {/* Left Navigation Rail */}
        <div className="w-1/3 max-w-[250px] border-r overflow-y-auto bg-gray-50">
          <ul className="divide-y">
            {filterSections.map(section => (
              <li
                key={section.key}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${selectedAttribute === section.key ? "bg-white font-semibold" : ""
                  }`}
                onClick={() => setSelectedAttribute(section.key)}
              >
                {section.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Options for selected attribute */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedSection ? (
            <div>
              <h3 className="text-xl font-semibold mb-4">{selectedSection.title}</h3>
              <div className="space-y-2">
                {selectedSection.options.map((option: any, index: number) => {

                  const isChecked = filterParams[selectedSection.key]?.some((op: any) => op.id === option.id)
                  return (
                    <label key={option.name} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleOptionChange(selectedSection.key, option)}
                      />
                      <span>{option.name}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          ) :
            <p className="text-gray-500">Select a filter attribute from the left panel.</p>
          }
        </div>
      </div>
    ) : (<div>
      {filterSections.map((section) => (
        <FilterAccordionItem
          key={section.key}
          value={section.key}
          title={section.title}
          options={section.options}
          onChange={(selected: any) => handleMultiOptionChange (section.key, selected)}
          showSearch={true}
        />
      ))}



    </div>)
  }, [selectedAttribute, isMobile, setSelectedAttribute, setFilterParams, filterOptions, facetOptions])


  const categoryName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")



  const handleRemoveFilter = useCallback((type: any, idToRemove: any) => {
    const updated: any = { ...filterParams }
    if (idToRemove) {
      updated[type] = updated[type].filter(item => item.id !== idToRemove)

      // Optionally remove the key if the array becomes empty
      if (updated[type].length === 0) {
        delete updated[type]
      }
      setFilterParams(updated)
    }
  }, [filterParams])
  const paginate = (pageNumber: number) => {
    setPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  if (isLoadingCatAndBrandOptions)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  const { products, current_page, total_pages, total_products, next_page, prev_page } = product_list || {}
  const paginationButtonStyles = {
    base: "h-9 min-w-9 flex items-center justify-center rounded-md border border-input text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    active:
      "bg-red-500 text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground shadow-md shadow-primary/30 ring-2 ring-primary/30 font-medium scale-105 transform transition-transform",
    inactive: "bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
    disabled: "pointer-events-none opacity-50 bg-muted text-muted-foreground border-muted-foreground/20",
  }
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{slug} Products </h1>
        <p className="text-muted-foreground">
          Showing {product_list !== undefined && product_list.products.length} products
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div
            ref={sidebarRef}
            className="sticky border rounded-lg p-4 bg-card shadow-sm"
            style={{
              top: `${headerHeight + 20}px`,
              maxHeight: `calc(100vh - ${headerHeight + 40}px)`,
              overflowY: "auto",
              scrollbarWidth: "thin",
            }}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 text-muted-foreground hover:text-foreground"
                >
                  Reset
                </Button>
              </div>
              {isLoadingCatAndBrandOptions ? (
                <div className="flex items-center justify-center h-screen">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium mb-6 text-sm">Price Range</h4>
                  <div className="px-2 !text-xs mb-3">
                    {filterOptions.priceRange !== undefined && (
                      <>
                        <Slider
                          min={filterOptions.priceRange.min}
                          max={filterOptions.priceRange.max}
                          step={1}
                          value={priceRange}
                          defaultValue={priceRange}
                          onValueChange={setPriceRange}
                        />
                        <div className="flex items-center justify-between mt-4 text-xs">
                          <span>{formatCurrency(priceRange[0])}</span>
                          <span>{formatCurrency(priceRange[1])}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <FilterContent />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {/* Filters and Sort - Mobile */}
          <div className="flex items-center justify-between mb-6">
            <div className="md:hidden">
              <Button variant="outline" size="sm" className="h-8" onClick={() => setIsFilterOpen(true)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="flex items-center ml-auto">
              <div className="flex items-center mr-2 text-sm text-muted-foreground">
                <span className="hidden sm:inline">Sort by:</span>
                <SlidersHorizontal className="h-4 w-4 sm:hidden mr-2" />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] h-8 text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {(Object.keys(filterParams).length > 0 ||
            (filterOptions.priceRange && (priceRange[0] > filterOptions.priceRange.min || priceRange[1] < filterOptions.priceRange.max))) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filterOptions.priceRange &&
                  (priceRange[0] > filterOptions.priceRange.min || priceRange[1] < filterOptions.priceRange.max) && (
                    <div className="flex items-center bg-muted text-sm rounded-full px-3 py-1">
                      <span>
                        Price: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-1"
                        onClick={() => setPriceRange([filterOptions.priceRange.min, filterOptions.priceRange.max])}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove price filter</span>
                      </Button>
                    </div>
                  )}
                {Object.keys(filterParams).map((key: any) => {
                   console.log('dekho',filterParams)
                  const cat: any[] = filterParams[key];

                  if (!Array.isArray(cat) || cat.length === 0) return null;
                  
                  return cat.map((op: any, index: number) => {
                   
                    return (
                      <div key={op.id + '-' + index} className="flex items-center bg-muted text-sm rounded-full px-3 py-1">
                        <span>{op.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 ml-1"
                          onClick={() => handleRemoveFilter(key, op.id)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {key} filter</span>
                        </Button>
                      </div>
                    );
                  });
                })}


                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={resetFilters}>
                  Clear All
                </Button>
              </div>
            )}

          {/* Products Grid */}
          {isLoadingProducts || isFetchingProducts ? (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {product_list &&
                product_list.products.map((product: any) => <ProductCard key={product.id} {...product} />)}
            </div>
          )}
          {total_pages}
          {total_pages > 1 && (
            <div className="flex justify-center mt-8 mb-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <button
                      onClick={() => {
                        if (page > 1) paginate(page - 1)
                      }}
                      className={cn(
                        paginationButtonStyles.base,
                        page === 1 ? paginationButtonStyles.disabled : paginationButtonStyles.inactive,
                        "px-2.5",
                      )}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous</span>
                    </button>
                  </PaginationItem>

                  {Array.from({ length: total_pages }).map((_, index) => {
                    const pageNumber = index + 1

                    // Show first page, last page, current page, and pages around current page
                    if (
                      pageNumber === 1 ||
                      pageNumber === total_pages ||
                      (pageNumber >= page - 1 && pageNumber <= page + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <button
                            onClick={() => paginate(pageNumber)}
                            className={cn(
                              paginationButtonStyles.base,
                              pageNumber === page
                                ? `${paginationButtonStyles.active} animate-pulse-subtle`
                                : paginationButtonStyles.inactive,
                            )}
                            aria-current={pageNumber === page ? "page" : undefined}
                          >
                            {pageNumber}
                          </button>
                        </PaginationItem>
                      )
                    }

                    // Show ellipsis for gaps
                    if ((pageNumber === 2 && page > 3) || (pageNumber === total_pages - 1 && page < total_pages - 2)) {
                      return (
                        <PaginationItem key={`ellipsis-${pageNumber}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }

                    return null
                  })}

                  <PaginationItem>
                    <button
                      onClick={() => {
                        if (page < total_pages) paginate(page + 1)
                      }}
                      className={cn(
                        paginationButtonStyles.base,
                        page === total_pages ? paginationButtonStyles.disabled : paginationButtonStyles.inactive,
                        "px-2.5",
                      )}
                      disabled={page === total_pages}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next</span>
                    </button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
          <SheetHeader className="border-b pb-4 mb-4">
            <SheetTitle className="text-left">Filters</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto h-full pb-20">
            <FilterContent />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={resetFilters}>
                Reset
              </Button>
              <Button className="flex-1" onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
