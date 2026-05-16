import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import DashboardLayout from './components/Dashboard/DashboardLayout';
import PrivateRoute from './PrivateRoute';
import Login from './features/auth/loginForm';
import Footer from './components/Dashboard/Footer';
import Dashboard from './features/dashboard/dashboard';
import NotFound from './features/NotFound';

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        {/* <Route path="/register" element={token ? <Navigate to="/" /> : <Login />} /> */}

        <Route element={<PrivateRoute token={token} />}>
          <Route element={<DashboardLayout />}>

            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="*" element={<NotFound />} />

          </Route>
        </Route>
      </Routes>

      {token && <Footer />}
    </BrowserRouter>
  );
}

export default App