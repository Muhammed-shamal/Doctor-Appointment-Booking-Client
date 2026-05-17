import React, { useState } from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Popover,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider
} from '@mui/material';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Logout,
  RoomService,
  DesignServices,
  Person,
  Shop
} from '@mui/icons-material';

const BottomBar = ({navItems}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(location.pathname);

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1400 }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          navigate(newValue);
          setValue(newValue);
        }}
        showLabels
      >
        {navItems.map(({ path, icon, label }) => (
          <BottomNavigationAction
            sx={{ color: '#4a4b77' }}
            key={path}
            label={label}
            icon={icon}
            value={path}
          />
        ))}

      </BottomNavigation>
    </Paper>
  );
};

export default BottomBar;
