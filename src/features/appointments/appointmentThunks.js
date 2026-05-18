import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const bookAppointment = createAsyncThunk(
  "appointment/bookAppointment",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/appointments/book",
        appointmentData,
      );
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
      console.log("res is my appointments", res);
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
      const res = await axiosInstance.patch(
        `/appointments/${appointmentId}/status`,
        { status },
      );
      return res.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update appointment status",
      );
    }
  },
);

export const cancelAppointment = createAsyncThunk(
  "appointment/cancelAppointment",
  async ({ appointmentId, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/appointments/${appointmentId}/status/cancel`,
        { status },
      );
      return res.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update appointment status",
      );
    }
  },
);

export const getAppointmentById = createAsyncThunk(
  "appointment/getAppointmentById",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/appointments/${appointmentId}`,
      );
      console.log("response appint by id",response)
      return response.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to retrieve appointment",
      );
    }
  },
);
