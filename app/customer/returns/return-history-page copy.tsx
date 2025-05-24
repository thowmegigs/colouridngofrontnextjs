"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { getReturns } from "@/lib/return-api"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { AlertCircle, Package, RefreshCcw, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ReturnHistoryPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Fetch returns
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["returns", page, limit, statusFilter],
    queryFn: () => getReturns(page, limit),
  })

  // Get color based on return status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Returned":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filter returns based on search query and status filter
  const filteredReturns = data?.data.filter((returnItem:any) => {
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
          <h1 className="text-2xl font-bold mb-2">My Returns</h1>
          <p className="text-gray-500">View and manage your return requests</p>
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
          <h1 className="text-2xl font-bold mb-2">My Returns</h1>
          <p className="text-gray-500">View and manage your return requests</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium">Error Loading Returns</h3>
              <p className="text-sm text-gray-500 mt-2">
                {error instanceof Error ? error.message : "Failed to load returns"}
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
        <h1 className="text-2xl font-bold mb-2">My Returns</h1>
        <p className="text-gray-500">View and manage your return requests</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by return ID or reason..."
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
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Returned">Returned</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredReturns?.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No Returns Found</h3>
              <p className="text-sm text-gray-500 mt-2">
                {searchQuery || statusFilter !== "all"
                  ? "No returns match your search criteria. Try adjusting your filters."
                  : "You haven't made any return requests yet."}
              </p>
              {(searchQuery || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
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
            {filteredReturns?.map((returnItem:any) => (
              <Link key={returnItem.id} href={`/customer/returns/${returnItem.id}`} className="block">
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                          <RefreshCcw className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Return #{returnItem.id}</h3>
                          <p className="text-sm text-gray-500">{formatDate(returnItem.created_at)}</p>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-2">
                        <Badge className={getStatusColor(returnItem.return_status)}>{returnItem.return_status}</Badge>
                        <p className="text-sm font-medium">{formatCurrency(returnItem.refund_amount)}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="text-sm text-gray-500">Reason</p>
                          <p className="font-medium">{returnItem.reason}</p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-sm text-gray-500">Type</p>
                          <p className="font-medium">{returnItem.return_method}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination currentPage={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
