import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Card,
  CardContent,
  alpha,
  useTheme,
  Stack,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  MedicalServices as MedicalServicesIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  DoneAll as DoneAllIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import {
  getAppointmentById,
  updateAppointmentStatus,
} from "./appointmentThunks";
import { DeleteConfirmDialog } from "../../components/Modal/MConfirmDiolog";
import { formatDate, formatTime } from "../../common/commonFunction";

const AppointmentDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const appointmentState = useSelector((state) => state.appointment);
  const appointment = appointmentState.selectedAppointment;
  const loading = appointmentState.loading;

  const [cancelDialog, setCancelDialog] = useState({
    open: false,
    appointment: null,
  });
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getAppointmentById(id));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCancelConfirm = async () => {
    if (!cancelDialog.appointment) return;
    try {
      setCancelLoading(true);
      await dispatch(
        updateAppointmentStatus({
          appointmentId: cancelDialog.appointment._id,
          status: "cancelled",
        }),
      ).unwrap();
      setCancelDialog({ open: false, appointment: null });
    } catch (err) {
      console.error("Failed to cancel appointment", err);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleReschedule = () => {
    navigate(`/appointments/reschedule/${appointment._id}`);
  };

  const handleDownloadReceipt = () => {
    // Implement receipt download functionality
    console.log("Download receipt");
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "completed":
        return "info";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircleIcon />;
      case "pending":
        return <PendingIcon />;
      case "completed":
        return <DoneAllIcon />;
      case "cancelled":
        return <CancelIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (!appointment) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Appointment not found
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.light,
          0.05,
        )} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              mb: 3,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                background: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            Back to Appointments
          </Button>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
            }}
          >
            <Grid
              container
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Grid>
                <Typography variant="h5" fontWeight="600" gutterBottom>
                  Appointment Details
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Appointment ID: {appointment._id}
                </Typography>
              </Grid>
              <Grid>
                <Chip
                  icon={getStatusIcon(appointment.status)}
                  label={getStatusText(appointment.status)}
                  color={getStatusColor(appointment.status)}
                  sx={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    py: 2,
                    px: 1,
                    bgcolor: "white",
                    "& .MuiChip-icon": {
                      color: "inherit",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Appointment Info Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Appointment Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EventIcon color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Appointment Date
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {formatDate(appointment.appointmentDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AccessTimeIcon color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Time Slot
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {appointment.slotStartTime} - {appointment.slotEndTime}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ReceiptIcon color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Booked On
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {formatDate(appointment.createdAt)} at{" "}
                        {formatTime(appointment.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Doctor Info Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Doctor Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    bgcolor: theme.palette.primary.main,
                    fontSize: 28,
                    mr: 2,
                  }}
                >
                  {appointment.doctor?.fname?.charAt(0)}
                  {appointment.doctor?.lname?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="600">
                    Dr. {appointment.doctor?.fname} {appointment.doctor?.lname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <MedicalServicesIcon
                      sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }}
                    />
                    Specialist
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PhoneIcon />}
                    onClick={() =>
                      (window.location.href = `tel:${appointment.doctor?.phone}`)
                    }
                    sx={{ borderRadius: 2 }}
                  >
                    Contact Doctor
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<EmailIcon />}
                    onClick={() =>
                      (window.location.href = `mailto:${appointment.doctor?.email}`)
                    }
                    sx={{ borderRadius: 2 }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Patient Info Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Patient Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Patient Name
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {appointment.patient?.fname} {appointment.patient?.lname}
                  </Typography>
                </Box>
              </Box>

              {appointment.patient?.phone && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PhoneIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Contact Number
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {appointment.patient.phone}
                    </Typography>
                  </Box>
                </Box>
              )}

              {appointment.patient?.email && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EmailIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {appointment.patient.email}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Sidebar - Actions */}
          {/* <Grid item xs={12} lg={4}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                position: "sticky",
                top: 20,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Quick Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>
                  {appointment.status === "pending" && (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleReschedule}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Reschedule Appointment
                    </Button>
                  )}

                  {(appointment.status === "pending" ||
                    appointment.status === "confirmed") && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={() => setCancelDialogOpen(true)}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Cancel Appointment
                    </Button>
                  )}

                  <Divider />

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadReceipt}
                    sx={{ borderRadius: 2 }}
                  >
                    Download Receipt
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    sx={{ borderRadius: 2 }}
                  >
                    Print Details
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                mt: 3,
                background: alpha(theme.palette.info.light, 0.1),
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  📋 Important Notes
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="div"
                >
                  • Please arrive 15 minutes before your appointment time
                  <br />
                  • Bring your previous medical records if any
                  <br />
                  • Carry a valid ID proof
                  <br />• Contact the clinic for any emergency changes
                </Typography>
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>
      </Container>

      <DeleteConfirmDialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, appointment: null })}
        onConfirm={handleCancelConfirm}
        title="Cancel Appointment"
        question={"Are you sure you want to cancel this appointment?"}
        loading={cancelLoading}
        confirmAsync={true}
      />
    </Box>
  );
};

export default AppointmentDetail;
