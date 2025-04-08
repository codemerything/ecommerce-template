import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

// This is a Zustand store for managing user authentication state.
export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match!");
    }

    try {
      const response = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      set({ user: response.data.user, loading: false });
      toast.success("Signup successful!");
    } catch (error) {
      set({ loading: false });
      console.error(error);
      toast.error(
        error.response.data.message || "Signup failed. Please try again."
      );
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });

      set({ user: res.data, loading: false });

      if (res.data.role !== "admin") {
        set({ user: null, loading: false });
        toast.error("You are not authorized to access this page.");
        console.log("user is not admin", res.data);
        return;
      } else {
        toast.success("Login successful!");
      }
      console.log(res.data);
    } catch (error) {
      set({ loading: false });

      toast.error(
        error.response.data.message || "Login failed. Please try again."
      );
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
      // if user isn't an admin, show toast error saying user is not authorized
      console.log("I wanna see when this calls");
    } catch (error) {
      set({ checkingAuth: false, user: null });
      console.error("Error checking authentication:", error);
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(
        error.response.data.message || "Logout failed. Please try again."
      );
    }
  },
}));
