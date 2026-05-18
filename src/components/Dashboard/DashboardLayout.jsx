import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import {
  Category,
  People,
  Inventory2,
  BrandingWatermarkSharp,
  Home,
  LocalHospital,
  BookOnline,
} from "@mui/icons-material";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import Navbar from "./Navbar";
import BottomBar from "./AppBar";
import { useSelector } from "react-redux";
import { getMenu } from "./menu";

const DashboardLayout = () => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(!isSmallScreen);
  const [collapse, setCollapse] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleCollapse = () => {
    setCollapse(!collapse);
  };

  console.log("user is", user);
  const menu = getMenu(user?.role);

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#F9FAFB" }}>
      {!isSmallScreen && (
        <Navbar backgroundColor="#FFFFFF" collapse={collapse} />
      )}

      {/* <Header /> */}
      <Sidebar
        user={user}
        collapse={collapse}
        handleCollapse={handleCollapse}
        handleDrawerToggle={handleDrawerToggle}
        open={open}
        // bellow for color changes
        backgroundColor="#FFFFFF"
        boxShadowColor="rgba(0, 0, 0, 0.08)"
        hoverColor={theme.palette.primary.main}
        hoverTextColor="#fff"
        primaryColor={theme.palette.primary.main}
        secondaryColor={theme.palette.secondary.main}
        selectedBackgroundColor={theme.palette.primary.main}
        textColor={theme.palette.primary.main}
        textOneColor={theme.palette.primary.main}
        iconColor="#fff"
      />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          marginTop: !isSmallScreen ? "4.5rem" : "0.7rem",
          overflowY: "auto",
          marginLeft: isSmallScreen ? "0rem" : collapse ? "6rem" : "18rem",
          padding: { xs: "16px", sm: "24px" },
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Outlet />
      </Box>

      {isSmallScreen && <BottomBar navItems={menu} />}
    </Box>
  );
};

export default DashboardLayout;
