"use client"

import { useState } from "react"
import { Search, Filter, ChevronLeft, ChevronRight, Download, Info } from "lucide-react"

// Mock commission data
const commissions = [
  {
    id: "COM-001",
    orderId: "#ORD-001",
    date: "2023-07-15",
    orderTotal: 129.99,
    commissionRate: 10,
    commissionAmount: 13.0,
    status: "Paid",
  },
  {
    id: "COM-002",
    orderId: "#ORD-002",
    date: "2023-07-14",
    orderTotal: 79.5,
    commissionRate: 10,
    commissionAmount: 7.95,
    status: "Pending",
  },
  {
    id: "COM-003",
    orderId: "#ORD-003",
    date: "2023-07-14",
    orderTotal: 249.99,
    commissionRate: 10,
    commissionAmount: 25.0,
    status: "Paid",
  },
  {
    id: "COM-004",
    orderId: "#ORD-004",
    date: "2023-07-13",
    orderTotal: 59.99,
    commissionRate: 10,
    commissionAmount: 6.0,
    status: "Pending",
  },
  {
    id: "COM-005",
    orderId: "#ORD-005",
    date: "2023-07-12",
    orderTotal: 149.99,
    commissionRate: 10,
    commissionAmount: 15.0,
    status: "Paid",
  },
  {
    id: "COM-006",
    orderId: "#ORD-007",
    date: "2023-07-10",
    orderTotal: 129.5,
    commissionRate: 10,
    commissionAmount: 12.95,
    status: "Paid",
  },
  {
    id: "COM-007",
    orderId: "#ORD-008",
    date: "2023-07-09",
    orderTotal: 199.99,
    commissionRate: 10,
    commissionAmount: 20.0,
    status: "Paid",
  },
  {
    id: "COM-008",
    orderId: "#ORD-010",
    date: "2023-07-07",
    orderTotal: 79.99,
    commissionRate: 10,
    commissionAmount: 8.0,
    status: "Paid",
  },
]

export default function CommissionsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Filter commissions based on search term and status
  const filteredCommissions = commissions.filter((commission) => {
    const matchesSearch =
      commission.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.orderId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "all" || commission.status.toLowerCase() === selectedStatus.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Calculate totals
  const totalCommission = filteredCommissions.reduce((sum, commission) => sum + commission.commissionAmount, 0)
  const paidCommission = filteredCommissions
    .filter((commission) => commission.status === "Paid")
    .reduce((sum, commission) => sum + commission.commissionAmount, 0)
  const pendingCommission = filteredCommissions
    .filter((commission) => commission.status === "Pending")
    .reduce((sum, commission) => sum + commission.commissionAmount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Commissions</h1>
        <button className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          <Download size={16} className="mr-2" />
          Export
        </button>
      </div>

      {/* Commission Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Commission</p>
              <h3 className="text-2xl font-bold mt-1">${totalCommission.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-pink-100 rounded-lg">
              <Info size={24} className="text-pink-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Paid Commission</p>
              <h3 className="text-2xl font-bold mt-1">${paidCommission.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Info size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Commission</p>
              <h3 className="text-2xl font-bold mt-1">${pendingCommission.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Info size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search commissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Commissions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCommissions.map((commission) => (
                <tr key={commission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-600">{commission.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{commission.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{commission.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ${commission.orderTotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{commission.commissionRate}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ${commission.commissionAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        commission.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {commission.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{" "}
                <span className="font-medium">{filteredCommissions.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-pink-600 text-sm font-medium text-white">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
