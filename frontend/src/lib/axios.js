import axios from 'axios';

// This file creates an axios instance with a base URL and withCredentials set to true.
// This allows us to make requests to the backend API without having to specify the base URL every time.
// It also allows us to send cookies with requests, which is useful for authentication.
// The base URL is set to "http://localhost:5000/api" in development mode and "/api" in production mode.
// This is a common pattern in React applications that use axios for making HTTP requests.
// We use import.meta.mode to check if we are in development or production mode.
// This is a Vite specific feature that allows us to access the current mode.

const axiosInstance = axios.create({
  baseURL:
    import.meta.mode === 'development' ? 'http://localhost:5000/api' : '/api',
  withCredentials: true, // send cookies with requests
});

export default axiosInstance;
