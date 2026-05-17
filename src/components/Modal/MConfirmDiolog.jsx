import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Zoom,
  Slide,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import LogoutIcon from "@mui/icons-material/Logout";
import BlockIcon from "@mui/icons-material/Block";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Transition component for smoother appearance
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const MConfirmDialog = ({
  // Core props
  open,
  onClose,
  onConfirm,
  title,
  question,
  
  // Button text
  cancelText = "Cancel",
  confirmText = "Confirm",
  optionText,
  
  // Variants and styling
  variant = "warning", // 'warning', 'danger', 'info', 'success'
  confirmButtonColor = "error", // 'primary', 'secondary', 'error', 'info', 'success', 'warning'
  confirmButtonVariant = "contained",
  cancelButtonVariant = "outlined",
  
  // Sizes
  maxWidth = "xs", // 'xs', 'sm', 'md'
  fullWidth = true,
  
  // Loading state
  loading = false,
  loadingText = "Processing...",
  
  // Additional content
  additionalContent = null,
  
  // Icons
  icon: CustomIcon,
  iconColor,
  
  // Callbacks
  onCancel,
  onConfirmSuccess,
  onConfirmError,
  
  // Auto close after confirm
  autoCloseOnConfirm = true,
  
  // Disable buttons
  disableCancel = false,
  disableConfirm = false,
  
  // Show close button
  showCloseButton = true,
  
  // Custom styles
  dialogPaperProps = {},
  titleSx = {},
  contentSx = {},
  actionsSx = {},
  
  // Confirmation async handling
  confirmAsync = false,
  
  // Analytics tracking
  trackConfirm = null,
  trackCancel = null,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const isProcessing = loading || localLoading;
  
  // Variant configurations
  const variantConfig = {
    warning: {
      icon: WarningAmberRoundedIcon,
      color: "warning.main",
      bgColor: "warning.lighter",
      confirmColor: "warning",
    },
    danger: {
      icon: DeleteSweepIcon,
      color: "error.main",
      bgColor: "error.lighter",
      confirmColor: "error",
    },
    info: {
      icon: InfoIcon,
      color: "info.main",
      bgColor: "info.lighter",
      confirmColor: "info",
    },
    success: {
      icon: CheckCircleIcon,
      color: "success.main",
      bgColor: "success.lighter",
      confirmColor: "success",
    },
    logout: {
      icon: LogoutIcon,
      color: "error.main",
      bgColor: "error.lighter",
      confirmColor: "error",
    },
  };
  
  const Icon = CustomIcon || variantConfig[variant]?.icon || WarningAmberRoundedIcon;
  const iconColorValue = iconColor || variantConfig[variant]?.color || "warning.main";
  
  const handleConfirm = async () => {
    if (isProcessing) return;
    
    // Track analytics
    if (trackConfirm) {
      trackConfirm();
    }
    
    try {
      if (confirmAsync) {
        setLocalLoading(true);
        setError(null);
        await onConfirm();
        if (onConfirmSuccess) onConfirmSuccess();
        if (autoCloseOnConfirm) onClose();
      } else {
        onConfirm();
        if (autoCloseOnConfirm) onClose();
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      if (onConfirmError) onConfirmError(err);
    } finally {
      if (confirmAsync) {
        setLocalLoading(false);
      }
    }
  };
  
  const handleCancel = () => {
    if (isProcessing) return;
    
    if (trackCancel) {
      trackCancel();
    }
    
    if (onCancel) onCancel();
    onClose();
  };
  
  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      TransitionProps={{ timeout: 300 }}
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          backgroundColor: "background.paper",
          boxShadow: theme.shadows[24],
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          ...dialogPaperProps,
        },
      }}
    >
      {/* Header with close button */}
      <DialogTitle sx={{ textAlign: "center", pb: 0, position: "relative", ...titleSx }}>
        {showCloseButton && (
          <IconButton
            onClick={handleClose}
            disabled={isProcessing}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "text.secondary",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        
        <Box display="flex" flexDirection="column" alignItems="center">
          <Zoom in={open}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: "50%",
                bgcolor: `${iconColorValue}10`,
                mb: 1.5,
              }}
            >
              <Icon sx={{ fontSize: 44, color: iconColorValue }} />
            </Box>
          </Zoom>
          
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: "center", pt: 2, pb: 1, ...contentSx }}>
        <Typography variant="body1" color="text.primary" mb={1}>
          {question}
        </Typography>
        
        {optionText && (
          <Alert
            severity="warning"
            icon={<WarningAmberRoundedIcon />}
            sx={{
              mt: 2,
              mb: 1,
              "& .MuiAlert-message": {
                fontSize: "0.75rem",
                fontWeight: 500,
              },
            }}
          >
            {optionText}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
            {error}
          </Alert>
        )}
        
        {additionalContent && (
          <Box sx={{ mt: 2 }}>
            {additionalContent}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions
        sx={{
          justifyContent: "center",
          gap: { xs: 1, sm: 1.5 },
          pt: 1,
          pb: 2,
          ...actionsSx,
        }}
      >
        <Button
          onClick={handleCancel}
          disabled={isProcessing || disableCancel}
          variant={cancelButtonVariant}
          color="inherit"
          sx={{
            minWidth: { xs: 100, sm: 110 },
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            px: 2,
          }}
        >
          {cancelText}
        </Button>
        
        <Button
          onClick={handleConfirm}
          disabled={isProcessing || disableConfirm}
          variant={confirmButtonVariant}
          color={confirmButtonColor || variantConfig[variant]?.confirmColor}
          startIcon={isProcessing && <CircularProgress size={18} color="inherit" />}
          sx={{
            minWidth: { xs: 100, sm: 120 },
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 2,
          }}
        >
          {isProcessing ? loadingText : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Pre-configured variants for common use cases
export const DeleteConfirmDialog = (props) => (
  <MConfirmDialog
    variant="danger"
    confirmButtonColor="error"
    confirmText="Delete"
    cancelText="Keep"
    {...props}
  />
);

export const LogoutConfirmDialog = (props) => (
  <MConfirmDialog
    variant="logout"
    confirmButtonColor="error"
    confirmText="Logout"
    cancelText="Stay"
    title="Logout Confirmation"
    question="Are you sure you want to logout?"
    {...props}
  />
);

export const InfoDialog = (props) => (
  <MConfirmDialog
    variant="info"
    confirmButtonColor="primary"
    confirmText="OK"
    cancelText="Cancel"
    {...props}
  />
);

export default MConfirmDialog;