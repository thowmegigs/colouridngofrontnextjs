"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, Plus, Upload, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react"

// Mock product data
const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    sku: "SKU-001",
    price: 79.99,
    stock: 45,
    category: "Electronics",
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    sku: "SKU-002",
    price: 199.99,
    stock: 28,
    category: "Electronics",
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    sku: "SKU-003",
    price: 24.99,
    stock: 120,
    category: "Clothing",
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 4,
    name: "Leather Wallet",
    sku: "SKU-004",
    price: 49.99,
    stock: 35,
    category: "Accessories",
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 5,
    name: "Stainless Steel Water Bottle",
    sku: "SKU-005",
    price: 19.99,
    stock: 78,
    category: "Home & Kitchen",
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 6,
    name: "Wireless Charging Pad",
    sku: "SKU-006",
    price: 29.99,
    stock: 0,
    category: "Electronics",
    status: "Out of Stock",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 7,
    name: "Fitness Tracker Band",
    sku: "SKU-007",
    price: 49.99,
    stock: 15,
    category: "Electronics",
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 8,
    name: "Bluetooth Portable Speaker",
    sku: "SKU-008",
    price: 59.99,
    stock: 22,
    category: "Electronics",
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 9,
    name: "Leather Crossbody Bag",
    sku: "SKU-009",
    price: 89.99,
    stock: 0,
    category: "Accessories",
    status: "Draft",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 10,
    name: "Ceramic Coffee Mug Set",
    sku: "SKU-010",
    price: 34.99,
    stock: 42,
    category: "Home & Kitchen",
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
]

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Filter products based on search term and status
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "all" || product.status.toLowerCase() === selectedStatus.toLowerCase()

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex space-x-2">
          <Link
            href="/vendor/products/import"
            className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Upload size={16} className="mr-2" />
            Import
          </Link>
          <Link
            href="/vendor/products/add"
            className="flex items-center px-4 py-2 text-sm bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            <Plus size={16} className="mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out of stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
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
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : product.status === "Draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        <Eye size={18} />
                      </button>
                      <Link href={`/vendor/products/edit/${product.id}`} className="text-blue-500 hover:text-blue-700">
                        <Edit size={18} />
                      </Link>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </div>
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
                <span className="font-medium">{filteredProducts.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-pink-600 text-sm font-medium text-white">
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
