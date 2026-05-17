import {
  AppBar,
  Box,
  Stack,
  Toolbar,
  Typography,
  useTheme,
  Tooltip,
  IconButton,
} from "@mui/material";
import { MoreVertOutlined } from "@mui/icons-material";
import AccountPopover from "./accountPopover";
import { getLocalValue, LoacalVariables } from "../../common/commonFunction";
import { useSelector } from "react-redux";

const Navbar = ({ collapse, drawerWidth = 240, backgroundColor }) => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);

  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${!collapse ? drawerWidth : 80}px)` },
        ml: { sm: `${!collapse ? drawerWidth : 80}px` },
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        transition: theme.transitions.create(["width", "margin-left"], {
          duration: theme.transitions.duration.shortest,
          easing: theme.transitions.easing.easeInOut,
        }),
      }}
    >
      <Toolbar
        sx={{
          px: { xs: 2, sm: 3 },
          py: 1.2,
          minHeight: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* User Info Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flex: 1,
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #47A065 0%, #6BC58A 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(71, 160, 101, 0.3)",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "16px",
                color: "#1F2937",
                lineHeight: 1.2,
              }}
            >
              {user?.name || "User"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "13px",
                mt: 0.5,
                color: "#9CA3AF",
                textTransform: "capitalize",
              }}
            >
              {user?.address || "Welcome back"}
            </Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            ml: "auto",
          }}
        >
          <AccountPopover />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
