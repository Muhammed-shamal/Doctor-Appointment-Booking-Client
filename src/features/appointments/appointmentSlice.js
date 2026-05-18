import { createSlice } from "@reduxjs/toolkit";
import {
  bookAppointment,
  cancelAppointment,
  getAppointmentById,
  getMyAppointments,
  updateAppointmentStatus,
} from "./appointmentThunks";

const initialState = {
  appointments: [],
  selectedAppointment: null,
  totalAppointments: 0,
  currentPage: 1,
  limit: 10,

  loading: false,
  error: null,
  success: null,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearAppointmentError: (state) => {
      state.error = null;
    },
    clearAppointmentSuccess: (state) => {
      state.success = null;
    },
    resetAppointments: (state) => {
      state.appointments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // bookAppointment
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const appointment = action.payload;
        if (appointment) state.appointments.unshift(appointment);
        state.success =
          action.payload?.message || "Appointment booked successfully";
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getMyAppointments
      .addCase(getMyAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.results;
        state.totalAppointments = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.limit = action.payload.totalPages;
      })
      .addCase(getMyAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //by id;
      .addCase(getAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAppointment = action.payload;
      })
      .addCase(getAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateAppointmentStatus
      .addCase(updateAppointmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        if (updated) {
          const idx = state.appointments.findIndex(
            (a) => a._id === updated._id,
          );
          if (idx !== -1) state.appointments[idx] = updated;
        }
        state.success = action.payload?.message || "Appointment status updated";
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        if (updated) {
          const idx = state.appointments.findIndex(
            (a) => a._id === updated._id,
          );
          if (idx !== -1) state.appointments[idx] = updated;
        }
        state.success = action.payload?.message || "Appointment canceld ";
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAppointmentError,
  clearAppointmentSuccess,
  resetAppointments,
} = appointmentSlice.actions;
export default appointmentSlice.reducer;
