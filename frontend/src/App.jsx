import "./App.css";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import DashboardLayout from "./pages/DashboardPage"; // Updated import
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastBar, Toaster } from "react-hot-toast";
import { useUserStore } from "./store/useUserStore";
import { useEffect } from "react";
import Dashboard from "./components/Dashboard";
// import OrdersPage from "./components/OrdersPage";
import ProductsPage from "./components/ProductsPage";
import CustomersPage from "./components/Customers";
import AnalyticsPage from "./components/Analytics";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <SignupPage />}
        />
        <Route
          path="/dashboard"
          element={user ? <DashboardLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />{" "}
          {/* Default dashboard route */}
          {/* <Route path="orders" element={<OrdersPage />} /> */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
