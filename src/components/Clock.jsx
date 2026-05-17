import React, { useState, useEffect } from 'react';
import { Card, Typography, Box, alpha, useTheme, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const LiveClock = ({ variant = 'default' }) => {
    const theme = useTheme();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = time.toLocaleTimeString('en-IN', { 
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const formatDate = time.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });

    if (variant === 'compact') {
        return (
            <Card
                sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                        <Typography variant="h6" fontWeight={700} fontFamily="monospace">
                            {formatTime}
                        </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon sx={{ color: theme.palette.text.secondary, fontSize: 16 }} />
                        <Typography variant="body2" color="text.secondary">
                            {formatDate}
                        </Typography>
                    </Box>
                </Box>
            </Card>
        );
    }

    // Default premium version
    return (
        <Card
            sx={{
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: 'all 0.3s ease',
            }}
        >
            <Box sx={{ textAlign: 'center' }}>
                <Typography
                    variant="caption"
                    sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        display: 'inline-block',
                        mb: 2,
                    }}
                >
                    CURRENT TIME
                </Typography>
                
                <Typography
                    variant="h2"
                    fontWeight={800}
                    fontFamily="monospace"
                    sx={{
                        mb: 1,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    {formatTime}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    {time.toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                    })}
                </Typography>
            </Box>
        </Card>
    );
};

export default LiveClock;