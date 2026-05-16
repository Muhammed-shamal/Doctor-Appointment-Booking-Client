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
  ErrorOutlineOutlined, 
  Home, 
  SentimentDissatisfied,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
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
        // background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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
          background: '#fff',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #2196f3, #e91e63)',
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
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
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
            backgroundColor: 'rgba(233, 30, 99, 0.1)',
            zIndex: 0,
          }}
        />
        
        <Box position="relative" zIndex={1}>
          {/* 404 Icon */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <ErrorOutlineOutlined
              sx={{ 
                fontSize: 80, 
                color: 'error.main',
                mr: 1
              }} 
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 80, sm: 100 },
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196f3 30%, #e91e63 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              404
            </Typography>
          </Box>

          {/* Title */}
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              color: 'text.primary'
            }}
          >
            Oops! Page Not Found
          </Typography>

          {/* Description */}
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 4,
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}
          >
            <SentimentDissatisfied sx={{ verticalAlign: 'middle', mr: 1 }} />
            Sorry, the page you're looking for doesn't exist or has been moved.
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
                '&:hover': {
                  borderWidth: 2,
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
                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
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

export default NotFound;