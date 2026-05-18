import {
  BookOnlineOutlined,
  Home,
  LocalHospital,
  PeopleAltOutlined,
  Timeline,
} from "@mui/icons-material";

const MENU_CONFIG = {
  admin: [
    { id: 1, label: "Home", icon: Home, path: "/dashboard" },
    { id: 2, label: "Doctors", icon: LocalHospital, path: "/doctors/list" },
    { id: 3, label: "Schedules", icon: Timeline, path: "/schedules/list" },
    {
      id: 4,
      label: "Appointments",
      icon: BookOnlineOutlined,
      path: "/appointments/list",
    },
    {
      id: 5,
      label: "Patients",
      icon: PeopleAltOutlined,
      path: "/patients/list",
    },
  ],

  patient: [
    { id: 1, label: "Home", icon: Home, path: "/dashboard" },
    { id: 2, label: "Doctors", icon: LocalHospital, path: "/doctors/list" },
    {
      id: 3,
      label: "My Appointments",
      icon: BookOnlineOutlined,
      path: "/appointments/list",
    },
  ],
};

export const getMenu = (role = "patient") => {
  console.log('role is',role);
  return MENU_CONFIG[role] || MENU_CONFIG.patient;
};