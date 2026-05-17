import { createSlice } from "@reduxjs/toolkit";
import { createSchedule, getDoctorSchedules } from "./scheduleThunks";

const initialState = {
  schedules: [],
  loading: false,
  error: null,
  success: null,
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    clearScheduleError: (state) => {
      state.error = null;
    },
    clearScheduleSuccess: (state) => {
      state.success = null;
    },
    resetSchedules: (state) => {
      state.schedules = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // createSchedule
      .addCase(createSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.loading = false;
        const schedule = action.payload?.schedule || action.payload;
        if (schedule) state.schedules.push(schedule);
        state.success = "Schedule created successfully";
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getDoctorSchedules
      .addCase(getDoctorSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload?.schedules || action.payload || [];
      })
      .addCase(getDoctorSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearScheduleError, clearScheduleSuccess, resetSchedules } =
  scheduleSlice.actions;
export default scheduleSlice.reducer;
