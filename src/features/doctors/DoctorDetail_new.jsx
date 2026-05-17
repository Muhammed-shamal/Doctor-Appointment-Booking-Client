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
import { bookAppointment, clearAppointmentError, clearAppointmentSuccess } from "../appointments/appointmentSlice";

import MBackButton from "../../components/Buttons/MBackButton";
import MButton from "../../components/Buttons/MBtn";

const DoctorDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

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
    if (!selectedDate || !selectedSlot) return;

    const appointmentData = {
      scheduleId: selectedDate._id,
      slotId: selectedSlot._id,
      doctorId: id,
    };

    dispatch(bookAppointment(appointmentData));
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="h4" component="h1" fontWeight="700">
                    Dr. {doctor.fname} {doctor.lname}
                  </Typography>
                  {doctor.isActive && (
                    <Tooltip title="Available for consultation">
                      <Chip
                        icon={<VerifiedIcon />}
                        label="Active"
                        size="small"
                        color="success"
                        sx={{ ml: 2 }}
                      />
                    </Tooltip>
                  )}
                </Box>
                <Typography
                  variant="h6"
                  color="primary"
                  gutterBottom
                  fontWeight="500"
                >
                  {doctor.specialization}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating
                    value={4.5}
                    precision={0.5}
                    readOnly
                    size="small"
                    icon={<StarIcon fontSize="inherit" />}
                  />
                  <Typography variant="body2" color="text.secondary">
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
                <MButton
                  fullWidth
                  variant="contained"
                  size="small"
                  onClick={handleBookAppointment}
                  label="Book Appointment"
                />

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
        <Dialog
          open={openBookingModal}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: alpha(theme.palette.background.paper, 0.95),
            },
          }}
        >
          <DialogTitle sx={{ pb: 2 }}>
            <Typography variant="h6" fontWeight="700">
              Book Appointment with Dr. {doctor.fname} {doctor.lname}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Step {bookingStep + 1} of 3
            </Typography>
          </DialogTitle>

          <DialogContent dividers>
            {/* Progress Stepper */}
            <Stepper activeStep={bookingStep} sx={{ mb: 3 }}>
              <Step>
                <StepLabel>Select Date</StepLabel>
              </Step>
              <Step>
                <StepLabel>Select Slot</StepLabel>
              </Step>
              <Step>
                <StepLabel>Confirm</StepLabel>
              </Step>
            </Stepper>

            {/* Alerts */}
            {bookingError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {bookingError}
              </Alert>
            )}

            {bookingSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Appointment booked successfully!
              </Alert>
            )}

            {/* Step 1: Select Date */}
            {bookingStep === 0 && (
              <Box>
                <Typography variant="subtitle2" fontWeight="600" mb={2}>
                  Available Dates
                </Typography>
                {scheduleLoading ? (
                  <Box sx={{ textAlign: "center", py: 3 }}>
                    <CircularProgress size={30} />
                  </Box>
                ) : availableDates.length === 0 ? (
                  <Alert severity="info">
                    No available dates. Please try again later.
                  </Alert>
                ) : (
                  <Stack spacing={1}>
                    {availableDates.map((schedule) => (
                      <Button
                        key={schedule._id}
                        onClick={() => handleSelectDate(schedule)}
                        variant="outlined"
                        sx={{
                          p: 2,
                          textAlign: "left",
                          justifyContent: "space-between",
                          border: `2px solid ${
                            selectedDate?._id === schedule._id
                              ? theme.palette.primary.main
                              : theme.palette.divider
                          }`,
                          backgroundColor:
                            selectedDate?._id === schedule._id
                              ? alpha(theme.palette.primary.main, 0.1)
                              : "transparent",
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            {formatDate(schedule.date)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {
                              schedule.slots?.filter((s) => !s.isBooked)
                                .length
                            }{" "}
                            slots available
                          </Typography>
                        </Box>
                        {selectedDate?._id === schedule._id && (
                          <CheckCircleIcon color="success" />
                        )}
                      </Button>
                    ))}
                  </Stack>
                )}
              </Box>
            )}

            {/* Step 2: Select Slot */}
            {bookingStep === 1 && selectedDate && (
              <Box>
                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.2,
                    )}`,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Selected Date
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {formatDate(selectedDate.date)}
                  </Typography>
                </Box>

                <Typography variant="subtitle2" fontWeight="600" mb={2}>
                  Available Slots ({availableSlots.length})
                </Typography>

                {availableSlots.length === 0 ? (
                  <Alert severity="info">No available slots for this date.</Alert>
                ) : (
                  <Grid container spacing={1}>
                    {availableSlots.map((slot) => (
                      <Grid item xs={6} sm={4} key={slot._id}>
                        <Button
                          fullWidth
                          onClick={() => handleSelectSlot(slot)}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            border: `2px solid ${
                              selectedSlot?._id === slot._id
                                ? theme.palette.primary.main
                                : theme.palette.divider
                            }`,
                            backgroundColor:
                              selectedSlot?._id === slot._id
                                ? alpha(theme.palette.primary.main, 0.1)
                                : "transparent",
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {slot.startTime}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {slot.endTime}
                            </Typography>
                          </Box>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* Step 3: Confirm Booking */}
            {bookingStep === 2 && selectedDate && selectedSlot && (
              <Box>
                <Card
                  sx={{
                    background: alpha(theme.palette.success.main, 0.05),
                    border: `2px dashed ${alpha(
                      theme.palette.success.main,
                      0.3,
                    )}`,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      fontWeight="600"
                      mb={2}
                      display="flex"
                      alignItems="center"
                    >
                      <CheckCircleIcon
                        sx={{ mr: 1, color: "success.main" }}
                        fontSize="small"
                      />
                      Booking Summary
                    </Typography>

                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Doctor
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          Dr. {doctor.fname} {doctor.lname}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Specialization
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {doctor.specialization}
                        </Typography>
                      </Box>

                      <Divider />

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Date & Time
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {formatDate(selectedDate.date)}
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {selectedSlot.startTime} - {selectedSlot.endTime}
                        </Typography>
                      </Box>

                      <Divider />

                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Consultation Fee
                        </Typography>
                        <Typography variant="h6" fontWeight="700">
                          ₹{doctor.consultationFee}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2, gap: 1 }}>
            {bookingStep === 0 ? (
              <>
                <Button onClick={handleCloseModal} variant="outlined">
                  Cancel
                </Button>
                <Button
                  onClick={() => setBookingStep(1)}
                  variant="contained"
                  disabled={!selectedDate}
                >
                  Next
                </Button>
              </>
            ) : bookingStep === 1 ? (
              <>
                <Button onClick={() => setBookingStep(0)} variant="outlined">
                  Back
                </Button>
                <Button
                  onClick={() => setBookingStep(2)}
                  variant="contained"
                  disabled={!selectedSlot}
                >
                  Next
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setBookingStep(1)} variant="outlined">
                  Back
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  variant="contained"
                  disabled={bookingLoading}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                  }}
                >
                  {bookingLoading ? (
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default DoctorDetail;
