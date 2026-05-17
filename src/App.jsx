import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import DashboardLayout from "./components/Dashboard/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import Login from "./features/auth/loginForm";
import Footer from "./components/Dashboard/Footer";
import Dashboard from "./features/dashboard/dashboard";
import NotFound from "./features/NotFound";
import Register from "./features/auth/registerForm";
import { getMyRefresh } from "./features/auth/authThunks";
import { useEffect } from "react";

function App() {
  const { accessToken } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyRefresh());
  }, []);

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

        <Route element={<PrivateRoute token={accessToken} />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>

      {accessToken && <Footer />}
    </BrowserRouter>
  );
}

export default App;
