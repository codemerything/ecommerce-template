import { create } from 'zustand';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';

// This is a Zustand store for managing user authentication state.
export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error('Passwords do not match!');
    }

    try {
      const response = await axios.post('/auth/signup', {
        name,
        email,
        password,
      });
      set({ user: response.data.user, loading: false });
      toast.success('Signup successful!');
    } catch (error) {
      set({ loading: false });
      console.error(error);
      toast.error(
        error.response.data.message || 'Signup failed. Please try again.'
      );
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post('/auth/login', { email, password });

      set({ user: res.data, loading: false });

      if (res.data.role !== 'admin') {
        set({ user: null, loading: false });
        toast.error('You are not authorized to access this page.');
        console.log('user is not admin', res.data);
        return;
      } else {
        toast.success('Login successful!');
      }
      console.log(res.data);
    } catch (error) {
      set({ loading: false });

      toast.error(
        error.response.data.message || 'Login failed. Please try again.'
      );
    }
  },

  // This function checks the authentication status of the user.
  // It makes a GET request to the "/auth/profile" endpoint to retrieve user data.
  // If the request is successful, it updates the user state with the response data.
  // If the request fails, it updates the user state with null and logs the error.

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const response = await axios.get('/auth/profile');
      set({ user: response.data, checkingAuth: false });
      // if user isn't an admin, show toast error saying user is not authorized
      console.log('I wanna see when this calls');
    } catch (error) {
      set({ checkingAuth: false, user: null });
      console.error('Error checking authentication:', error);
    }
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout');
      set({ user: null });
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error(
        error.response.data.message || 'Logout failed. Please try again.'
      );
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });

    try {
      const response = await axios.post('/auth/refresh-token');
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      console.error('Error refreshing token:', error);
    }
  },
}));

let refreshPromise = null;

// This interceptor handles the case when a 401 Unauthorized error occurs.
// It attempts to refresh the token and retry the original request.
// If the refresh fails, it logs the user out and redirects to the login page.
// It uses a promise to ensure that only one refresh request is made at a time.
// If a refresh is already in progress, it waits for it to complete before retrying the original request.
// This prevents multiple simultaneous refresh requests from being sent.

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
