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
// import { FaMapSigns, FaProductHunt } from 'react-icons/fa';

const BottomBar = ({navItems}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(location.pathname);

  // const [notificationAnchor, setNotificationAnchor] = useState(null);
  // const [profileAnchor, setProfileAnchor] = useState(null);
  // const [masterAnchor, setMasterAnchor] = useState(null);

  // const notifications = [
  //   { id: 1, text: 'New order received' },
  //   { id: 2, text: 'Your profile was updated' },
  //   { id: 3, text: 'Server maintenance scheduled' }
  // ];

  // const handleProfileClick = (event) => setProfileAnchor(event.currentTarget);
  // const handleMastersClick = (event) => setMasterAnchor(event.currentTarget);
  // const handleClose = () => {
  //   setNotificationAnchor(null);
  //   setProfileAnchor(null);
  //   setMasterAnchor(null);
  // };

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

        {/* Masters */}
        {/* <BottomNavigationAction
          sx={{ color: '#4a4b77' }}
          label="Masters"
          icon={<DesignServices sx={{ width: 24, height: 24 }} />}
          onClick={handleMastersClick}
        /> */}

        {/* Profile */}
        {/* <BottomNavigationAction
          sx={{ color: '#4a4b77' }}
          label="Profile"
          icon={<Avatar sx={{ width: 24, height: 24 }} />}
          onClick={handleProfileClick}
        /> */}
      </BottomNavigation>

      {/* Masters Popover */}
      {/* <Popover
        open={Boolean(masterAnchor)}
        anchorEl={masterAnchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <List sx={{ width: 180 }}>
          <ListItem component={Link} to="/user/registration">
            <Person sx={{ marginRight: 1 }} />
            <ListItemText primary="User" />
          </ListItem>
          <Divider />
          <ListItem component={Link} to="/franchise/list">
            <Shop sx={{ marginRight: 1 }} color="error" />
            <ListItemText primary="Franchise" />
          </ListItem>
           
          <ListItem component={Link} to="/service/list">
            <RoomService sx={{ marginRight: 1 }} />
            <ListItemText primary="Service" />
          </ListItem>
          <ListItem component={Link} to="/add-on-service/list">
            <DesignServices sx={{ marginRight: 1 }} />
            <ListItemText primary="Add On Service" />
          </ListItem>
           
        </List>
      </Popover> */}

      {/* Profile Popover */}
      {/* <Popover
        open={Boolean(profileAnchor)}
        anchorEl={profileAnchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <List sx={{ width: 150 }}>
          <Divider />
          <ListItem component={Link} to="/logOut">
            <Logout sx={{ marginRight: 1 }} color="error" />
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Popover> */}
    </Paper>
  );
};

export default BottomBar;
