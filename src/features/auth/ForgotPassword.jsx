import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Button,
    Avatar,
    alpha,
    useTheme,
    Stack,
    Alert,
    CircularProgress,
    Paper,
    Link
} from "@mui/material";
import {
    LockReset as LockResetIcon,
    Email as EmailIcon,
    CheckCircle as CheckCircleIcon,
    ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import MButton from "../../components/Buttons/MBtn";
import MTextField from "../../components/TextBox/MTextField";
import { TextType } from "../../components/TextBox/types";

const ForgotPassword= ({
    open,
    onClose,
    onSubmit
}) => {

    const {
        control,
        handleSubmit,
        getValues,
        reset,
    } = useForm({
        mode: "onChange",
        defaultValues: {
            email: "",
        },
    });

    const { email } = getValues();
    const theme = useTheme();

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleData = async () => {

        if (!email) {
            setError("Email is required");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setError("");
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            onSubmit(email);
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    const handleClose = () => {
        if (!loading) {
            setSubmitted(false);
            setError("");
            onClose();
            reset();
        }
    };

    const handleBack = () => {
        setSubmitted(false);
        setError("");
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.2)}`,
                }
            }}
        >
            {/* Header with gradient */}
            <Box
                sx={{
                    height: 120,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Avatar
                    sx={{
                        width: 70,
                        height: 70,
                        bgcolor: "white",
                        color: theme.palette.primary.main,
                        boxShadow: `0 10px 20px ${alpha(theme.palette.common.black, 0.2)}`,
                        position: "absolute",
                        bottom: -35,
                    }}
                >
                    {submitted ? (
                        <CheckCircleIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
                    ) : (
                        <LockResetIcon sx={{ fontSize: 40 }} />
                    )}
                </Avatar>
            </Box>

            <DialogContent sx={{ pt: 5, pb: 3, px: 4 }}>
                {!submitted ? (
                    <>
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{
                                mb: 1,
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                            }}
                        >
                            Forgot Password?
                        </Typography>

                        <Typography
                            variant="body2"
                            align="center"
                            color="text.secondary"
                            sx={{ mb: 4 }}
                        >
                            No worries! Enter your email address below and we'll send you a link to reset your password.
                        </Typography>

                        {error && (
                            <Alert
                                severity="error"
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                    '& .MuiAlert-icon': {
                                        alignItems: 'center'
                                    }
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        <MTextField
                            id="reset-email"
                            label="Email Address"
                            type={TextType.Text}
                            name="email"
                            control={control}
                            textIcon="Email"
                            disabled={loading}
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover': {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme.palette.primary.main,
                                        }
                                    }
                                }
                            }}
                        />

                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                            We'll send a password reset link to this email address
                        </Typography>
                    </>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{
                                mb: 1,
                                fontWeight: 700,
                                color: theme.palette.success.main,
                            }}
                        >
                            Check Your Email
                        </Typography>

                        <Typography
                            variant="body1"
                            align="center"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            We've sent a password reset link to:
                        </Typography>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                mb: 5
                            }}
                        >
                            <EmailIcon sx={{ color: theme.palette.primary.main }} />
                            <Typography variant="body2" fontWeight={600}>
                                {email}
                            </Typography>
                        </Paper>

                        <Typography variant="body2" color="text.secondary">
                            Didn't receive the email? Check your spam folder or{' '}
                            <Link
                                component="button"
                                onClick={handleBack}
                                sx={{
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    }
                                }}
                            >
                                try again
                            </Link>
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
                {!submitted ? (
                    <>
                        <MButton
                            id="cancelReset"
                            variant="outlined"
                            onClick={handleClose}
                            disabled={loading}
                            color="primary"
                            size="small"
                            label="Cancel"
                        />
                        <MButton
                            id="sendResetLink"
                            variant="contained"
                            onClick={handleSubmit(handleData)}
                            disabled={!email || loading}
                            label={"Send Reset Link"}
                            color="primary"
                            size="small"
                            loading={loading}
                        />
                    </>
                ) : (
                    <MButton
                        id="backToLogin"
                        variant="contained"
                        onClick={handleClose}
                        color="primary"
                        size="small"
                        startIcon={<ArrowBackIcon />}
                        label="Back to Login"
                    />
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ForgotPassword;