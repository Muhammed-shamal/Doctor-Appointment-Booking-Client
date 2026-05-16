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

export const settingsAPI = {
  get: (projectId) => axiosInstance.get(`/settings/getBy/${projectId}`),
  update: (projectId, settings) =>
    axiosInstance.put(`/settings/update/${projectId}`, settings),
  testConnection: (data) =>
    axiosInstance.post(`/settings/test-connection`, data),
  getConnectionStatus: (projectId) =>
    api.get(`/settings/connection-status/${projectId}`),
  bulkUpdate: (projectId, updates) =>
    api.patch(`/settings/bulk-update/${projectId}`, { updates }),
  reset: (projectId) => api.delete(`/settings/reset/${projectId}`),
};

// Add to services/api.js
export const messagingAPI = {
  sendTestMessage: (data) =>
    axiosInstance.post("/messaging/send-test-message", data),
  sendBulkMessages: (data) =>
    axiosInstance.post("/messaging/send-bulk-messages", data),
  sendTemplateMessage: (data) =>
    axiosInstance.post("/messaging/send-template-message", data),
  getMessageStatus: (messageId, provider, credentials) =>
    axiosInstance.get(
      `/messaging/message-status/${messageId}?provider=${provider}&credentials=${JSON.stringify(credentials)}`,
    ),
};

export const mailAPI = {
  sendTest: (data) => axiosInstance.post(`/settings/mail/send/test`, data),
};

export default axiosInstance;
