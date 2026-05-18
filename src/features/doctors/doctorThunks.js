import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { API_URL } from "../../api/constant";

export const getDoctors = createAsyncThunk(
  "doctor/getDoctors",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/doctors', {
        params,
      });
      
      return response.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to retrieve doctors"
      );
    }
  }
);

export const getDoctorById = createAsyncThunk(
  "doctor/getDoctorById",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `doctors/${doctorId}`
      );
      
      return response.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to retrieve doctor"
      );
    }
  }
);

export const createDoctor = createAsyncThunk(
  "doctor/createDoctor",
  async (doctorData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/doctors',
        doctorData
      );
      
      return response.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create doctor"
      );
    }
  }
);

export const updateDoctor = createAsyncThunk(
  "doctor/updateDoctor",
  async ({ doctorId, doctorData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/doctors/${doctorId}`,
        doctorData
      );
      
      return response.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update doctor"
      );
    }
  }
);

export const deleteDoctor = createAsyncThunk(
  "doctor/deleteDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/doctors/${doctorId}`
      );
      
      return response.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete doctor"
      );
    }
  }
);
