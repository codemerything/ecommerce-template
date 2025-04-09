import "./App.css";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Dashboard from "./pages/DashboardPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastBar, Toaster } from "react-hot-toast";
import { useUserStore } from "./store/useUserStore";
import { useEffect } from "react";

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
        {/* Home ("/") and login both redirect if user is already logged in! */}

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
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
