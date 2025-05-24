"use client"

import { formatDate } from "@/app/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getReturns } from "@/lib/return-api"

import { useQuery } from "@tanstack/react-query"
import { AlertCircle, Package, RefreshCcw, Repeat, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ReturnHistoryPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Fetch returns
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["returns", page, limit, statusFilter, typeFilter],
    queryFn: () => getReturns(page, limit, typeFilter !== "all" ? (typeFilter as any) : undefined),
  })

  // Get color based on return status
  const getStatusColor = (status: string) => {
    if (status.includes("Requested")) return "bg-yellow-100 text-yellow-800"
    if (status.includes("Approved")) return "bg-blue-100 text-blue-800"
    if (status.includes("Processing")) return "bg-purple-100 text-purple-800"
    if (status.includes("Completed")) return "bg-green-100 text-green-800"
    if (status.includes("Cancelled")) return "bg-red-100 text-red-800"
    if (status.includes("Rejected")) return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
  }

  // Filter returns based on search query and status filter
  const filteredReturns = data?.data.filter((returnItem) => {
    const matchesSearch =
      searchQuery === "" ||
      returnItem.id.toString().includes(searchQuery) ||
      returnItem.reason.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || returnItem.return_status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">My Returns & Exchanges</h1>
          <p className="text-gray-500">View and manage your return and exchange requests</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
        </div>

        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full mb-4 rounded-lg" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">My Returns & Exchanges</h1>
          <p className="text-gray-500">View and manage your return and exchange requests</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium">Error Loading Data</h3>
              <p className="text-sm text-gray-500 mt-2">
                {error instanceof Error ? error.message : "Failed to load data"}
              </p>
              <Button onClick={() => refetch()} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Returns & Exchanges</h1>
        <p className="text-gray-500">View and manage your return and exchange requests</p>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={(value) => setTypeFilter(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="return">Returns</TabsTrigger>
          <TabsTrigger value="exchange">Exchanges</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by ID or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Return Requested">Requested</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredReturns?.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No Requests Found</h3>
              <p className="text-sm text-gray-500 mt-2">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "No requests match your search criteria. Try adjusting your filters."
                  : "You haven't made any return or exchange requests yet."}
              </p>
              {(searchQuery || statusFilter !== "all" || typeFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                    setTypeFilter("all")
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {filteredReturns?.map((returnItem) => (
              <Link key={returnItem.id} href={`/customer/returns/${returnItem.id}`} className="block">
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                          {returnItem.type === "Exchange" ? (
                            <Repeat className="h-6 w-6 text-gray-600" />
                          ) : (
                            <RefreshCcw className="h-6 w-6 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">
                              {returnItem.type === "Exchange" ? "Exchange" : "Return"} #{returnItem.id}
                            </h3>
                            <Badge variant={returnItem.type === "Exchange" ? "outline" : "default"} className="ml-2">
                              {returnItem.type === "Exchange" ? "Exchange" : "Return"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{formatDate(returnItem.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(returnItem.return_status)}>{returnItem.return_status}</Badge>
                        <p className="text-gray-500 text-sm mt-1">
                          {returnItem.items.length} {returnItem.items.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {data?.meta.total && (
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  href="#"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                />
                {Array.from({ length: data.meta.last_page }, (_, i) => i + 1).map((pageNumber) => {
                  if (
                    pageNumber === 1 ||
                    pageNumber === data.meta.last_page ||
                    (pageNumber >= page - 2 && pageNumber <= page + 2)
                  ) {
                    return (
                      <PaginationItem key={pageNumber} active={pageNumber === page}>
                        <PaginationLink href="#" onClick={() => setPage(pageNumber)} isActive={pageNumber === page}>
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  } else if (pageNumber === page - 3 && page > 4 && pageNumber > 1) {
                    return <PaginationEllipsis key={pageNumber} />
                  } else if (
                    pageNumber === page + 3 &&
                    page < data.meta.last_page - 3 &&
                    pageNumber < data.meta.last_page
                  ) {
                    return <PaginationEllipsis key={pageNumber} />
                  }
                  return null
                })}
                <PaginationNext
                  href="#"
                  onClick={() => setPage((prev) => Math.min(prev + 1, data.meta.last_page))}
                  disabled={page === data?.meta.last_page}
                />
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}
