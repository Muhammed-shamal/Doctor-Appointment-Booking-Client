import { Home } from "@mui/icons-material";

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
          ]
        : [
            {
              id: 1,
              label: "Home",
              icon: Home,
              path: "/dashboard",
            },
          ],
  };
};
