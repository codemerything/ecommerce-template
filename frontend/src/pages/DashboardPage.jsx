import { useState } from 'react';
import {
  BarChart3,
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  Search,
  Bell,
  Menu,
  Home,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import AnalyticsPage from '../components/Analytics';
import ProductsPage from '../components/ProductsPage';
import CustomersPage from '../components/Customers';
import { useUserStore } from '../store/useUserStore';

const tabs = [
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3, path: '' },
  { id: 'orders', name: 'Orders', icon: ShoppingCart, path: 'orders' },
  { id: 'products', name: 'Products', icon: Package, path: 'products' },
  { id: 'customers', name: 'Customers', icon: Users, path: 'customers' },
  { id: 'analytics', name: 'Analytics', icon: BarChart3, path: 'analytics' },
];

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const { user, logout } = useUserStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-48' : 'w-20'
        } flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h1 className={`text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>
            E-Shop
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-md p-1 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <NavLink
                  to={`/dashboard/${tab.path}`}
                  end={tab.path === ''}
                  className={({ isActive }) =>
                    `flex items-center rounded-md p-2 hover:bg-gray-100 ${
                      isActive ? 'bg-blue-50 text-blue-500' : ''
                    }`
                  }
                >
                  <tab.icon size={20} />
                  {isSidebarOpen && <span className="ml-3">{tab.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            href="#"
            className="flex items-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
          <div className="relative w-64">
            <Search className="absolute top-2.5 left-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-md border py-2 pr-4 pl-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative rounded-md p-2 hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-300">
                <span className="font-semibold text-white">
                  {user?.name
                    ? user?.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'CU'}
                </span>
              </div>
              <div
                className={`ml-2 ${!isSidebarOpen ? 'hidden md:block' : ''}`}
              >
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    {user?.name.toUpperCase()}
                  </span>
                  <ChevronDown size={16} className="ml-1" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
