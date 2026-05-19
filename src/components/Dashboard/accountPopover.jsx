import { useState } from "react";

import Box from "@mui/material/Box";
import { Menu } from "@mui/material";

import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { account } from "../../_mock/account";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../context/SnackBar";
import photo from "../../assets/vite.svg";
import { logoutUser } from "../../features/auth/authThunks";

export default function AccountPopover() {
  const dispatch = useDispatch();
  const Toast = useToast();
  const [open, setOpen] = useState(null);

  const { user } = useSelector((state) => state.auth);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);

      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
        }}
      >
        <Box
          sx={{
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box width={60} height={40}>
            <Box
              component="img"
              src={photo}
              alt={account.displayName}
              width={40}
              height={40}
              style={{ transition: "all 0.3s ease-in-out" }}
            />
          </Box>
        </Box>
      </IconButton>

      <Menu
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user.name || account.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user.email || account.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed", m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: "body2", color: "error.main", py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
