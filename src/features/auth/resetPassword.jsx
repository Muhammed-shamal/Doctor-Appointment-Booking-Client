import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  InputAdornment,
  IconButton,
  alpha,
  useTheme,
  Container,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { resetPassword } from "./authThunks";
import { useDispatch } from "react-redux";
import MTextField from "../../components/TextBox/MTextField";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const TextType = {
    Text: "text",
    Password: "password",
  };

  const validations = {
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      },
    },
  };

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await dispatch(resetPassword(data.password));

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";

      //Set form error for better UX
      if (error.response?.data?.message?.includes("expired")) {
        setError("password", {
          type: "manual",
          message: "This reset link has expired. Please request a new one.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 3,
            background: alpha(theme.palette.background.paper, 0.95),
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 600,
              mb: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Reset Password
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Please enter your new password below
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <MTextField
              name="password"
              label="New Password"
              control={control}
              rules={validations.password}
              type={showPassword ? TextType.Text : TextType.Password}
              suffix={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                    sx={{
                      color: theme.palette.primary.main,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ fontSize: 20 }} />
                    ) : (
                      <Visibility sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: alpha(theme.palette.primary.main, 0.02),
                  "&:hover": {
                    background: alpha(theme.palette.primary.main, 0.04),
                  },
                  "&.Mui-focused": {
                    background: alpha(theme.palette.primary.main, 0.06),
                    boxShadow: `0 0 0 3px ${alpha(
                      theme.palette.primary.main,
                      0.1,
                    )}`,
                  },
                },
                "& .MuiOutlinedInput-input": {
                  fontWeight: 500,
                },
              }}
              isCapital={false}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                transition: "all 0.3s ease",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: theme.shadows[8],
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                "&.Mui-disabled": {
                  background: alpha(theme.palette.primary.main, 0.5),
                },
              }}
            >
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default ResetPassword;
