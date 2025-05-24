"use client"

import { useState } from "react"
import { Search, Filter, Download, Eye } from "lucide-react"

// Mock customer data
const customers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    orders: 5,
    totalSpent: 629.95,
    lastOrder: "2023-07-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    orders: 3,
    totalSpent: 329.49,
    lastOrder: "2023-07-10",
    status: "Active",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    orders: 2,
    totalSpent: 249.99,
    lastOrder: "2023-07-05",
    status: "Active",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    orders: 1,
    totalSpent: 59.99,
    lastOrder: "2023-07-01",
    status: "Active",
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    orders: 4,
    totalSpent: 429.96,
    lastOrder: "2023-06-28",
    status: "Active",
  },
  {
    id: 6,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    orders: 2,
    totalSpent: 179.98,
    lastOrder: "2023-06-25",
    status: "Inactive",
  },
  {
    id: 7,
    name: "David Miller",
    email: "david.miller@example.com",
    orders: 3,
    totalSpent: 259.47,
    lastOrder: "2023-06-20",
    status: "Active",
  },
  {
    id: 8,
    name: "Lisa Taylor",
    email: "lisa.taylor@example.com",
    orders: 1,
    totalSpent: 199.99,
    lastOrder: "2023-06-15",
    status: "Active",
  },
  {
    id: 9,
    name: "James Anderson",
    email: "james.anderson@example.com",
    orders: 1,
    totalSpent: 45.99,
    lastOrder: "2023-06-10",
    status: "Inactive",
  },
  {
    id: 10,
    name: "Patricia Thomas",
    email: "patricia.thomas@example.com",
    orders: 2,
    totalSpent: 159.98,
    lastOrder: "2023-06-05",
    status: "Active",
  },
]

export default function CustomersList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  
  // Filter customers based on search term and status
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || customer.status.toLowerCase() === selectedStatus.toLowerCase()
    
    return matchesSearch && matchesStatus
  })
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button 
          className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Download size={16} className="mr-2" />
          Export
        </button>
      </div>
      
      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total Customers</p>
          <h3 className="text-2xl font-bold mt-1">{customers.length}</h3>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Active Customers</p>
          <h3 className="text-2xl font-bold mt-1">
            {customers.filter(c => c.status === 'Active').length}
          </h3>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Average Order Value</p>
          <h3 className="text-2xl font-bold mt-1">
            ${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / 
               customers.reduce((sum, c) => sum + c.orders, 0)).toFixed(2)}
          </h3>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search customers..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                          {customer.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ${customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.lastOrder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-pink-600 hover:text-pink-700">
                      <Eye size={18} />
                    </button>
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
                Showing <span className="font-medium">1</span> to\
\
