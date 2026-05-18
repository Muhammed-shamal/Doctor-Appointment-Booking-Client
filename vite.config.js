import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { API_URL } from "./src/api/constant";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: API_URL.SOCKET_URL,

        changeOrigin: true,

        secure: false,
      },
    },
  },
});
