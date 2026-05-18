import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { API_URL } from "../../api/constant";

export const getPatients = createAsyncThunk(
  "patients/getPatients",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/patients", {
        params,
      });
      return response.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to retrieve patients",
      );
    }
  },
);
