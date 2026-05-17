import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const createSchedule = createAsyncThunk(
  "schedule/createSchedule",
  async (scheduleData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/schedules", scheduleData);
      return res.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create schedule"
      );
    }
  }
);

export const getDoctorSchedules = createAsyncThunk(
  "schedule/getDoctorSchedules",
  async (doctorId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/schedules/${doctorId}`);
      return res.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to retrieve schedules"
      );
    }
  }
);
