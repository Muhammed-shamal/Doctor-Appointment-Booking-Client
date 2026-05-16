import axios from "axios";
import { API_URL } from "./constant";
import { store } from "../redux/store";
import { logout } from "../features/auth/authSlice";

const axiosInstance = axios.create({
  baseURL: API_URL.BASE_URL,
  timeout: 20000, // timeout in milliseconds (e.g., 20 seconds)
  withCredentials: true
});

//request;
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

//response;
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status === 401 || response.status === 403) {
      handleAutoLogout();
    }
    return response;
  },
  (error) => {
    console.error("error is", error);
    // For 401 Unauthorized or any auth error
    if (error.response && error.response.status === 401) {
      handleAutoLogout();
    }

    return Promise.reject(error);
  },
);

// 🔒 Logout and redirect user
function handleAutoLogout() {
  store.dispatch(logout());
}

export default axiosInstance;
