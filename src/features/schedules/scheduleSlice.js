import { createSlice } from "@reduxjs/toolkit";
import {
  createSchedule,
  deleteSchedule,
  getDoctorSchedules,
  getScheduleById,
  updateSchedule,
} from "./scheduleThunks";

const initialState = {
  schedules: [],
  selectedSchedule: null,
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
        state.success = action.payload.message || "Schedule created";
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createSchedule
      .addCase(updateSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSchedule = action.payload.schedule;
        const index = state.schedules.findIndex(
          (s) => s._id === updateSchedule._id,
        );

        if (index !== -1) {
          state.schedules[index] = updatedSchedule;
        }
        if (state.selectedSchedule?._id === updatedSchedule._id) {
          state.selectedSchedule = updatedSchedule;
        }
        state.success = action.payload.message || "Schedule updated";
      })
      .addCase(updateSchedule.rejected, (state, action) => {
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
      })

      // getDoctorById
      .addCase(getScheduleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getScheduleById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSchedule = action.payload.schedule;
      })
      .addCase(getScheduleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteSchedule
      .addCase(deleteSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload.id;

        state.doctors = state.doctors.filter((d) => d._id !== id);
        if (state.selectedSchedule?._id === id) {
          state.selectedSchedule = null;
        }
        state.success =
          action.payload.message || "Schedule deleted successfully";
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearScheduleError, clearScheduleSuccess, resetSchedules } =
  scheduleSlice.actions;
export default scheduleSlice.reducer;
