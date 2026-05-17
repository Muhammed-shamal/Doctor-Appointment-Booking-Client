import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const createSchedule = createAsyncThunk(
  "schedule/createSchedule",
  async (scheduleData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/schedules", scheduleData);
      return res.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create schedule",
      );
    }
  },
);

export const updateSchedule = createAsyncThunk(
  "schedule/updateSchedule",
  async (scheduleId, scheduleData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/schedules/${scheduleId}`, scheduleData);
      return res.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update schedule",
      );
    }
  },
);

export const getDoctorSchedules = createAsyncThunk(
  "schedule/getDoctorSchedules",
  async (doctorId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/schedules/${doctorId}`);
      return res.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to retrieve schedules",
      );
    }
  },
);

export const getScheduleById = createAsyncThunk(
  "doctor/getScheduleById",
  async (scheduleId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`schedules/${scheduleId}`);
      console.log('response selectedSchedule',response);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to retrieve doctor",
      );
    }
  },
);


export const deleteSchedule = createAsyncThunk(
  "schedule/deleteSchedule",
  async (scheduleId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/schedules/${scheduleId}`);
      return res.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete schedule",
      );
    }
  },
);