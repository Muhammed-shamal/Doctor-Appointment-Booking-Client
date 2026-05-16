import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardData } from './dashboardThunk';

const initialState = {
  loading: false,
  error: null,
  kpis: {
    totalEnquiries: 0,
    totalBlogs: 0,
    totalClients: 0,
    totalTestimonials: 0,
  },
  tables: {
    recentEnquiries: [],
    recentWorks: [],
    recentBlogs: { count: 0, data: [] },
  }
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // ✅ FIXED: Export the name GlobalNotifier expects
    clearDashboardError: (state) => {
      state.error = null;
    },
    // Keep old name as alias for backward compatibility
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.kpis = action.payload.kpis;
        state.tables = action.payload.tables;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load dashboard data';
      });
  },
});

export const { clearDashboardError, clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
