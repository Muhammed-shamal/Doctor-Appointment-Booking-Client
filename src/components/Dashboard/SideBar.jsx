import React, { useState } from "react";
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/vite.svg";
import Logo2 from "../../assets/vite.svg";
import { menu } from "./menu";

const Sidebar = ({
  open,
  handleCollapse,
  handleDrawerToggle,
  collapse,
  drawerWidth = 270,

  textColor,
  hoverColor,
  hoverTextColor,
  textOneColor,
  boxShadowColor,
  backgroundColor,
  selectedBackgroundColor,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation(); // Get the current location from React Router

  const [hoveredMenuPosition, setHoveredMenuPosition] = useState({ top: 0 });

  const [openChildMenus, setOpenChildMenus] = useState({});

  const [hoveredMenuId, setHoveredMenuId] = useState(null);

  // Helper function to determine if the menu item is selected
  const isSelected = (path) => {
    return path && location.pathname === path;
  };

  const handleToggleChildMenu = (id) => {
    setOpenChildMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleMouseEnter = (id) => {
    setHoveredMenuId(id);

    // Find the hovered list item position
    const listItem = document.getElementById(`menu-item-${id}`);
    if (listItem) {
      const rect = listItem.getBoundingClientRect();
      setHoveredMenuPosition({ top: rect.top + window.scrollY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredMenuId(null);
  };

  const closeMenuWithDelay = () => {
  setTimeout(() => {
    setHoveredMenuId(null);
  }, 10);
};


  return (
    <Drawer
      elevation={0}
      variant={isSmallScreen ? "temporary" : "persistent"}
      anchor="left"
      open={open}
      onClose={handleDrawerToggle}
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapse ? 72 : drawerWidth,
          boxSizing: "border-box",
          backgroundColor: backgroundColor,
          color: "#fff",
          overflowX: "hidden",
          transition: "width 0.3s ease",
          borderRight: "none",
          boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          width={collapse ? 40 : 60}
          height={collapse ? 40 : 40}
          sx={{
            height: 62,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#A6CE39", // optional light green background
          }}
        >
          <Box
            component="img"
            src={collapse ? Logo2 : Logo}
            alt="logo"
            width={collapse ? 30 : 40}
            height={collapse ? 30 : 40}
            style={{ transition: "all 0.3s ease-in-out" }}
          />
        </Box>
      </Box>

      {/* <Divider sx={{ borderColor: "#e2e8f0" }} /> */}

      <List>
        {menu.map((item) => (
          <React.Fragment key={item.id}>
            <li
              id={`menu-item-${item.id}`} // Add unique ID
              style={{ padding: 2 }}
              onMouseEnter={() => handleMouseEnter(item.id)}
            //   onMouseLeave={handleMouseLeave}
            >
              <ListItemButton
                component={Link}
                to={item.path || "#"}
                onClick={() => item.children && handleToggleChildMenu(item.id)}
                sx={{
                  my: 0.5,
                  borderRadius: "10px",
                  justifyContent: collapse ? "center" : "flex-start",
                  px: collapse ? 1.5 : 2.5,
                  backgroundColor: isSelected(item.path)
                    ? selectedBackgroundColor
                    : "transparent", // blue-600 for active
                  color: isSelected(item.path) ? "#fff" : textOneColor,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: hoverColor, // gray-700 hover
                    color: "#fff",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapse ? 0 : 1.5,
                    justifyContent: "center",
                    color: item.label === "Logout" ? "red" : "#475569",
                  }}
                >
                  <item.icon fontSize="small" />
                </ListItemIcon>
                {!collapse && (
                  <ListItemText
                    primary={item.label}
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: " 14px",
                        color: "black",
                      },
                    }}
                  />
                )}

                {item.children && !collapse && (
                  <ListItemIcon>
                    {openChildMenus[item.id] ? (
                      <ExpandMoreIcon sx={{ color: textColor }} />
                    ) : (
                      <ExpandLessIcon sx={{ color: textColor }} />
                    )}
                  </ListItemIcon>
                )}
              </ListItemButton>
            </li>

            {/* Child Menu when Hover */}
            {item.children && collapse && hoveredMenuId === item.id && (
              <ul
                className="child-menu"
                style={{
                  position: "fixed",
                  left: 80,
                  top: hoveredMenuPosition.top,
                  zIndex: 1500,
                  backgroundColor: "#fff",
                  padding: "0",
                  margin: "0",
                  listStyle: "none",
                  borderRadius: 10,
                  boxShadow: `0 10px 30px ${boxShadowColor}`,
                }}
                onMouseEnter={() => setHoveredMenuId(item.id)} // Keep it open when hovered
                onMouseLeave={closeMenuWithDelay}   
              >
                {item.children.map((child) => (
                  <li
                    key={child.id}
                    style={{ width: "14rem", borderRadius: 10 }}
                  >
                    <ListItemButton
                      component={Link}
                      to={child.path || "#"}
                      sx={{
                        padding: "8px",
                        height: 50,
                        color: textColor,
                        "&:hover": {
                          color: hoverTextColor,
                          backgroundColor: hoverColor,
                        },
                      }}
                    >
                      <ListItemText
                        primary={child.label}
                        sx={{
                          padding: "8px",
                          "& .MuiTypography-root": { fontSize: " 14px" },
                        }}
                      />
                    </ListItemButton>
                  </li>
                ))}
              </ul>
            )}

            {/* Child Menu when Expanded */}
            {item.children && openChildMenus[item.id] && !collapse && (
              <ul style={{ listStyle: "none", marginRight: "7px" }}>
                {item.children.map((child) => (
                  <li key={child.id}>
                    <ListItemButton
                      component={Link}
                      to={child.path || "#"}
                      sx={{
                        maxHeight: 35,
                        backgroundColor: isSelected(child.path)
                          ? hoverColor
                          : "transparent",
                        color: isSelected(child.path)
                          ? hoverTextColor
                          : textColor,
                        marginTop: "6px",
                        justifyContent: "initial",
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: hoverColor,
                          color: hoverTextColor,
                        },
                      }}
                    >
                      {child.icon && (
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: collapse ? 0 : 0.5,
                            justifyContent: "center",
                            color: item.label === "Logout" ? "red" : "#475569",
                          }}
                        >
                          <child.icon fontSize="small" />
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={child.label}
                        sx={{
                          paddingLeft: 3,
                          "& .MuiTypography-root": {
                            fontSize: "14px",
                            color: textOneColor,
                          },
                        }}
                      />
                    </ListItemButton>
                  </li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Collapse/Expand Toggle */}
      <Box
        sx={{
          p: 2,
          mt: "auto",
          display: "flex",
          justifyContent: collapse ? "center" : "flex-end",
        }}
      >
        <IconButton
          onClick={handleCollapse}
          sx={{
            backgroundColor: "#334155", // gray-700
            color: "#fff",
            "&:hover": {
              backgroundColor: "#1e293b", // gray-800
            },
            transition: "all 0.2s ease",
          }}
        >
          {collapse ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
