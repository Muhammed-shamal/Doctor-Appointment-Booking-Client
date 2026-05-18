import React, { useState, useEffect } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
  Fab,
  Zoom,
  useMediaQuery,
  useTheme as useMuiTheme,
  Box,
  Tooltip,
  Grow,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  RoomService,
  DesignServices,
  Person,
  ShoppingCart,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

// Icon mapping for dynamic rendering
const iconMap = {
  Home,
  RoomService,
  DesignServices,
  Person,
  ShoppingCart,
  default: MenuIcon,
};

const BottomBar = ({
  navItems,
  variant = "default", // 'default', 'fab', 'floating'
  showLabels = true,
  showIcons = true,
  activeColor = "primary.main",
  inactiveColor = "text.secondary",
  onItemClick,
  badgeCounts = {},
  elevation = 3,
  floatingOffset = 16,
  animateOnScroll = true,
  hideOnScroll = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [value, setValue] = useState(location.pathname);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Handle scroll behavior
  useEffect(() => {
    if (!hideOnScroll && !animateOnScroll) return;

    const handleScroll = () => {
      if (hideOnScroll) {
        const currentScrollY = window.scrollY;
        setShow(currentScrollY <= lastScrollY || currentScrollY < 50);
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideOnScroll, lastScrollY]);

  // Update value when location changes
  useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
    if (onItemClick) onItemClick(newValue);
  };

  // Determine if item is active
  const isActive = (path) => {
    if (path === "/") return value === path;
    return value.startsWith(path);
  };

  // Get icon component
  const getIcon = (Icon) => {
    if (!Icon) return <MenuIcon />;
    return typeof Icon === "function" ? <Icon /> : <Icon />;
  };

  // Get badge count
  const getBadgeCount = (path) => {
    return badgeCounts[path] || 0;
  };

  // Variant styles
  const variantStyles = {
    default: {
      paper: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: 0,
        bgcolor: "background.paper",
      },
      bottomNav: {
        height: { xs: 56, sm: 65 },
        pb: { xs: 0.5, sm: 1 },
      },
    },
    floating: {
      paper: {
        position: "fixed",
        bottom: floatingOffset,
        left: floatingOffset,
        right: floatingOffset,
        borderRadius: 4,
        bgcolor: "background.paper",
        boxShadow: theme.shadows[8],
      },
      bottomNav: {
        height: { xs: 56, sm: 65 },
        borderRadius: 4,
      },
    },
    fab: {
      paper: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: "transparent",
        boxShadow: "none",
        pointerEvents: "none",
      },
      bottomNav: {
        height: { xs: 60, sm: 70 },
        bgcolor: "background.paper",
        borderRadius: { xs: "20px 20px 0 0", sm: "24px 24px 0 0" },
        pointerEvents: "auto",
      },
    },
  };

  const currentStyle = variantStyles[variant];

  const BottomNavComponent = () => (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels={showLabels && (isMobile || showLabels)}
      sx={{
        height: currentStyle.bottomNav.height,
        ...currentStyle.bottomNav,
        "& .MuiBottomNavigationAction-root": {
          minWidth: "auto",
          px: { xs: 1, sm: 2 },
          transition: "all 0.2s ease-in-out",
          color: inactiveColor,
          "&.Mui-selected": {
            color: activeColor,
            transform: "translateY(-4px)",
          },
          "&:hover": {
            color: activeColor,
            transform: "translateY(-2px)",
          },
        },
        "& .MuiBottomNavigationAction-label": {
          fontSize: { xs: "0.65rem", sm: "0.75rem" },
          fontWeight: 500,
          transition: "font-size 0.2s ease",
          "&.Mui-selected": {
            fontSize: { xs: "0.7rem", sm: "0.8rem" },
            fontWeight: 600,
          },
        },
        "& .MuiSvgIcon-root": {
          fontSize: { xs: "1.4rem", sm: "1.6rem" },
          transition: "transform 0.2s ease",
        },
      }}
    >
      {navItems.map((item, index) => {
        const isItemActive = isActive(item.path);
        const badgeCount = getBadgeCount(item.path);

        return (
          <Tooltip
            key={item.path}
            title={item.label}
            placement="top"
            disableHoverListener={showLabels}
            arrow
          >
            <BottomNavigationAction
              label={showLabels ? item.label : ""}
              icon={
                showIcons ? (
                  badgeCount > 0 ? (
                    <Badge
                      badgeContent={badgeCount}
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: "0.7rem",
                          height: 18,
                          minWidth: 18,
                          transform: "scale(1) translate(30%, -30%)",
                        },
                      }}
                    >
                      {getIcon(item.icon)}
                    </Badge>
                  ) : (
                    getIcon(item.icon)
                  )
                ) : null
              }
              value={item.path}
              sx={{
                "&.Mui-selected": {
                  "& .MuiSvgIcon-root": {
                    transform: "scale(1.1)",
                  },
                },
                ...item.sx,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          </Tooltip>
        );
      })}
    </BottomNavigation>
  );

  // FAB variant with center button
  const FabBottomNav = () => (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        pb: 2,
        pointerEvents: "none",
        zIndex: 1400,
      }}
    >
      <Paper
        elevation={elevation}
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "auto",
          minWidth: { xs: "90%", sm: "auto" },
          maxWidth: { xs: "90%", sm: 600 },
          bgcolor: "background.paper",
          borderRadius: 8,
          px: { xs: 1, sm: 2 },
          py: 0.5,
          position: "relative",
          pointerEvents: "auto",
        }}
      >
        {navItems.slice(0, 2).map((item) => (
          <Tooltip key={item.path} title={item.label} placement="top">
            <BottomNavigationAction
              icon={getIcon(item.icon)}
              value={item.path}
              onClick={() => handleChange(null, item.path)}
              sx={{
                minWidth: "auto",
                px: 2,
                py: 1,
                color: isActive(item.path) ? activeColor : inactiveColor,
                "& .MuiSvgIcon-root": {
                  fontSize: 24,
                },
              }}
            />
          </Tooltip>
        ))}

        {/* Center FAB Button */}
        <Fab
          color="primary"
          onClick={() => {
            const centerItem = navItems[Math.floor(navItems.length / 2)];
            if (centerItem) handleChange(null, centerItem.path);
          }}
          sx={{
            position: "relative",
            top: -20,
            width: 56,
            height: 56,
            boxShadow: theme.shadows[8],
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            "&:hover": {
              transform: "scale(1.05)",
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            },
            transition: "transform 0.2s ease",
          }}
        >
          {navItems[Math.floor(navItems.length / 2)]?.icon ? (
            getIcon(navItems[Math.floor(navItems.length / 2)].icon)
          ) : (
            <MenuIcon />
          )}
        </Fab>

        {navItems.slice(2, 4).map((item) => (
          <Tooltip key={item.path} title={item.label} placement="top">
            <BottomNavigationAction
              icon={getIcon(item.icon)}
              value={item.path}
              onClick={() => handleChange(null, item.path)}
              sx={{
                minWidth: "auto",
                px: 2,
                py: 1,
                color: isActive(item.path) ? activeColor : inactiveColor,
                "& .MuiSvgIcon-root": {
                  fontSize: 24,
                },
              }}
            />
          </Tooltip>
        ))}
      </Paper>
    </Box>
  );

  // Container with scroll animation
  const ContainerComponent = ({ children }) => {
    if (!animateOnScroll && !hideOnScroll) return children;

    return (
      <Zoom in={show} timeout={300}>
        <Box>{children}</Box>
      </Zoom>
    );
  };

  if (variant === "fab") {
    return (
      <ContainerComponent>
        <FabBottomNav />
      </ContainerComponent>
    );
  }

  return (
    <ContainerComponent>
      <Paper
        elevation={elevation}
        sx={{
          ...currentStyle.paper,
          borderTop:
            variant === "default"
              ? `1px solid ${theme.palette.divider}`
              : "none",
          backdropFilter: variant === "floating" ? "blur(10px)" : "none",
          bgcolor:
            variant === "floating"
              ? "rgba(255, 255, 255, 0.95)"
              : "background.paper",
          transition: "all 0.3s ease",
        }}
      >
        <BottomNavComponent />
      </Paper>
    </ContainerComponent>
  );
};

// Pre-configured variants for common use cases
export const DefaultBottomBar = (props) => (
  <BottomBar variant="default" {...props} />
);
export const FloatingBottomBar = (props) => (
  <BottomBar variant="floating" {...props} />
);
export const FABBottomBar = (props) => <BottomBar variant="fab" {...props} />;

// HOC for adding safe area insets (for mobile notches)
export const WithSafeArea = ({ children }) => (
  <Box sx={{ pb: { xs: "env(safe-area-inset-bottom)", sm: 0 } }}>
    {children}
  </Box>
);

export default BottomBar;
