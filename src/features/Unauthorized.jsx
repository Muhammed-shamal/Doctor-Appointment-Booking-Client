import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  alpha,
  keyframes,
  Zoom,
  Fade,
} from "@mui/material";
import {
  LockOutlined as LockIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  WarningAmber as WarningIcon,
  GppMaybe as GppIcon,
} from "@mui/icons-material";
import MButton from "../components/Buttons/MBtn";

// Animations
const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.1;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`;

const Unauthorized = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 10% 20%, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(
          theme.palette.background.default,
          0.98,
        )} 90%)`,
        position: "relative",
        overflow: "hidden",
        px: 2,
        py: 4,
      }}
    >
      {/* Animated Background Particles */}
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(theme.palette.warning.main, 0.1)} 0%, transparent 70%)`,
            animation: `${pulse} ${8 + i * 2}s ease-in-out infinite`,
            top: `${20 + i * 30}%`,
            left: `${10 + i * 40}%`,
            pointerEvents: "none",
          }}
        />
      ))}

      <Zoom in timeout={500}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5, md: 6 },
            maxWidth: 650,
            width: "100%",
            borderRadius: 6,
            textAlign: "center",
            background:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.paper, 0.9)
                : theme.palette.background.paper,
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            position: "relative",
            overflow: "hidden",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 25px 50px -12px rgba(0,0,0,0.5)"
                : "0 25px 50px -12px rgba(0,0,0,0.15)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.error.main}, ${theme.palette.warning.main})`,
              backgroundSize: "200% 100%",
              animation: "gradient 3s ease infinite",
            },
          }}
        >
          {/* Decorative Shield Icon */}
          <Box
            sx={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(theme.palette.warning.main, 0.15)} 0%, transparent 70%)`,
              zIndex: 0,
            }}
          />

          <Box position="relative" zIndex={1}>
            {/* Animated Icon Container */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 4,
                animation: `${float} 3s ease-in-out infinite`,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${alpha(theme.palette.warning.main, 0.2)} 0%, transparent 70%)`,
                    animation: `${pulse} 2s ease-in-out infinite`,
                  }}
                />
                <GppIcon
                  sx={{
                    fontSize: { xs: 70, sm: 90 },
                    color: theme.palette.warning.main,
                    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
                  }}
                />
                <Typography
                  component="span"
                  variant="h1"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: { xs: 32, sm: 40 },
                    fontWeight: "bold",
                    color: theme.palette.warning.main,
                    textShadow: `0 2px 4px ${alpha(theme.palette.warning.main, 0.3)}`,
                  }}
                >
                  403
                </Typography>
              </Box>
            </Box>

            {/* Title with gradient */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.error.main} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              Access Denied
            </Typography>

            {/* Warning Chip */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                mb: 3,
                borderRadius: 5,
                background: alpha(theme.palette.warning.main, 0.1),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              }}
            >
              <WarningIcon
                sx={{ fontSize: 18, color: theme.palette.warning.main }}
              />
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: theme.palette.warning.main }}
              >
                Unauthorized Access
              </Typography>
            </Box>

            {/* Description */}
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 5,
                fontSize: { xs: "0.95rem", sm: "1.1rem" },
                lineHeight: 1.7,
                maxWidth: 450,
                mx: "auto",
              }}
            >
              You don't have the necessary permissions to view this page. Please
              contact your system administrator for access.
            </Typography>

            {/* Action Buttons */}
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              justifyContent="center"
              sx={{ width: "100%" }}
            >
              <Button
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                color="primary"
              >
                Go Back
              </Button>

              <MButton
                variant="contained"
                size={isMobile ? "small" : "medium"}
                color={"primary"}
                startIcon={<HomeIcon />}
                onClick={() => navigate("/")}
                label={"Return Home"}
              />
            </Stack>

            {/* Help Text */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 4,
                pt: 2,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                fontSize: "0.75rem",
              }}
            >
              Need access? Contact your system administrator with reference ID:
              403-{Math.random().toString(36).substr(2, 6).toUpperCase()}
            </Typography>
          </Box>
        </Paper>
      </Zoom>
    </Box>
  );
};

export default Unauthorized;
