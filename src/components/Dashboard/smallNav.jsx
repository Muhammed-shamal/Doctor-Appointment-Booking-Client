import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/product/list": "Products",
  "/brand/list": "Brands",
  "/category/list": "Categories",
  "/customer/list": "Customers",
  // Add more paths as needed
};

export const ResponsiveHeaderBar = () => {
  const location = useLocation();
  const [title, setTitle] = useState("Dashboard");

  useEffect(() => {
    const currentPath = location.pathname;
    setTitle(pageTitles[currentPath] || "Dashboard");
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        py: 1.5,
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 10,
        justifyContent: "space-between"
      }}
    >
      {/* Left: Logo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <img
          src="/logo.png" // change to your logo
          alt="Company Logo"
          style={{ width: 30, height: 30 }}
        />
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </Box>

      {/* Right: Optional tag/info */}
      {/* <Typography variant="body2" color="text.secondary">Welcome!</Typography> */}
    </Box>
  );
};
