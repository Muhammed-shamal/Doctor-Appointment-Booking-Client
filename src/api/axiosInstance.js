import axios from "axios";
import { io } from "socket.io-client";
import { API_URL } from "./constant";
import authService from "./auth";

const axiosInstance = axios.create({
  baseURL: API_URL.BASE_URL,
  timeout: 30000,
  withCredentials: true, // Important for HttpOnly cookies
});

export const refreshInstance = axios.create({
  baseURL: API_URL.BASE_URL,
  withCredentials: true,
});

export const socket = io(API_URL.SOCKET_URL, {
  autoConnect: false,
  withCredentials: true, // send cookies automatically
  reconnectionAttempts: 5,
  reconnectionDelay: 5000,
  transports: ["websocket"],
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Skip auth header for refresh endpoint
    if (config.url?.includes("/auth/refresh-token")) {
      return config;
    }

    let token = authService.getAccessToken();
    console.log("token from access", token);

    if (!token) {
      // Try to refresh silently
      try {
        token = await authService.refreshToken();
      } catch (error) {
        // Redirect to login if refresh fails
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await authService.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        authService.clearAuth();

        // Prevent infinite redirect loop
        if (!window.location.pathname.includes("/login")) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      // User doesn't have permission so by default redirect to unauthorized page;
      window.location.href = "/unauthorized";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
