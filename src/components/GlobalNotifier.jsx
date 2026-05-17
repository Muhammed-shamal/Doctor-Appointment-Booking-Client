import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../context/SnackBar";
import { clearAuthError, clearAuthSuccess } from "../features/auth/authSlice";
import {
  clearDoctorError,
  clearDoctorSuccess,
} from "../features/doctors/doctorSlice";

const GlobalNotifier = () => {
  const dispatch = useDispatch();
  const Toast = useToast();

  const { error: authError, success: authSuccess } = useSelector(
    (state) => state.auth,
  );

  const { error: doctorError, success: doctorSuccess } = useSelector(
    (state) => state.doctor,
  );
  // const { error: dashboardError } = useSelector((state) => state.dashboard);

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

    // if (dashboardError) {
    //   Toast(dashboardError, "error");
    //   dispatch(clearError ());
    // }
  }, [
    authError,
    authSuccess,
    doctorError,
    doctorSuccess,
    // dashboardError,
    Toast,
    dispatch,
  ]);

  return null;
};

export default GlobalNotifier;
