"use client"

import { ChevronRight, Heart, MapPin, ShoppingBag, User } from "lucide-react"
import Link from "next/link"

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
        <p className="text-gray-500 mt-1">Welcome back, Here's an overview of your account.</p>
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

       

        <Link href="/customer/profile" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
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

     
    </div>
  )
}
