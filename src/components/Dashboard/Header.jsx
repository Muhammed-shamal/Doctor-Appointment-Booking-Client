import PropTypes from 'prop-types';
import { AppBar, Toolbar, IconButton, Box, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../../hooks/use-responsive';
// import NotificationsPopover from './notificationPopover';
import { MenuBook } from '@mui/icons-material';

const NAV_WIDTH = 280;
const HEADER_HEIGHT_MOBILE = 50;
const HEADER_HEIGHT_DESKTOP = 60;

export default function Header({ onOpenNav }) {
  const theme = useTheme();
  const lgUp = useResponsive('up', 'lg');

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1, color: 'text.primary' }}>
          <MenuBook />
        </IconButton>
      )}

      {/* You can add Searchbar or Logo here */}

      <Box sx={{ flexGrow: 1 }} />

      {/* <Stack direction="row" alignItems="center" spacing={1.5}>
        <NotificationsPopover />
        <AccountPopover />
      </Stack> */}
    </>
  );

  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(6px)',
        height: HEADER_HEIGHT_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV_WIDTH}px)`,
          height: HEADER_HEIGHT_DESKTOP,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { xs: 2, lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
