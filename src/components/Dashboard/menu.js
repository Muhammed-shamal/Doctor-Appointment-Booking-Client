import { BookOnlineOutlined, Home, LocalHospital, Timeline } from "@mui/icons-material";

export const getMenu = (userType) => {
  return {
    staticMenu:
      userType == "admin"
        ? [
            {
              id: 1,
              label: "Home",
              icon: Home,
              path: "/dashboard",
            },

            {
              id: 2,
              label: "Doctors",
              icon: LocalHospital,
              path: "/doctors/list",
            },
            {
              id: 3,
              label: "Schedules",
              icon: Timeline,
              path: "/schedules/list",
            },

            {
              id: 4,
              label: "Appointments",
              icon: BookOnlineOutlined,
              path: "/appointments/list",
            },

          ]
        : [
            {
              id: 1,
              label: "Home",
              icon: Home,
              path: "/dashboard",
            },

            {
              id: 4,
              label: "My Appointments",
              icon: BookOnlineOutlined,
              path: "/appointments/list",
            },
          ],
  };
};
