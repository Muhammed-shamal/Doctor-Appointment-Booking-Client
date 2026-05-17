import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import doctorReducer from "../features/doctors/doctorSlice";
import scheduleReducer from "../features/scheduleSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    doctor: doctorReducer,
    schedule: scheduleReducer,
  },
});
