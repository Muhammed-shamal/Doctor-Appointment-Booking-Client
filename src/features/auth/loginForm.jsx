import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  InputAdornment,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Person
} from '@mui/icons-material';
import {  useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './authThunks';
import logo from '../../assets/logos/logo1.png'
import bgImage from "../../assets/images/bg3.jpg";
import WSButton from '../../components/WS/Buttons/WSButton';
import WSTextField from '../../components/WS/TextBox/WSTextField';
import { TextType } from '../../components/WS/TextBox/types';

const Login = () => {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
  } = useForm();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `url(${bgImage}) no-repeat bottom`,
          backgroundSize: 'cover',
          opacity: 0.8
        }
      }}
    >
      <Fade in timeout={800}>
        <Card
          elevation={10}
          sx={{
            width: isSmallScreen ? '100%' : 450,
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: theme.palette.custom.glassShadow,
            background: theme.palette.background.paper,
            backdropFilter: 'blur(10px)',
            border: `1px solid  ${theme.palette.custom.glassBorder}`
          }}
        >
          <Box
            sx={{
              background: theme.gradients.cardHeader, 
              py: 2,
              textAlign: 'center'
            }}
          >
            <Avatar
              src={logo}
              sx={{
                mx: 'auto',
                width: 70,
                height: 70,
                border: '4px solid white',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            />
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h4" fontWeight="bold" gutterBottom color="error">
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to continue to your account
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Email Field */}
              <WSTextField
                name="email"
                startSuffix={<Email color="action" />}
                control={control}
                label={"Email Address"}
                type={TextType.Email}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Enter a valid email',
                  },
                }} sx={{
                  marginBottom: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover fieldset': {
                      borderColor: theme.palette.custom.border,
                    },
                  }
                }}
                isCapital={false}
              />

              {/* Password Field */}
              <WSTextField name="password" label={"Password"}
                control={control}
                type={showPassword ? TextType.Text : TextType.Password}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Minimum 6 characters required',
                  },
                }}
                suffix={<IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover fieldset': {
                      borderColor: theme.palette.custom.border,
                    },
                  }
                }} isCapital={false}/>

              {/* Forgot Password Link */}
              {/* <Box textAlign="right" mt={1}>
                <Button 
                  variant="text" 
                  size="small" 
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Forgot Password?
                </Button>
              </Box> */}

              {/* Submit Button */}
              <WSButton loading={loading} label={loading ? "Signing in..." : "Sign In"}
                type="submit" size="large"
                variant="contained" startIcon={!loading && <Person />}
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: 'bold',
                  borderRadius: 2,
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  }
                }} fullWidth />
            </form>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default Login;