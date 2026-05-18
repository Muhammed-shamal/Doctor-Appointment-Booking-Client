import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../api/constant";
import axiosInstance, { refreshInstance } from "../../api/axiosInstance";
import authService from "../../api/auth";

export const registerUser = createAsyncThunk(
  "auth/RegisterUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL.BASE_URL}/auth/register`,
        credentials,
        { withCredentials: true },
      );

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
        { withCredentials: true },
      );

      authService.setAccessToken(response.data.result.accessToken);
      return response.data.result;
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

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset password link",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ password, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL.BASE_URL}/auth/reset-password/${token}`,
        {
          password,
        },
      );

      return response.data;
    } catch (error) {
      console.error("erset err", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password",
      );
    }
  },
);

export const refreshTokenOnLoad = createAsyncThunk(
  "auth/refreshOnLoad",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // Step 1: Refresh token
      console.log("prepare for refresh");
      const refreshResponse = await refreshInstance.post("/auth/refresh-token");
      console.log("refreshResponse", refreshResponse);
      const { accessToken } = refreshResponse.data.result;

      // Step 2: Immediately fetch user data with new token
      const userResponse = await axiosInstance.get("/auth/me");
      console.log("user respose", userResponse);
      const userData = userResponse.data.result.user;

      // Return both token and user data
      return {
        accessToken,
        user: userData,
      };
    } catch (error) {
      console.log("error for refresh", error);
      // Differentiate between network error vs auth error
      if (error.response?.status === 401) {
        // Session expired - normal flow, not a real error
        return rejectWithValue(null);
      }

      // Network error or server error
      return rejectWithValue(
        error.response?.data?.message || "Failed to initialize application",
      );
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await authService.clearAuth();

    localStorage.clear();
    sessionStorage.clear();

    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
