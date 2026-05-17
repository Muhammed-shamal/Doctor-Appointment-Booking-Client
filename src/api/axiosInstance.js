import axios from "axios";
import { API_URL } from "./constant";
import { store } from "../redux/store";
import { logout } from "../features/auth/authSlice";

const axiosInstance = axios.create({
  baseURL: API_URL.BASE_URL,
  timeout: 20000, // timeout in milliseconds (e.g., 20 seconds)
  withCredentials: true,
});

const refreshInstance = axios.create({
  baseURL: API_URL.BASE_URL,
  timeout: 20000, // timeout in milliseconds (e.g., 20 seconds)
  withCredentials: true,
});

//request;
axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//response;
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        const response = await refreshInstance.post("/auth/refresh");
        console.log('response from refrehs');

        const newAccessToken = response.data.accessToken;

        // Save new token
        store.dispatch(setAccessToken(newAccessToken));

        // Update failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed → logout
        handleAutoLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// 🔒 Logout and redirect user
function handleAutoLogout() {
  store.dispatch(logout());
}

export default axiosInstance;
