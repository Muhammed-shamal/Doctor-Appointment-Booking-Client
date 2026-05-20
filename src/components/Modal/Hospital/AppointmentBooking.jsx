import React from "react";
import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { formatDate } from "../../../common/commonFunction";

function AppointmentBooking({
  openBookingModal,
  theme,
  doctor,
  bookingStep,
  scheduleLoading,
  availableDates,
  selectedDate,
  selectedSlot,
  availableSlots,
  setBookingStep,
  bookingLoading,

  handleCloseModal,
  handleSelectDate,
  handleConfirmBooking,
  handleSelectSlot
}) {
  if (!doctor) return null;
  return (
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
                        {schedule.slots?.filter((s) => !s.isBooked).length}{" "}
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
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
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
                  <Grid size={{ xs: 6, sm: 6 }} key={slot._id}>
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
                border: `2px dashed ${alpha(theme.palette.success.main, 0.3)}`,
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
  );
}

export default AppointmentBooking;
