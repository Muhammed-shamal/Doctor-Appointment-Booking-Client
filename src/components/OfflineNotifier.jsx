import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function OfflineNotifier() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <Snackbar open={isOffline} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert severity="error" sx={{ width: '100%' }}>
        You are currently offline!
      </Alert>
    </Snackbar>
  );
}
