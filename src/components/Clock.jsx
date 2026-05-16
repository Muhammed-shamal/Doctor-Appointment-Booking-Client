import React, { useState, useEffect } from 'react';
import { Card, Typography, Stack, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const LiveClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = time.toLocaleTimeString('en-IN', { hour12: true });
    const formatDate = time.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <Box sx={{
            p: 2, textAlign: 'center',mb:3
        }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" mb={1}>
                <AccessTimeIcon sx={{ color: '#3f51b5' }} />
                <Typography variant="h6" fontWeight={600}>Live Time</Typography>
            </Stack>
            <Typography variant="h4" fontFamily="monospace">{formatTime}</Typography>
            <Typography variant="body2" color="text.secondary">{formatDate}</Typography>
        </Box>
    );
};

export default LiveClock;
