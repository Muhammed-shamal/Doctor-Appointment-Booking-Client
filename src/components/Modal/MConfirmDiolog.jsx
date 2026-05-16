import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded"; // Optional icon

const MConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  question,
  actionText1 = "Cancel",
  actionText2 = "Confirm",
  optionText,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          px: 3,
          py: 2,
          backgroundColor: "background.paper",
          boxShadow: "none",
          border: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <WarningAmberRoundedIcon
            sx={{ fontSize: 36, color: "warning.main", mb: 1 }}
          />
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", pt: 1 }}>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {question}
        </Typography>
        {optionText && (
          <Typography
            variant="caption"
            color="error.main"
            fontWeight={500}
          >
            {optionText}
          </Typography>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 1.5,
          pt: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{
            minWidth: 110,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          {actionText1}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{
            minWidth: 120,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          {actionText2}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export default MConfirmDialog;
