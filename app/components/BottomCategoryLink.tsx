"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { api_url } from "@/contant"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import cn from "classnames"
import { LayoutGrid, Loader2, Menu } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import SafeImage from "./SafeImage"

const useTopCategories = () => {
    return useQuery({
        queryKey: ["categories", 'd'],
        queryFn: async () => {
            const { data } = await axios.get(`${api_url}/category/0`)
            return data
        },
        staleTime: 0,
    })
}

const useCategoryDetails = (categoryId: string | null) => {
    return useQuery({
        queryKey: ["category", categoryId],
        queryFn: async () => {
            const { data } = await axios.get(`${api_url}/category/${categoryId}`)
            return data
        },
        enabled: !!categoryId,
    })
}

export default function BottomCategryLink() {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null)
    const [isCategoryPage, setIsCategoryPage] = useState(false)
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsCategoryPage(window.location.pathname.includes("/category"))
        }
    }, [])

    const { data: categories = [], isLoading: loadingCategories } = useTopCategories()
    const { data: currentCategory, isLoading: loadingCategoryDetails } = useCategoryDetails(selectedCategoryId)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    
                    className={`
                            flex flex-col items-center justify-center w-1/5
                            ${isCategoryPage ? "text-white" : "text-gray-500"}
                            relative
                            -mt-10   /* raise it above others */
                            scale-110 /* bigger */
                            z-50     /* above others */
                            transition-all duration-200
                        `}
                >
                    <div
                        className={`
                            rounded-full p-4 shadow-lg  bg-primary
                            flex items-center justify-center
        `}
                    >
                        <LayoutGrid className="h-5 w-5 text-white" />
                    </div>
                    <span className={`text-[11px] pt-3 font-medium ${isCategoryPage ? "text-primary-600" : ""}`}>
                        Categories
                    </span>
                </button>
            </SheetTrigger>

            <SheetContent side="bottom" className="h-[80vh] p-0 rounded ">
                <SheetHeader className="sr-only">
                    <SheetTitle>Categories</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="font-semibold text-lg">Categories</h2>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Left Sidebar */}
                        <div className="w-1/4 border-r overflow-y-auto p-4">
                            {loadingCategories ? (
                                <div className="text-gray-500 text-center py-10">Loading categories...</div>
                            ) : (
                                <ul className="flex flex-col gap-4">
                                    {categories.map((category: any) => (
                                        <li key={category.id}>
                                            <button
                                                onClick={() => {
                                                    setSelectedCategoryId(category.id)
                                                    setSearchTerm("") // Reset search on category change
                                                }}
                                                className={cn(
                                                    "flex flex-col items-center w-full p-2 transition-all",
                                                    selectedCategoryId === category.id
                                                        ? "bg-pink-50 text-pink-600 border-pink-500"
                                                        : "text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                                )}
                                            >
                                                <SafeImage
                                                    src={category.image}
                                                    alt={category.name}
                                                    width="50"
                                                    height="50"
                                                    className="w-16 h-16 object-cover rounded-full mb-2 border"
                                                />
                                                <span className="text-sm font-medium text-center">{category.name}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Right Content Area */}
                        <div className="w-3/4 overflow-y-auto relative p-4">
                            {selectedCategoryId && loadingCategoryDetails ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                                </div>
                            ) : selectedCategoryId && currentCategory ? (
                                <>
                                    {/* Search input */}
                                    <div className="sticky -top-4 bg-white z-10 pb-4">
                                        <input
                                            type="text"
                                            placeholder="Search categories..."
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none "
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        {currentCategory?.children
                                            ?.filter((subcat: any) =>
                                                subcat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                subcat?.children?.some((child: any) =>
                                                    child.name.toLowerCase().includes(searchTerm.toLowerCase())
                                                )
                                            )
                                            .map((subcat: any) => (
                                                subcat?.children?.length > 0 ? (
                                                    <div key={subcat.id}>
                                                        <div className="flex items-center gap-1 mb-2">
                                                            <h5 className="text-sm font-semibold whitespace-nowrap">{subcat.name}</h5>
                                                            <div className="flex-1 border-t border-gray-300"></div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {subcat.children
                                                                .filter((child: any) =>
                                                                    child.name.toLowerCase().includes(searchTerm.toLowerCase())
                                                                )
                                                                .map((subsubcat: any) => (
                                                                    <Link
                                                                        key={subsubcat.id}
                                                                        href={`/category/${subsubcat.slug}`}
                                                                        className="flex flex-col items-center w-full p-2  transition-all text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                                                        onClick={() => setOpen(false)}
                                                                    >
                                                                        <SafeImage
                                                                            width={100}
                                                                            height={100}
                                                                            src={subsubcat.image}
                                                                            alt={subsubcat.name}
                                                                            className="w-16 h-16 object-cover rounded-full mb-2 border"
                                                                        />
                                                                        <span className="text-sm font-medium text-center">{subsubcat.name}</span>
                                                                    </Link>
                                                                ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Link
                                                        key={subcat.id}
                                                        href={`/category/${subcat.slug}`}
                                                        className="flex flex-col items-center w-full p-2 rounded-lg border transition-all text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <SafeImage
                                                            width={100}
                                                            height={100}
                                                            src={subcat.image}
                                                            alt={subcat.name}
                                                            className="w-16 h-16 object-cover rounded-full mb-2 border"
                                                        />
                                                        <span className="text-sm font-medium text-center">{subcat.name}</span>
                                                    </Link>
                                                )
                                            ))}
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                    <Menu className="h-12 w-12 mb-4 opacity-20" />
                                    <p className="text-center">Select a category to view its subcategories</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
