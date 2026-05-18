import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import DashboardLayout from "./components/Dashboard/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import Login from "./features/auth/loginForm";
import Footer from "./components/Dashboard/Footer";
import Dashboard from "./features/dashboard/dashboard";
import NotFound from "./features/NotFound";
import Register from "./features/auth/registerForm";
import { refreshTokenOnLoad } from "./features/auth/authThunks";
import { useEffect } from "react";
import Unauthorized from "./features/Unauthorized";
import DoctorList from "./features/doctors/DoctorList";
import DoctorForm from "./features/doctors/DoctorForm";
import ScheduleList from "./features/schedules/ScheduleList";
import ScheduleForm from "./features/schedules/ScheduleForm";
import AppointmentList from "./features/appointments/AppointmentList";
import ResetPassword from "./features/auth/resetPassword";
import DoctorDetail from "./features/doctors/DoctorDetail";
import MLoadingOverlay from "./components/Loader/MLoader";
import AppointmentDetail from "./features/appointments/AppointmentDetail";
import PatientList from "./features/patients/PatientList";

function App() {
  const dispatch = useDispatch();
  const { accessToken, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Try to refresh token on app load
    // This only makes ONE request regardless of how many components
    console.log("try to refresh in app.jsx");
    dispatch(refreshTokenOnLoad());
  }, [dispatch]);

  if (loading) {
    return <MLoadingOverlay loading={loading} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={accessToken ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={accessToken ? <Navigate to="/" /> : <Register />}
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/unauthorized"
          element={
            !user || user.role !== "admin" ? (
              <Unauthorized />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route element={<PrivateRoute token={accessToken} />}>
          <Route element={<DashboardLayout />}>
            {/* dashboard  */}
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Doctor Routes */}
            <Route path="doctors/list" element={<DoctorList />} />
            <Route path="doctors/new" element={<DoctorForm />} />
            <Route path="doctors/:id" element={<DoctorForm />} />
            <Route path="doctor/detail/:id" element={<DoctorDetail />} />

            {/* schedules  */}
            <Route path="schedules/list" element={<ScheduleList />} />
            <Route path="schedules/new" element={<ScheduleForm />} />
            <Route path="schedules/:id" element={<ScheduleForm />} />

            {/* appointments  */}
            <Route path="appointments/list" element={<AppointmentList />} />
            {/* <Route
              path="appointment/detail/:id"
              element={<AppointmentDetail />}
            /> */}

            {/* patients  */}
            <Route path="patients/list" element={<PatientList />} />

            {/* not found  */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>

      {accessToken && <Footer />}
    </BrowserRouter>
  );
}

export default App;
