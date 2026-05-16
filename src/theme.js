import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#47A065",
      light: "#6BC58A",
      dark: "#2E7D4F",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#050505",
      light: "#2F2F2F",
      dark: "#000000",
      contrastText: "#FFFFFF",
    },

    success: {
      main: "#47A065",
    },

    warning: {
      main: "#F59E0B",
    },

    error: {
      main: "#EF4444",
    },

    info: {
      main: "#0EA5E9",
    },

    background: {
      default: "#F6F7F9",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#1F2937",
      secondary: "#6B7280",
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: "#47A065",
          boxShadow: "0 2px 8px rgba(71,160,101,0.25)",
          "&:hover": {
            backgroundColor: "#2E7D4F",
            boxShadow: "0 4px 12px rgba(71,160,101,0.35)",
          },
        },
      },
    },
  },
});