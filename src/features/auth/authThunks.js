import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../api/constant";
import axiosInstance from "../../api/axiosInstance";

export const registerUser = createAsyncThunk(
  "auth/RegisterUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL.BASE_URL}/auth/developer/register/QwertyuioP`,
        credentials,
      );
      console.log("response from register", response);
      return response.data;
    } catch (error) {
      console.error("Register error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Register failed! Please try again!",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL.BASE_URL}/auth/login`,
        credentials,
      );
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Login failed! Please try again!",
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL.BASE_URL}/auth/forgot-password`,
        { email },
      );

      console.log("response forgot", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset password link",
      );
    }
  },
);

export const refreshTokenOnLoad = createAsyncThunk(
  "auth/refreshOnLoad",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // Step 1: Refresh token
      const refreshResponse = await axiosInstance.post("/auth/refresh-token");
      const { accessToken } = refreshResponse.data;
      
      // Step 2: Immediately fetch user data with new token
      const userResponse = await axiosInstance.get("/auth/me");
      const userData = userResponse.data.data.user;
      
      // Return both token and user data
      return {
        accessToken,
        user: userData
      };
    } catch (error) {
      // Differentiate between network error vs auth error
      if (error.response?.status === 401) {
        // Session expired - normal flow, not a real error
        return rejectWithValue(null);
      }
      
      // Network error or server error
      return rejectWithValue(
        error.response?.data?.message || "Failed to initialize application"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/logout", credentials);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed Please try again!",
      );
    }
  },
);
