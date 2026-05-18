import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  InputAdornment,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
  Stack,
  alpha,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  LockReset,
  VpnLock,
} from "@mui/icons-material";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, loginUser } from "./authThunks";
import logo from "../../assets/vite.svg";
import MButton from "../../components/Buttons/MBtn";
import MTextField from "../../components/TextBox/MTextField";
import { TextType } from "../../components/TextBox/types";
import { Link, useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import { validations } from "../../common/commonFunction";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { loading } = useSelector((state) => state.auth);

  const [forgotPasswordOpen, setForgotPasswordOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = async (data) => {
    await dispatch(loginUser(data)).unwrap();
    navigate("/");
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
  };

  const handleForgotPasswordSubmit = async (email) => {
    
    try {
      const response = await dispatch(forgotPassword(email)).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Failed to reset password:", error);
    } finally {
      handleForgotPasswordClose();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        py: 4,
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.08,
        )} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          right: "-50%",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.1,
          )} 0%, transparent 70%)`,
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-50%",
          left: "-50%",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.secondary.light,
            0.08,
          )} 0%, transparent 70%)`,
          pointerEvents: "none",
        },
      }}
    >
      <Fade in timeout={800}>
        <Card
          elevation={0}
          sx={{
            width: isSmallScreen ? "100%" : 450,
            borderRadius: 3,
            overflow: "hidden",
            background: theme.palette.background.paper,
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            boxShadow: `0 8px 32px ${alpha(
              theme.palette.primary.main,
              0.12,
            )}, 0 2px 8px ${alpha(theme.palette.primary.main, 0.08)}`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            zIndex: 1,
            "&:hover": {
              boxShadow: `0 12px 48px ${alpha(
                theme.palette.primary.main,
                0.16,
              )}, 0 4px 12px ${alpha(theme.palette.primary.main, 0.12)}`,
            },
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.08,
              )} 0%, ${alpha(theme.palette.primary.light, 0.04)} 100%)`,
              py: 3,
              px: 2,
              textAlign: "center",
              borderBottom: `1px solid ${alpha(
                theme.palette.primary.main,
                0.08,
              )}`,
              position: "relative",
            }}
          >
            <Avatar
              src={logo}
              sx={{
                mx: "auto",
                mb: 1.5,
                // width: 80,
                // height: 80,
                // border: `3px solid ${theme.palette.primary.main}`,
                // boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.08)",
                  boxShadow: `0 12px 32px ${alpha(
                    theme.palette.primary.main,
                    0.35,
                  )}`,
                },
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              Access your account securely
            </Typography>
          </Box>

          {/* Form Section */}
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Email Field */}
              <Box sx={{ mb: 2.5 }}>
                <MTextField
                  name="email"
                  startSuffix={
                    <Email
                      sx={{
                        color: theme.palette.primary.main,
                        fontSize: 20,
                      }}
                    />
                  }
                  control={control}
                  label={"Email Address"}
                  type={TextType.Email}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Enter a valid email",
                    },
                  }}
                  sx={{
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
              </Box>

              {/* Password Field */}
              <Box sx={{ mb: 2.5 }}>
                <MTextField
                  name="password"
                  label={"Password"}
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
              </Box>

              {/* Forgot Password Link */}
              <Stack
                direction="row"
                justifyContent="flex-end"
                sx={{ mt: 1, mb: 3 }}
              >
                <Box
                  component="button"
                  onClick={handleForgotPasswordOpen}
                  type="button"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.6,
                    background: "none",
                    border: "none",
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: 1,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: alpha(theme.palette.primary.main, 0.08),
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  <LockReset sx={{ fontSize: 16 }} />
                  Forgot Password?
                </Box>
              </Stack>

              {/* Loading Progress */}
              {loading && (
                <LinearProgress
                  sx={{
                    mb: 2.5,
                    borderRadius: 1,
                    height: 4,
                    background: alpha(theme.palette.primary.main, 0.08),
                    "& .MuiLinearProgress-bar": {
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      borderRadius: 1,
                    },
                  }}
                />
              )}

              {/* Submit Button */}
              <MButton
                loading={loading}
                label={loading ? "Signing in..." : "Sign In"}
                type="submit"
                size="large"
                variant="contained"
                startIcon={!loading && <VpnLock sx={{ fontSize: 20 }} />}
                sx={{
                  py: 1,
                  fontWeight: 700,
                  borderRadius: 2,
                  fontSize: "0.95rem",
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 4px 16px ${alpha(
                    theme.palette.primary.main,
                    0.35,
                  )}`,
                  transition:
                    "all 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease",
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    boxShadow: `0 8px 24px ${alpha(
                      theme.palette.primary.main,
                      0.45,
                    )}`,
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                  },
                  "&:disabled": {
                    background: alpha(theme.palette.primary.main, 0.45),
                    boxShadow: "none",
                    transform: "none",
                  },
                }}
                fullWidth
              />

              {/* Regiser Account */}
              <Box
                sx={{
                  mt: 3,
                  pt: 2.5,
                  borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  component={Link}
                  to="/register"
                >
                  Don’t have an account? Register here
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Fade>

      {/* Forgot Password Modal */}
      <ForgotPassword
        open={forgotPasswordOpen}
        onClose={handleForgotPasswordClose}
        onSubmit={handleForgotPasswordSubmit}
      />
    </Box>
  );
};

export default Login;
