import axios from "axios";

// Create Axios instance with base URL from environment
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Automatically attach Bearer token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("careerbridge_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Automatically handle 401 Unauthorized / Token Expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Check if not already on login or signup to prevent redirect loops
      const currentPath = window.location.pathname;
      const isAuthRoute =
        currentPath === "/login" ||
        currentPath === "/signup" ||
        currentPath === "/forgot-password" ||
        currentPath.startsWith("/reset-password");

      if (!isAuthRoute) {
        // Clear expired credentials
        localStorage.removeItem("careerbridge_token");
        localStorage.removeItem("careerbridge_user");
        // Redirect to login with friendly message
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
