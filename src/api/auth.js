import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from './constant';
import { refreshInstance } from './axiosInstance';

class AuthService {
  constructor() {
    this.accessToken = null;
    this.refreshPromise = null;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Process queue of failed requests while refreshing
  processQueue(error, token = null) {
    this.failedQueue.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  async refreshToken() {
    if (this.isRefreshing) {
      // Wait for existing refresh to complete
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;
    
    try {
      console.log('try to refresh reques')
      // Server reads refresh token from HttpOnly cookie
      const response = refreshInstance.post("/auth/refresh-token");

      console.log('try to refresh the token',response);
      
      const { accessToken } = response.data.result;
      this.setAccessToken(accessToken);
      
      this.processQueue(null, accessToken);
      return accessToken;
    } catch (error) {
      this.processQueue(error, null);
      this.clearAuth();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  setAccessToken(token) {
    console.log('try to settinug token',token)
    this.accessToken = token;
    
    // Optional: Store temporarily for page refresh (5 min window)
    if (token) {
      const expiryTime = jwtDecode(token).exp * 1000;
      localStorage.setItem('token_expiry', expiryTime.toString());
      sessionStorage.setItem('temp_token', token); // Session storage clears on tab close
    }
  }

  getAccessToken() {
    console.log('this token',this.accessToken);
    // Check if we have a valid token in memory
    if (this.accessToken && !this.isTokenExpired(this.accessToken)) {
      return this.accessToken;
    }
    
    // Try to restore from session storage on page refresh
    const tempToken = sessionStorage.getItem('temp_token');
    if (tempToken && !this.isTokenExpired(tempToken)) {
      this.accessToken = tempToken;
      return tempToken;
    }
    
    return null;
  }

  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  clearAuth() {
    this.accessToken = null;
    sessionStorage.removeItem('temp_token');
    localStorage.removeItem('token_expiry');
    
    // Call logout API
    axios.post(`${API_URL.BASE_URL}/auth/logout`, {}, { withCredentials: true });
  }
}

export default new AuthService();