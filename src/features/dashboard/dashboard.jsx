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
  Schedule,
  Star,
  AccessTime,
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
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";

import LoadingOverlay from "../../components/LoadingOverlay";
import { fetchDashboardData } from "./dashboardThunk";
import { useNavigate } from "react-router-dom";
import LiveClock from "../../components/Clock";
import Header from "../../components/Header";
import { KPICard } from "../../components/Dashboard/Index/KpiCards";
import { formatDate, formatTime } from "../../common/commonFunction";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { loading, kpis, data, error } = useSelector(
    (state) => state.dashboard,
  );

  console.log("data is dashboard", data);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (error && !loading) {
    return (
      <Box sx={{ p: { xs: 2, sm: 4 }, textAlign: "center" }}>
        <Typography color="error" variant="h6" mb={2}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => dispatch(fetchDashboardData())}
          size={isMobile ? "small" : "medium"}
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

      {/* Clock Section */}
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <LiveClock variant="compact" />
      </Box>

      <Header
        title={isAdmin ? "Admin Dashboard" : "My Dashboard"}
        icon={<DashboardOutlined />}
      />

      {/* KPIs Section - Responsive Grid */}
      <Box sx={{ mb: { xs: 4, sm: 5, md: 6 }, mt: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5, lg: 3 }}>
          {isAdmin ? (
            // Admin KPIs
            <>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <KPICard
                  label="Total Doctors"
                  count={kpis.totalDoctors}
                  icon={<LocalHospital sx={{ color: "white" }} />}
                  color="#2196F3"
                  bgColor="#E3F2FD"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <KPICard
                  label="Total Patients"
                  count={kpis.totalPatients}
                  icon={<People sx={{ color: "white" }} />}
                  color="#4CAF50"
                  bgColor="#E8F5E8"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <KPICard
                  label="Total Appointments"
                  count={kpis.totalAppointments}
                  icon={<EventNote sx={{ color: "white" }} />}
                  color="#FF9800"
                  bgColor="#FFF3E0"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <KPICard
                  label="Completed"
                  count={kpis.completedAppointments}
                  icon={<CheckCircle sx={{ color: "white" }} />}
                  color="#8BC34A"
                  bgColor="#F1F8E9"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <KPICard
                  label="Cancelled"
                  count={kpis.cancelledAppointments}
                  icon={<CancelOutlined sx={{ color: "white" }} />}
                  color="#F44336"
                  bgColor="#FFEBEE"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <KPICard
                  label="Today's Appointments"
                  count={kpis.todayAppointments}
                  icon={<TrendingUp sx={{ color: "white" }} />}
                  color="#9C27B0"
                  bgColor="#F3E5F5"
                />
              </Grid>
            </>
          ) : (
            // Patient KPIs
            <>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <KPICard
                  label="Total Appointments"
                  count={kpis.totalAppointments}
                  icon={<EventNote sx={{ color: "white" }} />}
                  color="#2196F3"
                  bgColor="#E3F2FD"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <KPICard
                  label="Completed"
                  count={kpis.completedAppointments}
                  icon={<CheckCircle sx={{ color: "white" }} />}
                  color="#4CAF50"
                  bgColor="#E8F5E8"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <KPICard
                  label="Upcoming"
                  count={kpis.upcomingAppointments}
                  icon={<TrendingUp sx={{ color: "white" }} />}
                  color="#FF9800"
                  bgColor="#FFF3E0"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <KPICard
                  label="Cancelled"
                  count={kpis.cancelledAppointments}
                  icon={<CancelOutlined sx={{ color: "white" }} />}
                  color="#F44336"
                  bgColor="#FFEBEE"
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      {/* Recent Appointments Table */}
      {data.recentAppointments && data.recentAppointments.length > 0 && (
        <Box sx={{ mb: { xs: 4, sm: 5, md: 6 }, mt: 10 }}>
          <Header title="Recent Appointments" />
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: { xs: 1, sm: 2 },
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              overflow: { xs: "auto", sm: "auto" },
            }}
          >
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  {isAdmin ? (
                    <>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "0.85rem", sm: "0.95rem" },
                        }}
                      >
                        Patient
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "0.85rem", sm: "0.95rem" },
                        }}
                      >
                        Doctor
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "0.85rem", sm: "0.95rem" },
                        }}
                      >
                        Doctor
                      </TableCell>
                    </>
                  )}
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    }}
                  >
                    Date and Time
                  </TableCell>
                  {/* <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    }}
                  >
                    Time
                  </TableCell> */}
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.recentAppointments.map((apt, idx) => (
                  <TableRow
                    key={idx}
                    hover
                    sx={{
                      "&:hover": { bgcolor: "#f9f9f9" },
                      transition: "background-color 0.2s",
                    }}
                  >
                    {isAdmin && (
                      <TableCell
                        sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                      >
                        {apt.patient?.name || "N/A"}
                      </TableCell>
                    )}
                    {isAdmin ? (
                      <TableCell
                        sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                      >
                        {apt?.doctor
                          ? `Dr. ${apt.doctor.fname} ${apt.doctor.lname}`
                          : "N/A"}
                      </TableCell>
                    ) : (
                      <TableCell
                        sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                      >
                        {apt?.doctor
                          ? `Dr. ${apt.doctor.fname} ${apt.doctor.lname}`
                          : "N/A"}
                      </TableCell>
                    )}
                    <TableCell
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                    >
                      {formatDate(apt.appointmentDate)}
                    </TableCell>
                    {/* <TableCell
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                    >
                      {formatTime(apt.appointmentTime)}
                    </TableCell> */}
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
                        size={isMobile ? "small" : "medium"}
                        sx={{ fontWeight: 500 }}
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
        <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
          <Header title="Your Next Appointment" />
          <Card
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: { xs: 1.5, sm: 2, md: 2.5 },
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              bgcolor: "#E3F2FD",
              border: "1px solid rgba(33, 150, 243, 0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              <Grid item xs={12} md={6}>
                <Stack spacing={{ xs: 2, sm: 2.5 }}>
                  <Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <LocalHospital
                        sx={{ fontSize: "1.2rem", color: "#2196F3" }}
                      />
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        fontWeight={600}
                      >
                        Doctor
                      </Typography>
                    </Stack>
                    <Typography
                      variant={isMobile ? "body1" : "h6"}
                      fontWeight={700}
                      sx={{ color: "#1976D2" }}
                    >
                      {`Dr. ${data.nextAppointment.doctor.fname} ${data.nextAppointment.doctor.lname}`}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <Star sx={{ fontSize: "1.2rem", color: "#FF9800" }} />
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        fontWeight={600}
                      >
                        Specialization
                      </Typography>
                    </Stack>
                    <Typography
                      variant={isMobile ? "body1" : "h6"}
                      fontWeight={700}
                      sx={{ color: "#F57C00" }}
                    >
                      {data.nextAppointment.specialization ||
                        data.nextAppointment.doctor?.specialization ||
                        "N/A"}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={{ xs: 2, sm: 2.5 }}>
                  <Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <AccessTime
                        sx={{ fontSize: "1.2rem", color: "#4CAF50" }}
                      />
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        fontWeight={600}
                      >
                        Date & Time
                      </Typography>
                    </Stack>
                    <Typography
                      variant={isMobile ? "body1" : "h6"}
                      fontWeight={700}
                      sx={{ color: "#2E7D32" }}
                    >
                      {formatDate(data.nextAppointment.appointmentDate)}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <CheckCircle
                        sx={{ fontSize: "1.2rem", color: "#4CAF50" }}
                      />
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        fontWeight={600}
                      >
                        Status
                      </Typography>
                    </Stack>
                    <Chip
                      label={data.nextAppointment.status || "Confirmed"}
                      color="success"
                      variant="filled"
                      size={isMobile ? "small" : "medium"}
                      sx={{ fontWeight: 600 }}
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
        <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
          <Header title="Top Doctors" />
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: { xs: 1, sm: 2 },
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              overflow: "auto",
            }}
          >
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    }}
                  >
                    Specialization
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    }}
                  >
                    Appointments
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    }}
                  >
                    Rating
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.topDoctors.map((doctor, idx) => (
                  <TableRow
                    key={idx}
                    hover
                    sx={{
                      "&:hover": { bgcolor: "#f9f9f9" },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                    >
                      {doctor.name || "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                    >
                      {doctor.specialization || "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                    >
                      {doctor.appointmentCount || 0}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          doctor.rating
                            ? `${doctor.rating.toFixed(1)} ⭐`
                            : "N/A"
                        }
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                        sx={{ fontWeight: 500 }}
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
      {isAdmin &&
        data.appointmentTrends &&
        data.appointmentTrends.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Header title="Appointment Trends" />
            <Card
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: { xs: 1.5, sm: 2, md: 2.5 },
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Typography
                variant="body2"
                color="textSecondary"
                mb={2}
                sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
              >
                Trend data: {JSON.stringify(data.appointmentTrends)}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
              >
                📊 Chart visualization can be added with charting libraries like
                Recharts or Chart.js
              </Typography>
            </Card>
          </Box>
        )}
    </Box>
  );
};

export default Dashboard;
