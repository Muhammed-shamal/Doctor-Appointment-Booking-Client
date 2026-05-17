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

const DoctorDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    selectedDoctor: doctor,
    loading,
    error,
  } = useSelector((state) => state.doctors);

  const [imageError, setImageError] = useState(false);

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
                src={
                  !imageError && doctor.profileImage
                    ? doctor.profileImage
                    : undefined
                }
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
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: "blur(10px)",
                position: "sticky",
                top: 20,
              }}
            >
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Consultation Info
              </Typography>

              <Card
                elevation={0}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  borderRadius: 3,
                  mb: 3,
                  color: "white",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <MoneyIcon sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Consultation Fee
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="700">
                    ₹{doctor.consultationFee}
                  </Typography>
                </CardContent>
              </Card>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                Contact Information
              </Typography>

              {doctor.phone && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PhoneIcon color="primary" sx={{ mr: 2, fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {doctor.phone}
                    </Typography>
                  </Box>
                </Box>
              )}

              {doctor.email && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <EmailIcon color="primary" sx={{ mr: 2, fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {doctor.email}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleBookAppointment}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                Book Appointment
              </Button>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                View Timings
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DoctorDetail;
