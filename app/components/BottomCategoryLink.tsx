"use Client"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { api_url } from "@/contant"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import cn from "classnames"
import { Loader2, Menu } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// React Query: Fetch top categories
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
// React Query: Fetch selected category details
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
    const [isCategoryPage, setIsCategoryPage] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();


    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsCategoryPage(window.location.pathname.includes("/category"));
        }
    }, []);

    const { data: categories = [], isLoading: loadingCategories } = useTopCategories()
    const { data: currentCategory, isLoading: loadingCategoryDetails } = useCategoryDetails(selectedCategoryId)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    className={`flex flex-col items-center justify-center w-1/5 py-1 ${isCategoryPage
                        ? "text-pink-600"
                        : "text-gray-500"
                        }`}
                >
                    <Menu className="h-6 w-6" />
                    <span className="text-xs mt-1 font-medium">Categories</span>
                </button>
            </SheetTrigger>

            <SheetContent side="bottom" className="h-[80vh] p-0">
                <SheetHeader className="sr-only">
                    <SheetTitle>Categories</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="font-semibold text-lg">Categories</h2>
                        <div className="flex gap-2">


                        </div>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Left Sidebar - Category List */}
                        <div className="w-1/3 border-r overflow-y-auto p-4">
                            {loadingCategories ? (
                                <div className="text-gray-500 text-center py-10">Loading categories...</div>
                            ) : (
                                <ul className="flex flex-col gap-4">
                                    {categories.map((category: any) => (
                                        <li key={category.id}>
                                            <button
                                                onClick={() => setSelectedCategoryId(category.id)}
                                                className={cn(
                                                    "flex flex-col items-center w-full p-2 rounded-lg border transition-all",
                                                    selectedCategoryId === category.id
                                                        ? "bg-pink-50 text-pink-600 border-pink-500"
                                                        : "text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                                )}
                                            >
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="w-16 h-16 object-cover rounded-full mb-2 border"
                                                />
                                                <span className="text-sm font-medium text-center">{category.name}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Right Content Area - Subcategories */}
                        <div className="w-2/3 overflow-y-auto relative p-4">
                            {selectedCategoryId && loadingCategoryDetails ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                                </div>
                            ) : selectedCategoryId && currentCategory ? (
                                <>
                                    <h3 className="text-lg font-semibold mb-4">
                                        {currentCategory.name}  Subcategories
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        {currentCategory?.children?.map((subcat: any) => (
                                            subcat?.children?.length > 0 ? (
                                                <div key={subcat.id}>
                                                    <div className="flex items-center gap-1 mb-2">
                                                        <h5 className="text-sm font-semibold whitespace-nowrap">{subcat.name}</h5>
                                                        <div className="flex-1 border-t border-gray-300"></div>
                                                    </div>
                                                    <div className="flex flex-row gap-2">
                                                        {subcat.children.map((subsubcat: any) => (
                                                            <Link
                                                                key={subsubcat.id}
                                                                href={`/category/${subsubcat.slug}`}
                                                                className={cn(
                                                                    "flex flex-col items-center w-full p-2 rounded-lg border transition-all text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                                                )}
                                                                onClick={() => setOpen(false)} // optional: to close sheet on click, if needed
                                                            >
                                                                <img
                                                                    src={subsubcat.image ? subsubcat.image : "/cat.png"}
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
                                                    href={`/category/${subcat.slug}`} // ✅ You must have a `slug` or similar field
                                                    className={cn(
                                                        "flex flex-col items-center w-full p-2 rounded-lg border transition-all text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                                    )}
                                                    onClick={() => setOpen(false)} // Optional: close Sheet if needed
                                                >
                                                    <img
                                                        src={subcat.image ? subcat.image : "/cat.png"}
                                                        alt={subcat.name}
                                                        className="w-16 h-16 object-cover rounded-full mb-2 border"
                                                    />
                                                    <span className="text-sm font-medium text-center">{subcat.name}</span>
                                                </Link>
                                            )))
                                        }



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
