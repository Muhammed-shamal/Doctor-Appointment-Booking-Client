import { useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const MButton = ({
  id,
  label,
  className,
  variant,
  size = "small",
  bgcolor,
  disabled,
  type,
  loading,
  onClick,
  color,
  startIcon,
  endIcon,
  sx,
  fullWidth,
}) => {
  const theme = useTheme();

  return (
    <>
      {!color && (
        <Button
          id={id}
          type={type === "submit" ? "submit" : "button"}
          disabled={disabled || loading}
          className={className ? className : "ws-default"}
          startIcon={startIcon}
          endIcon={endIcon}
          style={{
            fontSize:
              size === "medium"
                ? "0.875rem"
                : size === "small"
                  ? "0.700rem"
                  : "1rem",
          }}
          size={size}
          sx={{
            backgroundColor: bgcolor || theme.palette.primary,
            color: theme.palette.primary,
            fontWeight: 600,
            "&:hover": {
              backgroundColor: bgcolor || theme.palette.primary.dark,
            },
            ...sx,
          }}
          variant={variant}
          onClick={onClick}
          fullWidth={fullWidth}
        >
          {" "}
          {loading ? <CircularProgress size={24} color="inherit" /> : label}
        </Button>
      )}
      {color && (
        <Button
          id={id}
          type={type === "submit" ? "submit" : "button"}
          disabled={disabled || loading}
          className={className ? className : ""}
          color={color}
          size={size}
          style={{
            fontSize:
              size === "medium"
                ? "0.875rem"
                : size === "small"
                  ? "0.700rem"
                  : "1rem",
          }}
          variant={variant}
          startIcon={startIcon}
          sx={{ ...sx }}
          endIcon={endIcon}
          fullWidth={fullWidth}
          onClick={onClick}
        >
          {" "}
          {loading ? <CircularProgress size={24} color={color} /> : label}
        </Button>
      )}
    </>
  );
};

export default MButton;
