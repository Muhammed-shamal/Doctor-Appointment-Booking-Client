import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const appointmentStatuses = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

export const UpdateStatusDialog = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  appointment,
}) => {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (appointment?.status) {
      setStatus(appointment.status);
    }
  }, [appointment]);

  const handleSubmit = () => {
    onConfirm(status);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Update Appointment Status</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Change the appointment status.
          </Typography>

          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>

            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              {appointmentStatuses.map((item) => (
                <MenuItem key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          color="inherit"
          size="small"
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          size="small"
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};