import React, { useState } from "react";
import { useSelector } from "react-redux";
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
  Tooltip,
} from "@mui/material";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/vite.svg";
import Logo2 from "../../assets/vite.svg";
import { getMenu } from "./menu";

const Sidebar = ({
  open,
  handleCollapse,
  handleDrawerToggle,
  collapse,
  drawerWidth = 250,

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
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

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

  const menu = getMenu(user.role || "patient");

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
          width: collapse ? 80 : drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#FFFFFF",
          color: "#1F2937",
          overflowX: "hidden",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          borderRight: "1px solid #E5E7EB",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #E5E7EB",
          bg: "#F9FAFB",
          padding: "0 12px",
        }}
      >
        <Box
          width={collapse ? 40 : 60}
          height={collapse ? 40 : 40}
          sx={{
            height: 50,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            
            transition: "all 0.3s ease",
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

      <List sx={{ px: 1, py: 2 }}>
        {menu.staticMenu.map((item) => (
          <React.Fragment key={item.id}>
            <li
              id={`menu-item-${item.id}`}
              style={{ padding: 2, listStyle: "none" }}
              onMouseEnter={() => handleMouseEnter(item.id)}
            >
              <Tooltip title={collapse ? item.label : ""} placement="right">
                <ListItemButton
                  component={Link}
                  to={item.path || "#"}
                  onClick={() => item.children && handleToggleChildMenu(item.id)}
                  sx={{
                    my: 0.75,
                    borderRadius: "10px",
                    justifyContent: collapse ? "center" : "flex-start",
                    px: collapse ? 1.5 : 2,
                    py: 1.2,
                    backgroundColor: isSelected(item.path)
                      ? "#47A065"
                      : "transparent",
                    color: isSelected(item.path) ? "#fff" : "#6B7280",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      backgroundColor: isSelected(item.path)
                        ? "#2E7D4F"
                        : "#F3F4F6",
                      color: isSelected(item.path) ? "#fff" : "#1F2937",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapse ? 0 : 2,
                      justifyContent: "center",
                      color:
                        item.label === "Logout"
                          ? "#EF4444"
                          : isSelected(item.path)
                          ? "#fff"
                          : "#6B7280",
                      transition: "color 0.25s ease",
                    }}
                  >
                    <item.icon fontSize="small" />
                  </ListItemIcon>
                  {!collapse && (
                    <ListItemText
                      primary={item.label}
                      sx={{
                        "& .MuiTypography-root": {
                          fontSize: "14px",
                          fontWeight: isSelected(item.path) ? 600 : 500,
                          color: "inherit",
                        },
                      }}
                    />
                  )}

                  {item.children && !collapse && (
                    <ListItemIcon
                      sx={{
                        mr: -1,
                        color: isSelected(item.path) ? "#fff" : "#9CA3AF",
                      }}
                    >
                      {openChildMenus[item.id] ? (
                        <ExpandMoreIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <ExpandLessIcon sx={{ fontSize: 20 }} />
                      )}
                    </ListItemIcon>
                  )}
                </ListItemButton>
              </Tooltip>
            </li>

            {/* Child Menu when Hover */}
            {item.children && collapse && hoveredMenuId === item.id && (
              <ul
                className="child-menu"
                style={{
                  position: "fixed",
                  left: 88,
                  top: hoveredMenuPosition.top,
                  zIndex: 1500,
                  backgroundColor: "#FFFFFF",
                  padding: "8px 0",
                  margin: "0",
                  listStyle: "none",
                  borderRadius: 12,
                  boxShadow: "0 10px 32px rgba(0, 0, 0, 0.15)",
                  minWidth: "180px",
                }}
                onMouseEnter={() => setHoveredMenuId(item.id)}
                onMouseLeave={closeMenuWithDelay}
              >
                {item.children.map((child) => (
                  <li
                    key={child.id}
                    style={{ listStyle: "none", padding: "0 8px" }}
                  >
                    <ListItemButton
                      component={Link}
                      to={child.path || "#"}
                      sx={{
                        padding: "10px 12px",
                        height: 44,
                        color: "#6B7280",
                        fontSize: "14px",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          color: "#47A065",
                          backgroundColor: "#F0FDF4",
                        },
                      }}
                    >
                      <ListItemText
                        primary={child.label}
                        sx={{
                          "& .MuiTypography-root": {
                            fontSize: "14px",
                          },
                        }}
                      />
                    </ListItemButton>
                  </li>
                ))}
              </ul>
            )}

            {/* Child Menu when Expanded */}
            {item.children && openChildMenus[item.id] && !collapse && (
              <ul style={{ listStyle: "none", margin: "4px 0 12px 0" }}>
                {item.children.map((child) => (
                  <li key={child.id}>
                    <ListItemButton
                      component={Link}
                      to={child.path || "#"}
                      sx={{
                        maxHeight: 40,
                        backgroundColor: isSelected(child.path)
                          ? "#F0FDF4"
                          : "transparent",
                        color: isSelected(child.path) ? "#47A065" : "#6B7280",
                        marginLeft: "12px",
                        marginRight: "8px",
                        marginTop: "6px",
                        justifyContent: "initial",
                        borderRadius: "8px",
                        borderLeft: isSelected(child.path)
                          ? "3px solid #47A065"
                          : "3px solid transparent",
                        pl: 1.5,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#F3F4F6",
                          color: "#47A065",
                        },
                      }}
                    >
                      {child.icon && (
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: 1,
                            justifyContent: "center",
                            color: "inherit",
                            fontSize: "18px",
                          }}
                        >
                          <child.icon fontSize="small" />
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={child.label}
                        sx={{
                          "& .MuiTypography-root": {
                            fontSize: "14px",
                            color: "inherit",
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
          borderTop: "1px solid #E5E7EB",
        }}
      >
        <Tooltip title={collapse ? "Expand" : "Collapse"} placement="right">
          <IconButton
            onClick={handleCollapse}
            sx={{
              backgroundColor: "#F3F4F6",
              color: "#6B7280",
              "&:hover": {
                backgroundColor: "#E5E7EB",
                color: "#47A065",
              },
              transition: "all 0.2s ease",
            }}
          >
            {collapse ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
