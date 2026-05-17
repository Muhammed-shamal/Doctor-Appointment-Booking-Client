import { 
  Box, 
  Typography, 
  Button, 
  Stack, 
  Paper,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { 
  ArrowBack, 
  LockOutlined, 
  Home,
  Warning
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.light}15 100%)`,
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 3, sm: 5 },
          maxWidth: 600,
          width: '100%',
          borderRadius: 4,
          textAlign: 'center',
          background: theme.palette.background.paper,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
          }
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: `${theme.palette.warning.main}15`,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 250,
            height: 250,
            borderRadius: '50%',
            backgroundColor: `${theme.palette.error.main}10`,
            zIndex: 0,
          }}
        />
        
        <Box position="relative" zIndex={1}>
          {/* 403 Icon */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <LockOutlined
              sx={{ 
                fontSize: 60, 
                color: theme.palette.warning.main,
                mr: 1
              }} 
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 60, sm: 80 },
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${theme.palette.warning.main} 30%, ${theme.palette.error.main} 90%)`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              403
            </Typography>
          </Box>

          {/* Title */}
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              color: theme.palette.text.primary
            }}
          >
            Access Denied
          </Typography>

          {/* Description */}
          <Typography 
            variant="body1" 
            color={theme.palette.text.secondary} 
            sx={{ 
              mb: 4,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              lineHeight: 1.6
            }}
          >
            <Warning sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem' }} />
            You don't have permission to access this resource. 
            Please contact your administrator if you believe this is a mistake.
          </Typography>

          {/* Action Buttons */}
          <Stack 
            direction={isMobile ? "column" : "row"} 
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: 3,
                py: 1.2,
                textTransform: 'none',
                fontWeight: 'bold',
                borderWidth: 2,
                color: theme.palette.text.primary,
                borderColor: theme.palette.divider,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: `${theme.palette.action.hover}`,
                }
              }}
            >
              Go Back
            </Button>

            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              sx={{
                borderRadius: 3,
                py: 1.2,
                textTransform: 'none',
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                boxShadow: `0 3px 5px 2px ${theme.palette.primary.main}30`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                }
              }}
            >
              Go to Homepage
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Unauthorized;