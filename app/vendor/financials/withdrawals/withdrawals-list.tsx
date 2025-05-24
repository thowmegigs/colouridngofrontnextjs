"use client"

import { useState } from "react"
import { Search, Filter, ChevronLeft, ChevronRight, Download, Plus } from "lucide-react"

// Mock withdrawal data
const withdrawals = [
  {
    id: "WTH-001",
    date: "2023-07-15",
    amount: 500.0,
    method: "Bank Transfer",
    status: "Completed",
    reference: "REF123456",
  },
  {
    id: "WTH-002",
    date: "2023-06-15",
    amount: 750.0,
    method: "PayPal",
    status: "Completed",
    reference: "REF789012",
  },
  {
    id: "WTH-003",
    date: "2023-05-15",
    amount: 600.0,
    method: "Bank Transfer",
    status: "Completed",
    reference: "REF345678",
  },
  {
    id: "WTH-004",
    date: "2023-04-15",
    amount: 450.0,
    method: "PayPal",
    status: "Completed",
    reference: "REF901234",
  },
  {
    id: "WTH-005",
    date: "2023-07-01",
    amount: 300.0,
    method: "Bank Transfer",
    status: "Processing",
    reference: "REF567890",
  },
]

export default function WithdrawalsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedMethod, setSelectedMethod] = useState<string>("all")

  // Filter withdrawals based on search term, status, and method
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesSearch =
      withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.reference.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "all" || withdrawal.status.toLowerCase() === selectedStatus.toLowerCase()

    const matchesMethod = selectedMethod === "all" || withdrawal.method.toLowerCase() === selectedMethod.toLowerCase()

    return matchesSearch && matchesStatus && matchesMethod
  })

  // Calculate available balance (mock data)
  const availableBalance = 1250.0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Withdrawals</h1>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Download size={16} className="mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 text-sm bg-pink-600 text-white rounded-md hover:bg-pink-700">
            <Plus size={16} className="mr-2" />
            Request Withdrawal
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Available Balance</p>
            <h3 className="text-3xl font-bold mt-1">${availableBalance.toFixed(2)}</h3>
          </div>
          <button className="mt-4 md:mt-0 px-4 py-2 text-sm bg-pink-600 text-white rounded-md hover:bg-pink-700">
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search withdrawals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter size={18} className="text-gray-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-auto"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-auto"
            >
              <option value="all">All Methods</option>
              <option value="bank transfer">Bank Transfer</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Withdrawal ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-600">{withdrawal.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{withdrawal.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${withdrawal.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{withdrawal.method}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        withdrawal.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : withdrawal.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {withdrawal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{withdrawal.reference}</td>
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
                <span className="font-medium">{filteredWithdrawals.length}</span> results
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
