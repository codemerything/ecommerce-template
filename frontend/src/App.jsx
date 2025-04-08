import "./App.css";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Dashboard from "./pages/DashboardPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastBar, Toaster } from "react-hot-toast";
import { useUserStore } from "./store/useUserStore";
import { use, useEffect } from "react";

function App() {
  const { user, checkAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={!user ? <LoginPage /> : <Navigate to="/dashboard" />}
          />

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
