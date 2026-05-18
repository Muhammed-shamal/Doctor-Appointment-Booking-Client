import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import doctorReducer from "../features/doctors/doctorSlice";
import scheduleReducer from "../features/schedules/scheduleSlice";
import appointmentReducer from "../features/appointments/appointmentSlice";
import patientReducer from "../features/patients/patientSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    doctor: doctorReducer,
    schedule: scheduleReducer,
    appointment: appointmentReducer,
    patient: patientReducer
  },
});
