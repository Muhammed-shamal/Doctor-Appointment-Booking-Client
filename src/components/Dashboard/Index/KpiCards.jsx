import { Box, Card, Typography } from "@mui/material";

export const KPICard = ({ label, count, icon, color, bgColor, onClick }) => (
  <Card
    sx={{
      p: 3,
      borderRadius: 4,
      bgcolor: bgColor,
      boxShadow: 3,
      textAlign: "center",
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.2s",
      "&:hover": onClick ? { transform: "translateY(-4px)" } : {},
    }}
    onClick={onClick}
  >
    <Box
      sx={{
        bgcolor: color,
        width: 60,
        height: 60,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 2,
        mx: "auto",
      }}
    >
      {icon}
    </Box>
    <Typography variant="h3" fontWeight={700} sx={{ color }}>
      {count || 0}
    </Typography>
    <Typography variant="h6" fontWeight={600} sx={{ color }}>
      {label}
    </Typography>
  </Card>
);
