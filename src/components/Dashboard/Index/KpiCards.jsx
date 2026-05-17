import { Box, Card, Typography, useTheme, alpha } from "@mui/material";

export const KPICard = ({ label, count, icon, color, onClick }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "background.paper",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${alpha(color, 0.1)}`,
        "&:hover": onClick
          ? {
              borderColor: alpha(color, 0.3),
              boxShadow: `0 8px 20px ${alpha(color, 0.15)}`,
              transform: "translateY(-2px)",
            }
          : {},
      }}
      onClick={onClick}
    >
      {/* Gradient Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100px",
          height: "100px",
          background: `radial-gradient(circle, ${alpha(color, 0.08)} 0%, transparent 70%)`,
          borderRadius: "50%",
          transform: "translate(30px, -30px)",
        }}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Icon Circle */}
        <Box
          sx={{
            bgcolor: alpha(color, 0.1),
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            "& svg": {
              fontSize: 24,
              color: color,
            },
          }}
        >
          {icon}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              color: color,
              lineHeight: 1.2,
              mb: 0.25,
            }}
          >
            {count?.toLocaleString() || 0}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{
              color: "text.secondary",
              letterSpacing: "0.3px",
            }}
          >
            {label}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};