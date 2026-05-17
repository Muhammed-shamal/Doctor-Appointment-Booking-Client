import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Stack,
  Switch,
  FormControlLabel,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  InputAdornment,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import MTextField from "../../components/TextBox/MTextField";
import MTextArea from "../../components/TextBox/MTextArea";
import MSelect from "../../components/SelectField/MSelect";
import MButton from "../../components/Buttons/MBtn";
import MBackButton from "../../components/Buttons/MBackButton";
import Header from "../../components/Header.jsx";
import { getDoctorById, createDoctor, updateDoctor } from "./doctorThunks";
import { clearDoctorError, resetSelectedDoctor } from "./doctorSlice";

export default function DoctorForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams();

  const doctorState = useSelector((state) => state.doctor || {});
  const selectedDoctor = doctorState.selectedDoctor;
  const loading = doctorState.loading || false;
  const error = doctorState.error;

  const { handleSubmit, reset, control, watch } = useForm({
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      bio: "",
      qualifications: "",
      clinic_name: "",
      clinic_address: "",
      consultationFee: "",
      is_active: true,
    },
  });

  const isActive = watch("is_active");

  // Specialization options
  const specializationOptions = [
    { label: "General Practice", value: "general_practice" },
    { label: "Cardiology", value: "cardiology" },
    { label: "Dermatology", value: "dermatology" },
    { label: "Neurology", value: "neurology" },
    { label: "Orthopedics", value: "orthopedics" },
    { label: "Pediatrics", value: "pediatrics" },
    { label: "Psychiatry", value: "psychiatry" },
    { label: "Ophthalmology", value: "ophthalmology" },
    { label: "ENT", value: "ent" },
    { label: "Gastroenterology", value: "gastroenterology" },
  ];

  useEffect(() => {
    if (id) {
      dispatch(getDoctorById(id));
    } else {
      reset();
      dispatch(resetSelectedDoctor());
    }
  }, [id, dispatch, reset]);

  useEffect(() => {
    if (id && selectedDoctor && selectedDoctor._id === id) {
      reset({
        fname: selectedDoctor.fname || "",
        lname: selectedDoctor.lname || "",
        email: selectedDoctor.email || "",
        phone: selectedDoctor.phone || "",
        specialization: selectedDoctor.specialization || "",
        experience: selectedDoctor.experience || "",
        bio: selectedDoctor.bio || "",
        qualifications: selectedDoctor.qualifications || "",
        clinic_name: selectedDoctor.clinic_name || "",
        clinic_address: selectedDoctor.clinic_address || "",
        consultationFee: selectedDoctor.consultationFee || "",
        is_active: selectedDoctor.is_active !== false,
      });
    }
  }, [selectedDoctor, id, reset]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await dispatch(
          updateDoctor({ doctorId: id, doctorData: data }),
        ).unwrap();
      } else {
        await dispatch(createDoctor(data)).unwrap();
      }
      navigate("/doctors");
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <MBackButton fallback="/doctors/list" label="Back to Doctors" />
        {id && loading && (
          <Typography variant="body2" color="primary" sx={{ ml: 2 }}>
            Loading doctor details...
          </Typography>
        )}
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Header
          title={id ? "Edit Doctor" : "Add New Doctor"}
          subtitle={
            id
              ? `Editing: ${selectedDoctor?.fname || ""} ${
                  selectedDoctor?.lname || ""
                }`
              : "Add a new doctor to the system"
          }
          action={
            <Box sx={{ display: "flex", gap: 1 }}>
              {/* <MButton
                label="Cancel"
                onClick={() => navigate("/doctors")}
                variant="outlined"
                color="primary"
                size="small"
              /> */}

              <MButton
                type="submit"
                label={id ? "Update Doctor" : "Create Doctor"}
                loading={loading}
                size="small"
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  fontSize: "0.79rem",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: theme.palette.background.paper,
                  },
                }}
              />
            </Box>
          }
        />

        <Stack spacing={3}>
          {/* Basic Information Section */}
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              transition: "box-shadow 0.2s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: "4px",
                    height: "24px",
                    bgcolor: "primary.main",
                    borderRadius: "2px",
                    mr: 1.5,
                  }}
                />
                <Typography variant="h6" fontWeight={700} color="primary.dark">
                  Basic Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <MTextField
                    label="First Name"
                    name="fname"
                    control={control}
                    rules={{ required: "First name is required" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <MTextField
                    label="Last Name"
                    name="lname"
                    control={control}
                    rules={{ required: "Last name is required" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <MTextField
                    label="Email Address"
                    name="email"
                    type="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <MTextField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    control={control}
                    rules={{
                      required: "Phone is required",
                      minLength: {
                        value: 10,
                        message: "Phone must be at least 10 digits",
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Professional Information Section */}
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              transition: "box-shadow 0.2s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: "4px",
                    height: "24px",
                    bgcolor: "primary.main",
                    borderRadius: "2px",
                    mr: 1.5,
                  }}
                />
                <Typography variant="h6" fontWeight={700} color="primary.dark">
                  Professional Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <MSelect
                    label="Specialization"
                    name="specialization"
                    control={control}
                    options={specializationOptions}
                    rules={{ required: "Specialization is required" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <MTextField
                    label="Years of Experience"
                    name="experience"
                    type="number"
                    control={control}
                    rules={{
                      required: "Experience is required",
                      min: {
                        value: 0,
                        message: "Experience cannot be negative",
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <MTextField
                    label="Qualifications"
                    name="qualifications"
                    control={control}
                    rules={{ required: "Qualifications are required" }}
                    description={{
                      text: "e.g., MBBS, MD, or other medical degrees",
                      align: "Bottom",
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12}}>
                  <MTextArea
                    label="Bio"
                    name="bio"
                    control={control}
                    rules={{ required: "Bio is required" }}
                    rows={4}
                    description={{
                      text: "Brief biography about the doctor",
                      align: "Bottom",
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Clinic Information Section */}
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              transition: "box-shadow 0.2s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: "4px",
                    height: "24px",
                    bgcolor: "primary.main",
                    borderRadius: "2px",
                    mr: 1.5,
                  }}
                />
                <Typography variant="h6" fontWeight={700} color="primary.dark">
                  Clinic Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <MTextField
                    label="Clinic Name"
                    name="clinic_name"
                    control={control}
                    rules={{ required: "Clinic name is required" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <MTextField
                    label="Consultation Fee"
                    name="consultationFee"
                    type="number"
                    control={control}
                    rules={{
                      required: "Consultation fee is required",
                      min: {
                        value: 0,
                        message: "Fee cannot be negative",
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12}}>
                  <MTextArea
                    label="Clinic Address"
                    name="clinic_address"
                    control={control}
                    rules={{ required: "Clinic address is required" }}
                    rows={3}
                    description={{
                      text: "Full address of the clinic",
                      align: "Bottom",
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Status Section */}
          <Card
            elevation={0}
            sx={{
              border: `2px solid ${
                isActive ? theme.palette.success.main : theme.palette.error.main
              }`,
              borderRadius: "16px",
              backgroundColor: isActive
                ? "rgba(71, 160, 101, 0.04)"
                : "rgba(239, 68, 68, 0.04)",
              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <FormControlLabel
                control={
                  <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        color="success"
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: theme.palette.success.main,
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: theme.palette.success.main,
                            },
                        }}
                      />
                    )}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Doctor Status
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {isActive
                        ? "✓ Active - Doctor is visible and available for bookings"
                        : "✗ Inactive - Doctor is hidden from patients"}
                    </Typography>
                  </Box>
                }
                labelPlacement="end"
                sx={{
                  width: "100%",
                  m: 0,
                  justifyContent: "space-between",
                  flexDirection: "row-reverse",
                }}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {/* <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              mt: 2,
              pb: 4,
            }}
          >
            <MButton
              label="Cancel"
              onClick={() => navigate("/doctors")}
              variant="outlined"
              color="primary"
              sx={{
                px: 4,
                py: 1.25,
                borderRadius: "12px",
                fontSize: "0.875rem",
                fontWeight: 600,
                borderWidth: "2px",
                "&:hover": {
                  borderWidth: "2px",
                  backgroundColor: "rgba(0,0,0,0.02)",
                },
              }}
            />
            <MButton
              type="submit"
              label={id ? "Update Doctor" : "Create Doctor"}
              loading={loading}
              sx={{
                px: 4,
                py: 1.25,
                borderRadius: "12px",
                fontSize: "0.875rem",
                fontWeight: 600,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                },
                transition: "all 0.2s ease",
              }}
            />
          </Box> */}
        </Stack>
      </form>
    </>
  );
}
