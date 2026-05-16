import { Stack, Box, Typography, useTheme } from "@mui/material";

export default function Header({
  title,
  subtitle,
  icon,
  action,
  bg,
  count,
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: 3,
        px: { xs: 2, sm: 4 },
        py: { xs: 2.5, sm: 3 },
        borderRadius: 2,
        background:
          bg ||
          `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      {/* Left Side */}
      <Stack direction="row" alignItems="center" spacing={2}>
        {icon && (
          <Box
            sx={{
              color: "white",
              display: "flex",
              alignItems: "center",
              bgcolor: "rgba(255,255,255,0.15)",
              p: 1.2,
              borderRadius: 2,
            }}
          >
            {icon}
          </Box>
        )}

        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            color="white"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {title}
            {typeof count === "number" && (
              <Box
                sx={{
                  px: 1.3,
                  py: 0.3,
                  borderRadius: 1,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "white",
                }}
              >
                Total: {count}
              </Box>
            )}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.9)",
                mt: 0.4,
                maxWidth: 400,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>

      {/* Right Side */}
      {action && (
        <Box
          sx={{
            mt: { xs: 2, sm: 0 },
            display: "flex",
            alignItems: "center",
          }}
        >
          {action}
        </Box>
      )}
    </Box>
  );
}
