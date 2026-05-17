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
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      bio: "",
      qualifications: "",
      clinic_name: "",
      clinic_address: "",
      consultation_fee: "",
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
        firstName: selectedDoctor.firstName || "",
        lastName: selectedDoctor.lastName || "",
        email: selectedDoctor.email || "",
        phone: selectedDoctor.phone || "",
        specialization: selectedDoctor.specialization || "",
        experience: selectedDoctor.experience || "",
        bio: selectedDoctor.bio || "",
        qualifications: selectedDoctor.qualifications || "",
        clinic_name: selectedDoctor.clinic_name || "",
        clinic_address: selectedDoctor.clinic_address || "",
        consultation_fee: selectedDoctor.consultation_fee || "",
        is_active: selectedDoctor.is_active !== false,
      });
    }
  }, [selectedDoctor, id, reset]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await dispatch(updateDoctor({ doctorId: id, doctorData: data })).unwrap();
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
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <MBackButton fallback="/doctors" label="Back to Doctors" />
        {id && loading && (
          <Typography variant="body2" color="primary" sx={{ ml: 2 }}>
            Loading doctor details...
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Header
          title={id ? "Edit Doctor" : "Add New Doctor"}
          subtitle={
            id
              ? `Editing: ${selectedDoctor?.firstName || ""} ${
                  selectedDoctor?.lastName || ""
                }`
              : "Add a new doctor to the system"
          }
          action={
            <MButton
              type="submit"
              label={id ? "Update Doctor" : "Create Doctor"}
              loading={loading}
              sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                fontWeight: 600,
                fontSize: "0.79rem",
                px: 3,
                py: 1,
                "&:hover": { backgroundColor: theme.palette.background.paper },
              }}
            />
          }
        />

        <Stack spacing={3}>
          {/* Basic Information Section */}
          <Card
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 2 }}
                color="primary"
              >
                Basic Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <MTextField
                    label="First Name"
                    name="firstName"
                    control={control}
                    rules={{ required: "First name is required" }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MTextField
                    label="Last Name"
                    name="lastName"
                    control={control}
                    rules={{ required: "Last name is required" }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MTextField
                    label="Email"
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
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MTextField
                    label="Phone"
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
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Professional Information Section */}
          <Card
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 2 }}
                color="primary"
              >
                Professional Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <MSelect
                    label="Specialization"
                    name="specialization"
                    control={control}
                    options={specializationOptions}
                    rules={{ required: "Specialization is required" }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
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
                  />
                </Grid>

                <Grid item xs={12}>
                  <MTextField
                    label="Qualifications"
                    name="qualifications"
                    control={control}
                    rules={{ required: "Qualifications are required" }}
                    description={{
                      text: "e.g., MBBS, MD, or other medical degrees",
                      align: "Bottom",
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
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
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Clinic Information Section */}
          <Card
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 2 }}
                color="primary"
              >
                Clinic Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <MTextField
                    label="Clinic Name"
                    name="clinic_name"
                    control={control}
                    rules={{ required: "Clinic name is required" }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MTextField
                    label="Consultation Fee"
                    name="consultation_fee"
                    type="number"
                    control={control}
                    rules={{
                      required: "Consultation fee is required",
                      min: {
                        value: 0,
                        message: "Fee cannot be negative",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
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
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Status Section */}
          <Card
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              backgroundColor: isActive
                ? "rgba(71, 160, 101, 0.05)"
                : "rgba(239, 68, 68, 0.05)",
              transition: "background-color 0.3s ease",
            }}
          >
            <CardContent>
              <FormControlLabel
                control={
                  <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        color="primary"
                      />
                    )}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Doctor Status
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {isActive
                        ? "✓ Doctor is active and available for bookings"
                        : "✗ Doctor is inactive and hidden from patients"}
                    </Typography>
                  </Box>
                }
                labelPlacement="start"
                sx={{ width: "100%" }}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}>
            <MButton
              label="Cancel"
              onClick={() => navigate("/doctors")}
              variant="outlined"
              color="primary"
              sx={{
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
              }}
            />
            <MButton
              type="submit"
              label={id ? "Update Doctor" : "Create Doctor"}
              loading={loading}
            />
          </Box>
        </Stack>
      </form>
    </>
  );
}
