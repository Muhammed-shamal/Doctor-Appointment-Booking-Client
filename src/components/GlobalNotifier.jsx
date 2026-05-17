import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../context/SnackBar";
import { clearAuthError, clearAuthSuccess } from "../features/auth/authSlice";
import {
  clearDoctorError,
  clearDoctorSuccess,
} from "../features/doctors/doctorSlice";
import { clearScheduleError, clearScheduleSuccess } from "../features/schedules/scheduleSlice";
import { clearDashboardError } from "../features/dashboard/dashboardSlice";

const GlobalNotifier = () => {
  const dispatch = useDispatch();
  const Toast = useToast();

  const { error: authError, success: authSuccess } = useSelector(
    (state) => state.auth,
  );

  const { error: doctorError, success: doctorSuccess } = useSelector(
    (state) => state.doctor,
  );

  const { error: scheduleError, success: scheduleSuccess } = useSelector(
    (state) => state.schedule,
  );

  const { error: dashboardError } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (authError) {
      Toast(authError, "error");
      dispatch(clearAuthError());
    }

    if (authSuccess) {
      Toast(authSuccess, "success");
      dispatch(clearAuthSuccess());
    }

    if (doctorError) {
      Toast(doctorError, "error");
      dispatch(clearDoctorError());
    }

    if (doctorSuccess) {
      Toast(doctorSuccess, "success");
      dispatch(clearDoctorSuccess());
    }

    if (scheduleError) {
      Toast(scheduleError, "error");
      dispatch(clearScheduleError());
    }

    if (scheduleSuccess) {
      Toast(scheduleSuccess, "success");
      dispatch(clearScheduleSuccess());
    }

    if (dashboardError) {
      Toast(dashboardError, "error");
      dispatch(clearDashboardError());
    }
  }, [
    authError,
    authSuccess,
    doctorError,
    doctorSuccess,
    scheduleError,
    scheduleSuccess,
    dashboardError,
    Toast,
    dispatch,
  ]);

  return null;
};

export default GlobalNotifier;
