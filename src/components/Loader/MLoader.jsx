import React from 'react';
import {
  CircularProgress,
  Backdrop,
  Box,
  Typography,
  LinearProgress,
  Fade,
  Paper,
  keyframes,
  alpha,
  useTheme,
  Stack,
} from '@mui/material';
import {
  HourglassEmpty as HourglassIcon,
  Loop as LoopIcon,
  DonutLarge as DonutIcon,
} from '@mui/icons-material';

// Animations
const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;


const MLoadingOverlay= ({
  loading,
  message = 'Loading...',
  variant = 'circular',
  size = 'small',
  blur = true,
  backdropColor,
  loaderColor,
  showProgress = false,
  progress = 0,
  determinate = false,
  children,
  minDisplayTime,
  onClose,
  sx,
}) => {
  const theme = useTheme();
  const [showLoader, setShowLoader] = React.useState(loading);
  const timerRef = React.useRef(null);
  React.useEffect(() => {
    if (loading) {
      setShowLoader(true);
    } else {
      if (minDisplayTime) {
        timerRef.current = setTimeout(() => {
          setShowLoader(false);
        }, minDisplayTime);
      } else {
        setShowLoader(false);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [loading, minDisplayTime]);

  const getSizeValue = () => {
    switch (size) {
      case 'small':
        return { loader: 24, icon: 20, text: 'body2', spacing: 1 };
      case 'large':
        return { loader: 56, icon: 40, text: 'h6', spacing: 2 };
      default:
        return { loader: 40, icon: 30, text: 'body1', spacing: 1.5 };
    }
  };

  const sizeValues = getSizeValue();

  const renderLoader = () => {
    const loaderProps = {
      size: sizeValues.loader,
      thickness: size === 'small' ? 3.6 : 4,
      sx: {
        color: loaderColor || theme.palette.primary.main,
        ...(variant === 'spinner' && {
          animation: `${rotate} 1.2s linear infinite`,
        }),
      },
    };

    switch (variant) {
      case 'linear':
        return (
          <Box sx={{ width: '100%', maxWidth: 300 }}>
            {determinate ? (
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: size === 'small' ? 4 : size === 'large' ? 8 : 6,
                  borderRadius: 4,
                  backgroundColor: alpha(loaderColor || theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: loaderColor || theme.palette.primary.main,
                    borderRadius: 4,
                  },
                }}
              />
            ) : (
              <LinearProgress
                sx={{
                  height: size === 'small' ? 4 : size === 'large' ? 8 : 6,
                  borderRadius: 4,
                  backgroundColor: alpha(loaderColor || theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: loaderColor || theme.palette.primary.main,
                    borderRadius: 4,
                  },
                }}
              />
            )}
            {showProgress && determinate && (
              <Typography
                variant="caption"
                sx={{ mt: 1, display: 'block', textAlign: 'center', color: 'white' }}
              >
                {Math.round(progress)}%
              </Typography>
            )}
          </Box>
        );

      case 'dots':
        return (
          <Stack direction="row" spacing={1}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: sizeValues.loader / 3,
                  height: sizeValues.loader / 3,
                  borderRadius: '50%',
                  backgroundColor: loaderColor || theme.palette.primary.main,
                  animation: `${bounce} 1.4s infinite ease-in-out`,
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            ))}
          </Stack>
        );

      case 'pulse':
        return (
          <Box
            sx={{
              width: sizeValues.loader,
              height: sizeValues.loader,
              borderRadius: '50%',
              backgroundColor: alpha(loaderColor || theme.palette.primary.main, 0.3),
              animation: `${pulse} 1.5s infinite ease-in-out`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&::after': {
                content: '""',
                width: sizeValues.loader * 0.6,
                height: sizeValues.loader * 0.6,
                borderRadius: '50%',
                backgroundColor: loaderColor || theme.palette.primary.main,
              },
            }}
          />
        );

      case 'spinner':
        return (
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              {...loaderProps}
              variant={determinate ? 'determinate' : 'indeterminate'}
              value={determinate ? progress : undefined}
            />
            {children && (
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {children}
              </Box>
            )}
          </Box>
        );

      default:
        return (
          <CircularProgress
            {...loaderProps}
            variant={determinate ? 'determinate' : 'indeterminate'}
            value={determinate ? progress : undefined}
          />
        );
    }
  };

  const renderIconLoader = () => {
    switch (variant) {
      case 'circular':
        return <HourglassIcon sx={{ fontSize: sizeValues.icon, animation: `${rotate} 2s infinite` }} />;
      case 'linear':
        return <LoopIcon sx={{ fontSize: sizeValues.icon, animation: `${rotate} 1.5s infinite linear` }} />;
      case 'dots':
        return <DonutIcon sx={{ fontSize: sizeValues.icon, animation: `${rotate} 1.2s infinite linear` }} />;
      default:
        return null;
    }
  };

  if (!showLoader) return null;

  return (
    <Backdrop
      open={showLoader}
      onClick={onClose}
      sx={{
        zIndex: theme.zIndex.drawer + 2,
        color: '#fff',
        backdropFilter: blur ? 'blur(8px)' : 'none',
        backgroundColor: backdropColor || alpha(theme.palette.common.black, 0.7),
        display: 'flex',
        flexDirection: 'column',
        gap: sizeValues.spacing,
        ...sx,
      }}
    >
      <Fade in={showLoader} timeout={500}>
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.background.paper, 0.1),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: sizeValues.spacing,
            minWidth: 200,
          }}
        >
          {/* Main Loader */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: sizeValues.loader }}>
            {renderLoader()}
            {renderIconLoader()}
          </Box>

          {/* Message */}
          {message && (
            <Typography
              variant={sizeValues.text}
              sx={{
                color: '#fff',
                fontWeight: 500,
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                maxWidth: 300,
              }}
            >
              {message}
            </Typography>
          )}

          {/* Custom Content */}
          {children && !variant?.includes('spinner') && (
            <Box sx={{ mt: 1 }}>{children}</Box>
          )}
        </Paper>
      </Fade>
    </Backdrop>
  );
};

// Preset configurations for common use cases
export const MFullScreenLoader = ({
  loading,
  message = 'Loading...',
}) => (
  <MLoadingOverlay
    loading={loading}
    message={message}
    variant="spinner"
    size="large"
    blur={true}
  />
);

export const MButtonLoader = ({
  loading,
  size = 'small',
}) => (
  <MLoadingOverlay
    loading={loading}
    variant="circular"
    size={size}
    blur={false}
    backdropColor="transparent"
  />
);

export const MProgressLoader= ({ loading, progress, message = 'Uploading...', determinate = true }) => (
  <MLoadingOverlay
    loading={loading}
    message={message}
    variant="linear"
    showProgress={true}
    progress={progress}
    determinate={determinate}
  />
);

export const MPageLoader = ({
  loading,
  message = 'Loading page...',
}) => (
  <MLoadingOverlay
    loading={loading}
    message={message}
    variant="pulse"
    size="large"
    blur={true}
  />
);

export default MLoadingOverlay;