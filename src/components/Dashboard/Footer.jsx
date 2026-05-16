import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py:2,
        mt: 'auto',
        backgroundColor: '#f5f7fa',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          align="center"
          sx={{ color: '#666', fontSize: '0.875rem' }}
        >
          © {currentYear} Curious Cat.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
