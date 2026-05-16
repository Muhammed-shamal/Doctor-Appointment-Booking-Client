import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Logo from "../assets/vite.svg";

const Loader = () => {
 const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (

   <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1500,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 120,
          height: 120,
        }}
      >
        {/* OUTER ARC */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid transparent",
            borderTopColor: "#A6CE39",
            animation: "spin 2s linear infinite",
          }}
        />

        {/* MIDDLE ARC */}
        <Box
          sx={{
            position: "absolute",
            inset: 10,
            borderRadius: "50%",
            border: "3px solid transparent",
            borderRightColor: "#A6CE39",
            animation: "spin 1.5s linear infinite",
          }}
        />

        {/* INNER ARC */}
        <Box
          sx={{
            position: "absolute",
            inset: 20,
            borderRadius: "50%",
            border: "3px solid transparent",
            borderBottomColor: "#A6CE39",
            animation: "spin 1s linear infinite",
          }}
        />

        {/* LOGO CIRCLE */}
        <Box
          sx={{
            position: "absolute",
            inset: 35,
            borderRadius: "50%",
            bgcolor: "#A6CE39",
            border: "3px solid #A6CE39",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={Logo} alt="Logo" width={40} height={40} />
        </Box>
      </Box>

      {/* KEYFRAMES */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Box>
  );
};

export default Loader;