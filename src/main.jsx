import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { ThemeProvider } from "@mui/material";
// import { LocalizationProvider } from "@mui/x-date-pickers";
import { theme } from "./theme.js";
import GlobalNotifier from "./components/GlobalNotifier.jsx";
import OfflineNotifier from "./components/OfflineNotifier.jsx";
import { ToastProvider } from "./context/SnackBar.jsx";
import { SocketProvider } from "./context/Socket.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <SocketProvider>
          <App />
          {/* <LocalizationProvider dateAdapter={AdapterDateFns}> </LocalizationProvider> */}
          <GlobalNotifier />
          <OfflineNotifier />
        </SocketProvider>
      </ToastProvider>
    </ThemeProvider>
  </Provider>,
);
