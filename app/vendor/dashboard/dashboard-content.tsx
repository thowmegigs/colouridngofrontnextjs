"use client"

import type React from "react"

import { useState } from "react"
import { ShoppingBag, DollarSign, Package, Users, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// Mock data for charts
const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 2780 },
  { name: "May", sales: 1890 },
  { name: "Jun", sales: 2390 },
  { name: "Jul", sales: 3490 },
]

const earningsData = [
  { name: "Jan", earnings: 2800 },
  { name: "Feb", earnings: 2100 },
  { name: "Mar", earnings: 3500 },
  { name: "Apr", earnings: 1950 },
  { name: "May", earnings: 1320 },
  { name: "Jun", earnings: 1670 },
  { name: "Jul", earnings: 2440 },
]

// Mock data for recent orders
const recentOrders = [
  { id: "#ORD-001", customer: "John Doe", date: "2023-07-15", amount: 129.99, status: "Paid" },
  { id: "#ORD-002", customer: "Jane Smith", date: "2023-07-14", amount: 79.5, status: "Paid" },
  { id: "#ORD-003", customer: "Robert Johnson", date: "2023-07-14", amount: 249.99, status: "Paid" },
  { id: "#ORD-004", customer: "Emily Davis", date: "2023-07-13", amount: 59.99, status: "Paid" },
  { id: "#ORD-005", customer: "Michael Brown", date: "2023-07-12", amount: 149.99, status: "Paid" },
]

const unpaidOrders = [
  { id: "#ORD-006", customer: "Sarah Wilson", date: "2023-07-15", amount: 89.99, status: "Unpaid" },
  { id: "#ORD-007", customer: "David Miller", date: "2023-07-14", amount: 129.5, status: "Unpaid" },
  { id: "#ORD-008", customer: "Lisa Taylor", date: "2023-07-13", amount: 199.99, status: "Unpaid" },
  { id: "#ORD-009", customer: "James Anderson", date: "2023-07-12", amount: 45.99, status: "Unpaid" },
  { id: "#ORD-010", customer: "Patricia Thomas", date: "2023-07-11", amount: 79.99, status: "Unpaid" },
]

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  change: number
  changeText: string
}

const StatCard = ({ title, value, icon, change, changeText }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-pink-100 rounded-lg">{icon}</div>
    </div>
    <div className="mt-4 flex items-center">
      {change > 0 ? (
        <ArrowUpRight size={16} className="text-green-500" />
      ) : (
        <ArrowDownRight size={16} className="text-red-500" />
      )}
      <span className={`text-sm ml-1 ${change > 0 ? "text-green-500" : "text-red-500"}`}>{Math.abs(change)}%</span>
      <span className="text-sm text-gray-500 ml-1">{changeText}</span>
    </div>
  </div>
)

export default function VendorDashboardContent() {
  const [activeTab, setActiveTab] = useState<"sales" | "earnings">("sales")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Export
          </button>
          <button className="px-4 py-2 text-sm bg-pink-600 text-white rounded-md hover:bg-pink-700">View Store</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value="1,245"
          icon={<ShoppingBag size={24} className="text-pink-600" />}
          change={12.5}
          changeText="from last month"
        />
        <StatCard
          title="Total Sales"
          value="$48,574"
          icon={<DollarSign size={24} className="text-pink-600" />}
          change={8.2}
          changeText="from last month"
        />
        <StatCard
          title="Total Products"
          value="156"
          icon={<Package size={24} className="text-pink-600" />}
          change={-3.1}
          changeText="from last month"
        />
        <StatCard
          title="Total Customers"
          value="845"
          icon={<Users size={24} className="text-pink-600" />}
          change={5.7}
          changeText="from last month"
        />
      </div>

      {/* Charts */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Performance Overview</h2>
          <div className="flex space-x-2 bg-gray-100 rounded-md p-1">
            <button
              className={`px-3 py-1 text-sm rounded-md ${activeTab === "sales" ? "bg-white shadow" : ""}`}
              onClick={() => setActiveTab("sales")}
            >
              Sales
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${activeTab === "earnings" ? "bg-white shadow" : ""}`}
              onClick={() => setActiveTab("earnings")}
            >
              Earnings
            </button>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "sales" ? (
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#db2777" strokeWidth={2} />
              </LineChart>
            ) : (
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earnings" fill="#db2777" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paid Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium">Recent Paid Orders</h2>
          </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-600">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${order.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Unpaid Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium">Recent Unpaid Orders</h2>
          </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {unpaidOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-600">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${order.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
