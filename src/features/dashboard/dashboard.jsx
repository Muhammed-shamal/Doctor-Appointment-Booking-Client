import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LocalHospital,
  People,
  EventNote,
  CheckCircle,
  CancelOutlined,
  DashboardOutlined,
  TrendingUp,
} from "@mui/icons-material";
import {
  Grid,
  Card,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import LoadingOverlay from "../../components/LoadingOverlay";
import { fetchDashboardData } from "./dashboardThunk";
import { useNavigate } from "react-router-dom";
import LiveClock from "../../components/Clock";
import Header from "../../components/Header";
import { KPICard } from "../../components/Dashboard/Index/KpiCards";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, kpis, data, error } = useSelector(
    (state) => state.dashboard,
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (error && !loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6" mb={2}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => dispatch(fetchDashboardData())}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <Box sx={{ mb: 3 }}>
      {loading && <LoadingOverlay />}

      {/* Clock */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4} lg={3}>
          <LiveClock />
        </Grid>
      </Grid>

      <Header 
        title={isAdmin ? "Admin Dashboard" : "My Dashboard"} 
        icon={<DashboardOutlined />} 
      />

      {/* KPIs Section */}
      <Grid container spacing={3} mb={6} mt={3}>
        {isAdmin ? (
          // Admin KPIs
          <>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <KPICard
                label="Total Doctors"
                count={kpis.totalDoctors}
                icon={<LocalHospital sx={{ color: "white", fontSize: 28 }} />}
                color="#2196F3"
                bgColor="#E3F2FD"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <KPICard
                label="Total Patients"
                count={kpis.totalPatients}
                icon={<People sx={{ color: "white", fontSize: 28 }} />}
                color="#4CAF50"
                bgColor="#E8F5E8"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <KPICard
                label="Total Appointments"
                count={kpis.totalAppointments}
                icon={<EventNote sx={{ color: "white", fontSize: 28 }} />}
                color="#FF9800"
                bgColor="#FFF3E0"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <KPICard
                label="Completed"
                count={kpis.completedAppointments}
                icon={<CheckCircle sx={{ color: "white", fontSize: 28 }} />}
                color="#8BC34A"
                bgColor="#F1F8E9"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <KPICard
                label="Cancelled"
                count={kpis.cancelledAppointments}
                icon={<CancelOutlined sx={{ color: "white", fontSize: 28 }} />}
                color="#F44336"
                bgColor="#FFEBEE"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <KPICard
                label="Today's Appointments"
                count={kpis.todayAppointments}
                icon={<TrendingUp sx={{ color: "white", fontSize: 28 }} />}
                color="#9C27B0"
                bgColor="#F3E5F5"
              />
            </Grid>
          </>
        ) : (
          // Patient KPIs
          <>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <KPICard
                label="Total Appointments"
                count={kpis.totalAppointments}
                icon={<EventNote sx={{ color: "white", fontSize: 28 }} />}
                color="#2196F3"
                bgColor="#E3F2FD"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <KPICard
                label="Completed"
                count={kpis.completedAppointments}
                icon={<CheckCircle sx={{ color: "white", fontSize: 28 }} />}
                color="#4CAF50"
                bgColor="#E8F5E8"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <KPICard
                label="Upcoming"
                count={kpis.upcomingAppointments}
                icon={<TrendingUp sx={{ color: "white", fontSize: 28 }} />}
                color="#FF9800"
                bgColor="#FFF3E0"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <KPICard
                label="Cancelled"
                count={kpis.cancelledAppointments}
                icon={<CancelOutlined sx={{ color: "white", fontSize: 28 }} />}
                color="#F44336"
                bgColor="#FFEBEE"
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Recent Appointments Table */}
      {data.recentAppointments && data.recentAppointments.length > 0 && (
        <Box mb={6}>
          <Header title="Recent Appointments" />
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  {isAdmin ? (
                    <>
                      <TableCell><strong>Patient</strong></TableCell>
                      <TableCell><strong>Doctor</strong></TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell><strong>Doctor</strong></TableCell>
                    </>
                  )}
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Time</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.recentAppointments.map((apt, idx) => (
                  <TableRow key={idx} hover>
                    {isAdmin && (
                      <TableCell>{apt.patientName || apt.patient?.name || "N/A"}</TableCell>
                    )}
                    {isAdmin ? (
                      <TableCell>{apt.doctorName || apt.doctor?.name || "N/A"}</TableCell>
                    ) : (
                      <TableCell>{apt.doctorName || apt.doctor?.name || "N/A"}</TableCell>
                    )}
                    <TableCell>{apt.appointmentDate || "N/A"}</TableCell>
                    <TableCell>{apt.appointmentTime || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={apt.status || "Pending"}
                        color={
                          apt.status === "completed"
                            ? "success"
                            : apt.status === "cancelled"
                              ? "error"
                              : "warning"
                        }
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Next Appointment (Patient only) */}
      {!isAdmin && data.nextAppointment && (
        <Box mb={6}>
          <Header title="Your Next Appointment" />
          <Card sx={{ p: 4, borderRadius: 2, boxShadow: 2, bgcolor: "#E3F2FD" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Doctor
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {data.nextAppointment.doctorName ||
                        data.nextAppointment.doctor?.name ||
                        "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Specialization
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {data.nextAppointment.specialization ||
                        data.nextAppointment.doctor?.specialization ||
                        "N/A"}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Date & Time
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {data.nextAppointment.appointmentDate} at{" "}
                      {data.nextAppointment.appointmentTime}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Status
                    </Typography>
                    <Chip
                      label={data.nextAppointment.status || "Confirmed"}
                      color="success"
                    />
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Box>
      )}

      {/* Top Doctors (Admin only) */}
      {isAdmin && data.topDoctors && data.topDoctors.length > 0 && (
        <Box mb={6}>
          <Header title="Top Doctors" />
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Specialization</strong></TableCell>
                  <TableCell><strong>Appointments</strong></TableCell>
                  <TableCell><strong>Rating</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.topDoctors.map((doctor, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{doctor.name || "N/A"}</TableCell>
                    <TableCell>{doctor.specialization || "N/A"}</TableCell>
                    <TableCell>{doctor.appointmentCount || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={doctor.rating ? `${doctor.rating.toFixed(1)} ⭐` : "N/A"}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Appointment Trends Chart (Admin only) */}
      {isAdmin && data.appointmentTrends && data.appointmentTrends.length > 0 && (
        <Box mb={6}>
          <Header title="Appointment Trends" />
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Trend data: {JSON.stringify(data.appointmentTrends)}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              📊 Chart visualization can be added with charting libraries like Recharts or Chart.js
            </Typography>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
