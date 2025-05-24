"use client"

import Link from "next/link"
import { ShoppingBag, Heart, MapPin, CreditCard, User, ChevronRight } from "lucide-react"

// Mock recent orders
const recentOrders = [
  { id: "#ORD-001", date: "2023-07-15", status: "Delivered", total: 129.99 },
  { id: "#ORD-002", date: "2023-07-10", status: "Processing", total: 79.5 },
  { id: "#ORD-003", date: "2023-07-05", status: "Shipped", total: 249.99 },
]

export default function CustomerDashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, John Doe! Here's an overview of your account.</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/customer/orders" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <div className="p-2 bg-pink-100 rounded-lg inline-block">
                <ShoppingBag size={24} className="text-pink-600" />
              </div>
              <h3 className="text-lg font-medium mt-4">My Orders</h3>
              <p className="text-gray-500 text-sm mt-1">View and track your orders</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </Link>

        <Link href="/customer/wishlist" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <div className="p-2 bg-pink-100 rounded-lg inline-block">
                <Heart size={24} className="text-pink-600" />
              </div>
              <h3 className="text-lg font-medium mt-4">Wishlist</h3>
              <p className="text-gray-500 text-sm mt-1">Products you've saved for later</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </Link>

        <Link href="/customer/addresses" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <div className="p-2 bg-pink-100 rounded-lg inline-block">
                <MapPin size={24} className="text-pink-600" />
              </div>
              <h3 className="text-lg font-medium mt-4">Addresses</h3>
              <p className="text-gray-500 text-sm mt-1">Manage your shipping addresses</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </Link>

        <Link
          href="/customer/payment-methods"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="p-2 bg-pink-100 rounded-lg inline-block">
                <CreditCard size={24} className="text-pink-600" />
              </div>
              <h3 className="text-lg font-medium mt-4">Payment Methods</h3>
              <p className="text-gray-500 text-sm mt-1">Manage your payment options</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </Link>

        <Link href="/customer/account" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <div className="p-2 bg-pink-100 rounded-lg inline-block">
                <User size={24} className="text-pink-600" />
              </div>
              <h3 className="text-lg font-medium mt-4">Account Details</h3>
              <p className="text-gray-500 text-sm mt-1">Update your personal information</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Orders</h2>
          <Link href="/customer/orders" className="text-sm text-pink-600 hover:text-pink-700">
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-600">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/customer/orders/${order.id}`} className="text-pink-600 hover:text-pink-700">
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    You haven't placed any orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
