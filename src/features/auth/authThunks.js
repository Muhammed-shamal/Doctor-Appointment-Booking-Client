import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../api/constant';

export const registerUser = createAsyncThunk(
  'auth/RegisterUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL.BASE_URL}/auth/developer/register/QwertyuioP`, credentials);
      console.log("response from register",response);
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Register failed! Please try again!');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL.BASE_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Login failed! Please try again!');
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/me',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/auth/me');
      console.log('get me response',response);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'failed to fetch profile!');
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

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL.BASE_URL}/auth/forgot-password`,
        { email }
      );

      console.log('response forgot',response)
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to send reset password link"
      );
    }
  }
);
