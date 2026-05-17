import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/summary");
      console.log("Dashboard summary response", res.data);
      return res.data.result;
    } catch (error) {
      console.error("Fetch dashboard error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Dashboard fetch failed!");
    }
  }
);
