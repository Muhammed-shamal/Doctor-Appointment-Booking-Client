import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardData } from './dashboardThunk';

const initialState = {
  loading: false,
  error: null,
  role: null,
  kpis: {
    // Patient KPIs
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    upcomingAppointments: 0,
    // Admin KPIs
    totalDoctors: 0,
    totalPatients: 0,
    todayAppointments: 0,
  },
  data: {
    recentAppointments: [],
    nextAppointment: null,
    topDoctors: [],
    appointmentTrends: [],
  }
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
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
        state.kpis = action.payload.kpis || {};
        state.data = {
          recentAppointments: action.payload.recentAppointments || [],
          nextAppointment: action.payload.nextAppointment || null,
          topDoctors: action.payload.topDoctors || [],
          appointmentTrends: action.payload.appointmentTrends || [],
        };
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load dashboard data';
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
