import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import {
  Category,
  People,
  Inventory2,
  BrandingWatermarkSharp,
  Home,
  LocalHospital,
  BookOnline
} from '@mui/icons-material'
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import Navbar from "./Navbar";
import BottomBar from "./AppBar";

const DashboardLayout = () => {
  const theme = useTheme();

  const iconColor = "#fff";
  const hoverTextColor = "#fff";
  const backgroundColor = "#fff";
  const boxShadowColor = "rgba(209, 200, 200, 0.6)";

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(!isSmallScreen);
  const [collapse, setCollapse] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleCollapse = () => {
    setCollapse(!collapse);
  };

  
  //admin menu by default;
  const navItems = [
    { path: '/', label: 'Home', icon: <Home /> },
    { path: '/patients/list', label: 'Products', icon: <People /> },
    { path: '/doctors/list', label: 'Brands', icon: <LocalHospital /> },
    { path: '/slots/list', label: 'Categories', icon: <Category /> },
    { path: '/appointments/list', label: 'Customers', icon: <BookOnline /> }
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh", }}>

      {!isSmallScreen && <Navbar
        backgroundColor={backgroundColor}
        collapse={collapse}
      />}
      
      {/* <Header /> */}
      <Sidebar
        collapse={collapse}
        handleCollapse={handleCollapse}
        handleDrawerToggle={handleDrawerToggle}
        open={open}
        // bellow for color changes
        backgroundColor={backgroundColor}
        boxShadowColor={boxShadowColor}
        hoverColor={theme.palette.primary.main}
        hoverTextColor={hoverTextColor}
        primaryColor={theme.palette.primary.main}
        secondaryColor={theme.palette.secondary.main}
        selectedBackgroundColor={theme.palette.primary.main}
        textColor={theme.palette.primary.main}       
         textOneColor={theme.palette.primary.mainOne}

        iconColor={iconColor}
      />      

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          marginTop: !isSmallScreen ? "5rem" : "0.7rem", // Offset for AppBar height
          overflowY: "auto", // Enable scrolling for content only
          marginLeft: isSmallScreen ? "0rem" : collapse ? "7rem" : "19rem",
        }}
      >
        <Outlet />
      </Box>

      {isSmallScreen && <BottomBar navItems={navItems} />}
    </Box>
  );
};

export default DashboardLayout;
