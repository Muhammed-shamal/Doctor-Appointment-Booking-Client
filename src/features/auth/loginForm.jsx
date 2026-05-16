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
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  LockReset,
} from "@mui/icons-material";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./authThunks";
import logo from "../../assets/vite.svg";
import MButton from "../../components/Buttons/MBtn";
import MTextField from "../../components/TextBox/MTextField";
import { TextType } from "../../components/TextBox/types";
import { Link } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";

const Login = () => {
  const dispatch = useDispatch();
  const { handleSubmit, control } = useForm();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { loading } = useSelector((state) => state.auth);

  const [forgotPasswordOpen, setForgotPasswordOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
  };

  const handleForgotPasswordSubmit = async (email) => {
    console.log("Password reset requested for:", email);
    // try {
    //   setLoading(true);

    //   const request = {
    //     email: email,
    //   };

    //   const response = await callAPI(
    //     "Vyapar/User/forgot-password",
    //     Method.POST,
    //     request
    //   );
    //   console.log('Forgot password response:', response); // Debug log to check the API response

    //   if (response) {
    //     showMessage(
    //       response?.message,
    //       response.success === true ? "success" : "error"
    //     );

    //     if (response.success === true) {
    //       navigate("/");
    //     }
    //   }
    // } catch (error) {
    //   console.error("Failed to reset password:", error);
    //   showMessage(error.response?.data?.message || "Failed to reset password", "error");
    // } finally {
    //   setLoading(false);
    //   handleForgotPasswordClose();
    // }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "100%",
          height: "100%",
          // background: `url(${bgImage}) no-repeat bottom`,
          backgroundSize: "cover",
          opacity: 0.8,
        },
      }}
    >
      <Fade in timeout={800}>
        <Card
          elevation={10}
          sx={{
            width: isSmallScreen ? "100%" : 450,
            borderRadius: 4,
            overflow: "hidden",
            background: theme.palette.background.paper,
            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            sx={{
              py: 2,
              textAlign: "center",
            }}
          >
            <Avatar
              src={logo}
              sx={{
                mx: "auto",
                width: 70,
                height: 70,
                border: "4px solid white",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={3}>
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                color="error"
              >
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to continue to your account
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Email Field */}
              <MTextField
                name="email"
                startSuffix={<Email color="action" />}
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
                  marginBottom: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                  },
                }}
                isCapital={false}
              />

              {/* Password Field */}
              <MTextField
                name="password"
                label={"Password"}
                control={control}
                type={showPassword ? TextType.Text : TextType.Password}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required",
                  },
                }}
                suffix={
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                  },
                }}
                isCapital={false}
              />

              {/* Forgot Password Link */}
              <Stack
                direction="row"
                justifyContent="flex-end"
                sx={{ mt: 1, mb: 2 }}
              >
                <Link
                  component="button"
                  type="button"
                  onClick={handleForgotPasswordOpen}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  <LockReset sx={{ fontSize: 16 }} />
                  Forgot Password?
                </Link>
              </Stack>

              {/* Submit Button */}
              <MButton
                loading={loading}
                label={loading ? "Signing in..." : "Sign In"}
                type="submit"
                size="large"
                variant="contained"
                startIcon={!loading && <Person />}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.light} 90%)`,
                  boxShadow: `0 3px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
                    boxShadow: `0 5px 20px ${alpha(theme.palette.primary.main, 0.6)}`,
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                    background: alpha(theme.palette.primary.main, 0.5),
                    boxShadow: "none",
                  },
                }}
                fullWidth
              />
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
