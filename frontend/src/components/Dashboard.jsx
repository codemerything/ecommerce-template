import React, { useEffect, useState } from 'react';
import axios from '../lib/axios';
import DashboardLayout from '../pages/DashboardPage';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const recentOrders = [
    {
      id: '#ORD-1234',
      customer: 'John Doe',
      date: '2023-04-05',
      status: 'Delivered',
      total: '$125.99',
    },
    {
      id: '#ORD-1235',
      customer: 'Jane Smith',
      date: '2023-04-05',
      status: 'Processing',
      total: '$89.50',
    },
    {
      id: '#ORD-1236',
      customer: 'Robert Johnson',
      date: '2023-04-04',
      status: 'Shipped',
      total: '$254.00',
    },
    {
      id: '#ORD-1237',
      customer: 'Emily Davis',
      date: '2023-04-04',
      status: 'Delivered',
      total: '$45.25',
    },
    {
      id: '#ORD-1238',
      customer: 'Michael Wilson',
      date: '2023-04-03',
      status: 'Cancelled',
      total: '$189.99',
    },
  ];

  const topProducts = [
    {
      name: 'Wireless Headphones',
      sold: 352,
      revenue: '$12,320',
      image: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Smart Watch',
      sold: 276,
      revenue: '$8,280',
      image: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Bluetooth Speaker',
      sold: 189,
      revenue: '$5,670',
      image: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Laptop Sleeve',
      sold: 156,
      revenue: '$3,120',
      image: '/placeholder.svg?height=40&width=40',
    },
  ];

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios('/analytics');
        setStats(response.data.analyticsData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        // Optionally, you can add a loading state here
        setIsLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }

  console.log(stats);

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">Dashboard Overview</h2>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          {/* Formula for calulating change in revenue by month would be: 
          const change = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
          this goes for every single stat.
          */}

          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <div className="rounded-full bg-blue-50 p-2 text-blue-600">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold">{stats.totalRevenue}</p>
            <span className="ml-2 text-sm font-medium text-green-500">
              +20%
            </span>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Orders</h3>
            <div className="rounded-full bg-blue-50 p-2 text-blue-600">
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold">{stats.totalRevenue}</p>
            <span className="ml-2 text-sm font-medium text-green-500">
              +20%
            </span>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">
              Total Products
            </h3>
            <div className="rounded-full bg-blue-50 p-2 text-blue-600">
              <Package size={20} />
            </div>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold">{stats.products}</p>
            <span className="ml-2 text-sm font-medium text-green-500">
              +20%
            </span>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Customers</h3>
            <div className="rounded-full bg-blue-50 p-2 text-blue-600">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold">{stats.users}</p>
            <span className="ml-2 text-sm font-medium text-green-500">
              +20%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="rounded-lg bg-white shadow lg:col-span-2">
          <div className="border-b border-gray-200 p-6">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-sm text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Order ID</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-blue-600">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Processing'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'Shipped'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {order.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-200 p-4">
            <a
              href="#"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all orders →
            </a>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 p-6">
            <h3 className="text-lg font-semibold">Top Products</h3>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <li key={index} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center">
                    <img
                      src={product.image || '/placeholder.svg'}
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
          <div className="border-t border-gray-200 p-4">
            <a
              href="#"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all products →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
