import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Stack,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import MTextField from "../../components/TextBox/MTextField";
import MSelect from "../../components/SelectField/MSelect";
import MButton from "../../components/Buttons/MBtn";
import MBackButton from "../../components/Buttons/MBackButton";
import Header from "../../components/Header.jsx";
import { getDoctors } from "../doctors/doctorThunks";
import {
  createSchedule,
  getScheduleById,
  updateSchedule,
} from "./scheduleThunks";

export default function ScheduleForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams();

  const doctorState = useSelector((state) => state.doctor);
  const doctors = doctorState.doctors;
  const loadingDoctors = doctorState.loading;

  const scheduleState = useSelector((state) => state.schedule);
  const selectedSchedule = scheduleState.selectedSchedule;
  const loading = scheduleState.loading;

  const { handleSubmit, reset, control, watch } = useForm({
    defaultValues: {
      doctor: "",
      date: "",
      startTime: "09:00",
      endTime: "17:00",
      slotDuration: 15,
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getScheduleById(id));
    } else {
      reset();
    }
  }, [id, dispatch, reset]);

  useEffect(() => {
    if (!doctors || doctors.length === 0) {
      dispatch(getDoctors());
    }
  }, [dispatch]);

  useEffect(() => {
    if (id && selectedSchedule && selectedSchedule._id === id) {
      
      reset({
        doctor: selectedSchedule.doctor,
        date: selectedSchedule.date?.split("T")[0],
        endTime: selectedSchedule.endTime,
        slotDuration: selectedSchedule.slotDuration,
        startTime: selectedSchedule.startTime,
      });
    }
  }, [selectedSchedule, id, reset]);

  const onSubmit = async (data) => {
    try {
      
      if (id) {
        await dispatch(
          updateSchedule({ scheduleId: id, scheduleData: data }),
        ).unwrap();
      } else {
        await dispatch(createSchedule(data)).unwrap();
      }
      navigate("/schedules/list");
    } catch (err) {
      console.error("Failed to save schedule", err);
    }
  };

  const doctorOptions = doctors.map((d) => ({
    label: `${d.fname || ""} ${d.lname || ""}`.trim(),
    value: d._id,
  }));

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <MBackButton fallback="/schedules" label="Back to Schedules" />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Header
          title={id ? "Update Schedule" : "Create Schedule"}
          subtitle="Define available slots for a doctor on a specific date"
          action={
            <Box sx={{ display: "flex", gap: 1 }}>
              <MButton
                type="submit"
                label={id ? "Update Schedule" : "Create Schedule"}
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
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
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
                  Schedule Details
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <MSelect
                    label="Doctor"
                    name="doctor"
                    control={control}
                    options={doctorOptions}
                    rules={{ required: "Doctor is required" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <MTextField
                    label="Date"
                    name="date"
                    type="date"
                    control={control}
                    rules={{ required: "Date is required" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <MTextField
                    label="Start Time"
                    name="startTime"
                    type="time"
                    control={control}
                    rules={{ required: "Start time is required" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <MTextField
                    label="End Time"
                    name="endTime"
                    type="time"
                    control={control}
                    rules={{ required: "End time is required" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <MTextField
                    label="Slot Duration (minutes)"
                    name="slotDuration"
                    type="number"
                    control={control}
                    rules={{ required: "Slot duration is required", min: 1 }}
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
        </Stack>
      </form>
    </>
  );
}
