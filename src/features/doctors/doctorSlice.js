import { createSlice } from "@reduxjs/toolkit";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "./doctorThunks";

const initialState = {
  doctors: [],
  selectedDoctor: null,
  totalDoctors: 0,
  currentPage: 1,
  limit: 10,

  loading: false,
  error: null,
  success: null,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    clearDoctorError: (state) => {
      state.error = null;
    },

    clearDoctorSuccess: (state) => {
      state.success = null;
    },

    resetSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // getDoctors
      .addCase(getDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.results;
        state.totalDoctors = action.payload.totalCount || 0;
        state.currentPage = action.payload.currentPage || 1;
        state.limit = action.payload.totalPages || 10;
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getDoctorById
      .addCase(getDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDoctor = action.payload;
      })
      .addCase(getDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createDoctor
      .addCase(createDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors.push(action.payload);
        state.success = action.payload.message || "Doctor created successfully";
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateDoctor
      .addCase(updateDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDoctor = action.payload;
        const index = state.doctors.findIndex(
          (d) => d._id === updatedDoctor._id,
        );
        if (index !== -1) {
          state.doctors[index] = updatedDoctor;
        }
        if (state.selectedDoctor?._id === updatedDoctor._id) {
          state.selectedDoctor = updatedDoctor;
        }
        state.success = action.payload.message || "Doctor updated successfully";
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteDoctor
      .addCase(deleteDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload.id;

        state.doctors = state.doctors.filter((d) => d._id !== id);
        if (state.selectedDoctor?._id === id) {
          state.selectedDoctor = null;
        }
        state.success = action.payload.message || "Doctor deleted successfully";
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDoctorError, clearDoctorSuccess, resetSelectedDoctor } =
  doctorSlice.actions;
export default doctorSlice.reducer;
