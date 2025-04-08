import React from "react";
import DashboardLayout from "../pages/DashboardPage";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      icon: DollarSign,
      change: "+20.1%",
    },
    { title: "Orders", value: "356", icon: ShoppingCart, change: "+12.2%" },
    { title: "Products", value: "2,420", icon: Package, change: "+5.4%" },
    { title: "Customers", value: "19,352", icon: Users, change: "+18.7%" },
  ];

  const recentOrders = [
    {
      id: "#ORD-1234",
      customer: "John Doe",
      date: "2023-04-05",
      status: "Delivered",
      total: "$125.99",
    },
    {
      id: "#ORD-1235",
      customer: "Jane Smith",
      date: "2023-04-05",
      status: "Processing",
      total: "$89.50",
    },
    {
      id: "#ORD-1236",
      customer: "Robert Johnson",
      date: "2023-04-04",
      status: "Shipped",
      total: "$254.00",
    },
    {
      id: "#ORD-1237",
      customer: "Emily Davis",
      date: "2023-04-04",
      status: "Delivered",
      total: "$45.25",
    },
    {
      id: "#ORD-1238",
      customer: "Michael Wilson",
      date: "2023-04-03",
      status: "Cancelled",
      total: "$189.99",
    },
  ];

  const topProducts = [
    {
      name: "Wireless Headphones",
      sold: 352,
      revenue: "$12,320",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Smart Watch",
      sold: 276,
      revenue: "$8,280",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Bluetooth Speaker",
      sold: 189,
      revenue: "$5,670",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Laptop Sleeve",
      sold: 156,
      revenue: "$3,120",
      image: "/placeholder.svg?height=40&width=40",
    },
  ];

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">
                {stat.title}
              </h3>
              <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                <stat.icon size={20} />
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold">{stat.value}</p>
              <span className="ml-2 text-sm font-medium text-green-500">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-700 text-sm">
                <tr>
                  <th className="py-3 px-6 text-left">Order ID</th>
                  <th className="py-3 px-6 text-left">Customer</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-blue-600 font-medium">
                      {order.id}
                    </td>
                    <td className="py-4 px-6">{order.customer}</td>
                    <td className="py-4 px-6 text-gray-500">{order.date}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Shipped"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-medium">
                      {order.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200">
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all orders →
            </a>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Top Products</h3>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <li key={index} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium">{product.name}</h4>
                      <p className="text-xs text-gray-500">
                        {product.sold} sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{product.revenue}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 border-t border-gray-200">
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all products →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
