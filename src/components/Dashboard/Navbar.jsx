import {
    AppBar,
    Box,
    Divider,
    Stack,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import AccountPopover from "./accountPopover";
import { getLocalValue, LoacalVariables } from "../../common/commonFunction";


const Navbar = ({
    collapse,
    drawerWidth = 240,
    backgroundColor,
}) => {

    const theme = useTheme();
    const userAddress = getLocalValue(LoacalVariables.Address)
    const userName = getLocalValue(LoacalVariables.Name)

    return (
        <AppBar
            elevation={0}
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${!collapse ? drawerWidth : 0}px)` },
                ml: { sm: `${!collapse ? drawerWidth : 0}px` },
                color: "black",
                backgroundColor: backgroundColor,
                // backdropFilter: 'blur(6px)',
                transition: theme.transitions.create(['height'], {
                    duration: theme.transitions.duration.shorter,
                }),
            }}
        >
            <Toolbar sx={{ px: 3 }}>
                {/* Collapse Sidebar Button */}

                {/* Title */}
                <Box sx={{ ml: collapse ? 13 : 8, transition: 'margin-left 0.4s ease' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold' }}
                    >
                        {userName}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ fontSize: '14px', mt: 0.5, color: "black" }}
                    >
                        {userAddress}
                    </Typography>
                </Box>

                {/* Right Section */}
                <Stack direction="row" alignItems="center" ml={'auto'} spacing={1.5}>
                    {/* <NotificationsPopover /> */}
                    <AccountPopover />
                </Stack>
            </Toolbar>
            <Divider />
        </AppBar>
    );
};

export default Navbar;
