"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, ChevronLeft, ChevronRight, Download } from "lucide-react"

// Mock order data
const orders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    email: "john.doe@example.com",
    date: "2023-07-15",
    status: "Delivered",
    payment: "Paid",
    total: 129.99,
  },
  {
    id: "#ORD-002",
    customer: "Jane Smith",
    email: "jane.smith@example.com",
    date: "2023-07-14",
    status: "Processing",
    payment: "Paid",
    total: 79.5,
  },
  {
    id: "#ORD-003",
    customer: "Robert Johnson",
    email: "robert.johnson@example.com",
    date: "2023-07-14",
    status: "Shipped",
    payment: "Paid",
    total: 249.99,
  },
  {
    id: "#ORD-004",
    customer: "Emily Davis",
    email: "emily.davis@example.com",
    date: "2023-07-13",
    status: "Processing",
    payment: "Pending",
    total: 59.99,
  },
  {
    id: "#ORD-005",
    customer: "Michael Brown",
    email: "michael.brown@example.com",
    date: "2023-07-12",
    status: "Delivered",
    payment: "Paid",
    total: 149.99,
  },
  {
    id: "#ORD-006",
    customer: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    date: "2023-07-11",
    status: "Cancelled",
    payment: "Refunded",
    total: 89.99,
  },
  {
    id: "#ORD-007",
    customer: "David Miller",
    email: "david.miller@example.com",
    date: "2023-07-10",
    status: "Delivered",
    payment: "Paid",
    total: 129.5,
  },
  {
    id: "#ORD-008",
    customer: "Lisa Taylor",
    email: "lisa.taylor@example.com",
    date: "2023-07-09",
    status: "Delivered",
    payment: "Paid",
    total: 199.99,
  },
  {
    id: "#ORD-009",
    customer: "James Anderson",
    email: "james.anderson@example.com",
    date: "2023-07-08",
    status: "Returned",
    payment: "Refunded",
    total: 45.99,
  },
  {
    id: "#ORD-010",
    customer: "Patricia Thomas",
    email: "patricia.thomas@example.com",
    date: "2023-07-07",
    status: "Delivered",
    payment: "Paid",
    total: 79.99,
  },
]

export default function OrderList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPayment, setSelectedPayment] = useState<string>("all")

  // Filter orders based on search term, status, and payment
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "all" || order.status.toLowerCase() === selectedStatus.toLowerCase()

    const matchesPayment = selectedPayment === "all" || order.payment.toLowerCase() === selectedPayment.toLowerCase()

    return matchesSearch && matchesStatus && matchesPayment
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          <Download size={16} className="mr-2" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search orders..."
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
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-auto"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-600">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.payment === "Paid"
                          ? "bg-green-100 text-green-800"
                          : order.payment === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/vendor/orders/${order.id}`} className="text-pink-600 hover:text-pink-700">
                      View
                    </Link>
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
                <span className="font-medium">{filteredOrders.length}</span> results
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
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
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
