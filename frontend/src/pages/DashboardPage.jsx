import { useState } from "react";
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
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import AnalyticsPage from "../components/Analytics";
import ProductsPage from "../components/ProductsPage";
import { useUserStore } from "../store/useUserStore";

const tabs = [
  { id: "dashboard", name: "Dashboard", icon: BarChart3, path: "" },
  { id: "orders", name: "Orders", icon: ShoppingCart, path: "orders" },
  { id: "products", name: "Products", icon: Package, path: "products" },
  { id: "customers", name: "Customers", icon: Users, path: "customers" },
  { id: "analytics", name: "Analytics", icon: BarChart3, path: "analytics" },
];

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [activeTab, setActiveTab] = useState("Dashboard");
  const { user, logout } = useUserStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-48" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className={`font-bold text-xl ${!isSidebarOpen && "hidden"}`}>
            E-Shop
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-md hover:bg-gray-100"
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
                  end={tab.path === ""}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-md hover:bg-gray-100 ${
                      isActive ? "bg-blue-50 text-blue-500" : ""
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

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            href="#"
            className="flex items-center p-2 rounded-md hover:bg-gray-100 text-gray-700"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-md hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center">
              <img
                src="/placeholder.svg?height=32&width=32"
                alt="User"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div
                className={`ml-2 ${!isSidebarOpen ? "hidden md:block" : ""}`}
              >
                <div className="flex items-center">
                  <span className="font-medium text-sm">{user?.name}</span>
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
