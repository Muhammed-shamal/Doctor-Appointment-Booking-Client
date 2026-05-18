import { createSlice } from "@reduxjs/toolkit";

import { getPatients } from "./patientThunk";

const initialState = {
  patients: [],
  totalPatients: 0,
  currentPage: 1,
  limit: 10,

  loading: false,
  error: null,
  success: null,
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    clearPatientError: (state) => {
      state.error = null;
    },

    clearPatientSuccess: (state) => {
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // getPatients
      .addCase(getPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.results;
        state.totalPatients = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.limit = action.payload.limit;
      })
      .addCase(getPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPatientError, clearPatientSuccess } =
  patientSlice.actions;
export default patientSlice.reducer;
