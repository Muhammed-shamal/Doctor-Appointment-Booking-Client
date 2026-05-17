import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const bookAppointment = createAsyncThunk(
  "appointment/bookAppointment",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/appointments", appointmentData);
      return res.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to book appointment",
      );
    }
  },
);

export const getMyAppointments = createAsyncThunk(
  "appointment/getMyAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/appointments");
      return res.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to retrieve appointments",
      );
    }
  },
);

export const updateAppointmentStatus = createAsyncThunk(
  "appointment/updateAppointmentStatus",
  async ({ appointmentId, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/appointments/${appointmentId}`, { status });
      return res.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update appointment status",
      );
    }
  },
);
