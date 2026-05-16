import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../api/constant';

export const registerUser = createAsyncThunk(
  'auth/RegisterUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL.BASE_URL}auth/register`, credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Login failed! Please try again!');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL.BASE_URL}auth/login`, credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Login failed! Please try again!');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/logout', credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed Please try again!');
    }
  }
);
