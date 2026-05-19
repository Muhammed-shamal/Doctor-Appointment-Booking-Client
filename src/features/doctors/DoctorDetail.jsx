import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  Stack,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ButtonGroup,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { getDoctorById } from "./doctorThunks";
import { getDoctorSchedules } from "../schedules/scheduleThunks";
import {
  clearAppointmentError,
  clearAppointmentSuccess,
} from "../appointments/appointmentSlice";

import MBackButton from "../../components/Buttons/MBackButton";
import MButton from "../../components/Buttons/MBtn";
import { bookAppointment } from "../appointments/appointmentThunks";
import AppointmentBooking from "../../components/Modal/Hospital/AppointmentBooking";
import { socket } from "../../api/axiosInstance";
import { can } from "../../utils/permissions";
import { markSlotAvailable, markSlotBooked } from "../schedules/scheduleSlice";

const DoctorDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { user } = useSelector((state) => state.auth);
  const doctorState = useSelector((state) => state.doctor);
  const doctor = doctorState.selectedDoctor;
  const doctorLoading = doctorState.loading;

  const scheduleState = useSelector((state) => state.schedule);
  const schedules = scheduleState.schedules;
  const scheduleLoading = scheduleState.loading;

  const appointmentState = useSelector((state) => state.appointment);
  const bookingLoading = appointmentState.loading;
  const bookingError = appointmentState.error;
  const bookingSuccess = appointmentState.success;

  // Booking modal state
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStep, setBookingStep] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(getDoctorById(id));
      dispatch(getDoctorSchedules(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "slotBooked",

      ({ scheduleId, slotId }) => {
        dispatch(
          markSlotBooked({
            scheduleId,
            slotId,
          }),
        );
      },
    );

    socket.on(
      "slotAvailable",

      ({ scheduleId, slotId }) => {
        dispatch(
          markSlotAvailable({
            scheduleId,
            slotId,
          }),
        );
      },
    );

    return () => {
      socket.off("slotBooked");

      socket.off("slotAvailable");
    };
  }, [socket]);

  useEffect(() => {
    if (bookingSuccess) {
      setOpenBookingModal(false);
      setSelectedDate(null);
      setSelectedSlot(null);
      setBookingStep(0);
      const timer = setTimeout(() => {
        dispatch(clearAppointmentSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingSuccess, dispatch]);

  useEffect(() => {
    if (bookingError) {
      const timer = setTimeout(() => {
        dispatch(clearAppointmentError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingError, dispatch]);

  const handleBookAppointment = () => {
    setOpenBookingModal(true);
    setBookingStep(0);
  };

  const handleSelectDate = (schedule) => {
    setSelectedDate(schedule);
    setBookingStep(1);
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setBookingStep(2);
  };

  const handleConfirmBooking = async () => {
    try {
      if (!selectedDate || !selectedSlot) return;

      const appointmentData = {
        scheduleId: selectedDate._id,
        slotId: selectedSlot._id,
        doctorId: id,
      };

      dispatch(bookAppointment(appointmentData)).unwrap();
      // navigate("/appointments/list");
      window.location.href = "/appointments/list";
    } catch (error) {
      console.error("failed to book an appointment");
    }
  };

  const handleCloseModal = () => {
    setOpenBookingModal(false);
    setSelectedDate(null);
    setSelectedSlot(null);
    setBookingStep(0);
  };

  const getAvailableDates = () => {
    return schedules.filter((schedule) => {
      const availableSlots = schedule.slots?.filter((slot) => !slot.isBooked);
      return availableSlots && availableSlots.length > 0;
    });
  };

  const getAvailableSlotsForDate = () => {
    if (!selectedDate) return [];
    return selectedDate.slots?.filter((slot) => !slot.isBooked) || [];
  };

  const loading = doctorLoading;

  const handleBack = () => {
    navigate(-1);
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

  if (!doctor) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Doctor not found
        </Alert>
      </Container>
    );
  }

  const availableDates = getAvailableDates();
  const availableSlots = getAvailableSlotsForDate();

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
        {/* Back Button */}

        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <MBackButton fallback="/doctors/list" label="Back to Doctors" />
          {id && loading && (
            <Typography variant="body2" color="primary" sx={{ ml: 2 }}>
              Loading doctor details...
            </Typography>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Main Profile Section */}
          <Grid item xs={12} lg={8}>
            {/* Header Section */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                src={undefined}
                onError={() => setImageError(true)}
                sx={{
                  width: 100,
                  height: 100,
                  mr: 3,
                  bgcolor: theme.palette.primary.main,
                  fontSize: 40,
                  fontWeight: 600,
                  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                {doctor.fname?.charAt(0)}
                {doctor.lname?.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Doctor Name + Status */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="700"
                    sx={{
                      fontSize: {
                        xs: "1.5rem",
                        sm: "2rem",
                        md: "2.3rem",
                      },
                      wordBreak: "break-word",
                      lineHeight: 1.2,
                    }}
                  >
                    Dr. {doctor.fname} {doctor.lname}
                  </Typography>

                  {doctor.isActive && (
                    <Tooltip title="Available for consultation">
                      <Chip
                        icon={<VerifiedIcon />}
                        label="Active"
                        size="small"
                        color="success"
                        sx={{
                          width: "fit-content",
                          fontWeight: 500,
                        }}
                      />
                    </Tooltip>
                  )}
                </Box>

                {/* Specialization */}
                <Typography
                  variant="h6"
                  color="primary"
                  gutterBottom
                  fontWeight="500"
                  sx={{
                    fontSize: {
                      xs: "1rem",
                      sm: "1.15rem",
                      md: "1.25rem",
                    },
                  }}
                >
                  {doctor.specialization}
                </Typography>

                {/* Rating */}
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Rating
                    value={4.5}
                    precision={0.5}
                    readOnly
                    size="small"
                    icon={<StarIcon fontSize="inherit" />}
                  />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "0.8rem",
                        sm: "0.9rem",
                      },
                    }}
                  >
                    (128 reviews)
                  </Typography>
                </Stack>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Bio Section */}
            {doctor.bio && (
              <>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  About
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {doctor.bio}
                </Typography>
                <Divider sx={{ my: 3 }} />
              </>
            )}

            {/* Qualifications & Experience */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card
                  elevation={0}
                  sx={{
                    background: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <SchoolIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="600">
                        Qualifications
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.qualifications}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  elevation={0}
                  sx={{
                    background: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <WorkIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="600">
                        Experience
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.experience} years of experience
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Clinic Information */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mt: 2,
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Clinic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <BusinessIcon color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Clinic Name
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {doctor.clinic_name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <LocationIcon color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Clinic Address
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {doctor.clinic_address}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Sidebar - Contact & Booking */}
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 3,
                position: "sticky",
                top: 20,
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={3}>
                Consultation Info
              </Typography>

              {/* Fee */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "white",
                  mb: 3,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2">Consultation Fee</Typography>

                <Typography variant="h4" fontWeight={700}>
                  ₹{doctor.consultationFee}
                </Typography>
              </Box>

              {/* Contact */}
              <Typography variant="subtitle2" fontWeight={600} mb={2}>
                Contact
              </Typography>

              {doctor.phone && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PhoneIcon color="primary" sx={{ mr: 1.5, fontSize: 20 }} />

                  <Typography variant="body2">{doctor.phone}</Typography>
                </Box>
              )}

              {doctor.email && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <EmailIcon color="primary" sx={{ mr: 1.5, fontSize: 20 }} />

                  <Typography variant="body2">{doctor.email}</Typography>
                </Box>
              )}

              {/* Buttons */}
              <Stack spacing={2}>
                {can(user.role, "appointments", "create") && (
                  <MButton
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={handleBookAppointment}
                    label="Book Appointment"
                  />
                )}

                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  startIcon={<ScheduleIcon />}
                  onClick={() => setOpenBookingModal(true)}
                >
                  View Timings
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Booking Modal */}
        <AppointmentBooking
          availableDates={availableDates}
          availableSlots={availableSlots}
          bookingStep={bookingStep}
          bookingLoading={bookingLoading}
          doctor={doctor}
          openBookingModal={openBookingModal}
          scheduleLoading={scheduleLoading}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          theme={theme}
          setBookingStep={setBookingStep}
          handleCloseModal={handleCloseModal}
          handleConfirmBooking={handleConfirmBooking}
          handleSelectDate={handleSelectDate}
          handleSelectSlot={handleSelectSlot}
        />
      </Container>
    </Box>
  );
};

export default DoctorDetail;
