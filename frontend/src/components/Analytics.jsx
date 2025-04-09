import { useState } from "react";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Download,
  Filter,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";

export default function AnalyticsPage() {
  // Time period filter state
  const [timePeriod, setTimePeriod] = useState("This Month");

  // Category filter state
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  // Dummy data for analytics
  const analyticsData = {
    totalRevenue: "$45,231.89",
    revenueGrowth: "+20.1%",
    totalOrders: "1,245",
    ordersGrowth: "+12.2%",
    totalCustomers: "3,456",
    customersGrowth: "+8.4%",

    // Monthly sales data for bar chart
    monthlySales: [
      { month: "Jan", revenue: 15400 },
      { month: "Feb", revenue: 18200 },
      { month: "Mar", revenue: 22800 },
      { month: "Apr", revenue: 19500 },
      { month: "May", revenue: 24600 },
      { month: "Jun", revenue: 29800 },
      { month: "Jul", revenue: 32400 },
      { month: "Aug", revenue: 35200 },
      { month: "Sep", revenue: 38100 },
      { month: "Oct", revenue: 42300 },
      { month: "Nov", revenue: 45200 },
      { month: "Dec", revenue: 52100 },
    ],

    // Category performance data
    categoryPerformance: [
      {
        category: "Electronics",
        revenue: 125400,
        orders: 420,
        growth: "+15.2%",
      },
      { category: "Clothing", revenue: 98200, orders: 380, growth: "+8.7%" },
      {
        category: "Home & Kitchen",
        revenue: 74500,
        orders: 310,
        growth: "+12.3%",
      },
      { category: "Beauty", revenue: 52300, orders: 240, growth: "+18.5%" },
      { category: "Sports", revenue: 45600, orders: 190, growth: "+5.2%" },
    ],
  };

  // Find the maximum revenue to scale the chart properly
  const maxRevenue = Math.max(
    ...analyticsData.monthlySales.map((item) => item.revenue)
  );

  // Calculate the height of each bar as a percentage of the maximum
  const calculateBarHeight = (revenue) => {
    return (revenue / maxRevenue) * 100;
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-2xl font-bold md:mb-0">Sales Analytics</h1>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <button className="flex items-center justify-between w-full md:w-48 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>{timePeriod}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <div className="relative">
            <button className="flex items-center justify-between w-full md:w-48 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <span>{categoryFilter}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
            <div className="p-2 rounded-full bg-green-50 text-green-600">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold">
              {analyticsData.totalRevenue}
            </p>
            <span className="ml-2 text-sm font-medium text-green-500 flex items-center">
              {analyticsData.revenueGrowth}
              <TrendingUp className="h-4 w-4 ml-1" />
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
            <div className="p-2 rounded-full bg-blue-50 text-blue-600">
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold">
              {analyticsData.totalOrders}
            </p>
            <span className="ml-2 text-sm font-medium text-green-500 flex items-center">
              {analyticsData.ordersGrowth}
              <TrendingUp className="h-4 w-4 ml-1" />
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">
              Total Customers
            </h3>
            <div className="p-2 rounded-full bg-purple-50 text-purple-600">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold">
              {analyticsData.totalCustomers}
            </p>
            <span className="ml-2 text-sm font-medium text-green-500 flex items-center">
              {analyticsData.customersGrowth}
              <TrendingUp className="h-4 w-4 ml-1" />
            </span>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Revenue Overview</h2>
          <div className="flex items-center text-sm text-gray-500">
            <BarChart3 className="h-4 w-4 mr-1" />
            Monthly Revenue
          </div>
        </div>

        <div className="h-80">
          <div className="flex items-end h-64 gap-2">
            {analyticsData.monthlySales.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all duration-200 relative group"
                  style={{ height: `${calculateBarHeight(item.revenue)}%` }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${item.revenue.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-500 mt-2">
                  {item.month}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-4 flex justify-between">
            <div className="text-sm text-gray-500">
              <span className="font-medium">Total Revenue:</span> $378,600
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium">Average Monthly Revenue:</span>{" "}
              $31,550
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Category Performance</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Revenue
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Orders
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Growth
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.categoryPerformance.map((category, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${category.revenue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {category.orders}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600 font-medium">
                      {category.growth}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (category.revenue /
                              analyticsData.categoryPerformance[0].revenue) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
