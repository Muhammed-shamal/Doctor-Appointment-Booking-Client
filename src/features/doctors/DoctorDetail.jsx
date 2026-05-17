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
} from "@mui/icons-material";
import { getDoctorById } from "./doctorThunks";

import MBackButton from "../../components/Buttons/MBackButton";
import MButton from "../../components/Buttons/MBtn";

const DoctorDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const doctorState = useSelector((state) => state.doctor);
  const doctor = doctorState.selectedDoctor;
  const loading = doctorState.loading;

  // const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getDoctorById(id));
    }
  }, [dispatch, id]);

  const handleBookAppointment = () => {
    navigate(`/appointments/list`);
  };

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
                mt:2,
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

                <MButton
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="View Timings"
                />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DoctorDetail;
