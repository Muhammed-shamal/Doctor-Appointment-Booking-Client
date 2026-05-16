import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Group,
  Article,
  People,
  Feedback,
  DashboardOutlined,
} from "@mui/icons-material";
import {
  Grid,
  Card,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
} from "@mui/material";

import LoadingOverlay from "../../components/LoadingOverlay";
import { fetchDashboardData } from "./dashboardThunk";
import { useNavigate } from "react-router-dom";
import LiveClock from "../../components/Clock";
import Header from "../../components/Header";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, kpis, tables, error } = useSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Helper function to get correct count
  const getCount = (data, type) => {
    if (!data) return 0;

    switch (type) {
      case "enquiry":
        return data.totalEnquiries || 0;
      case "blog":
        return data.totalBlogs || 0;
      case "client":
        return data.totalClients || data.totalclients || 0;
      case "testimonial":
        return data.totalTestimonials || data.totaltestimonials || 0;
      default:
        return 0;
    }
  };

  if (error && !loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6" mb={2}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => dispatch(fetchDashboardData())}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      {/* Clock */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4} lg={3}>
          <LiveClock />
        </Grid>
      </Grid>

      <Header title="Dashboard Overview" icon={<DashboardOutlined />} />

      <Grid container spacing={3} mb={6} mt={3}>
        {/* Total Enquiries */}
        <Grid item xs={12} sm={6} md sx={{ flexGrow: 1 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "#E3F2FD",
              boxShadow: 3,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
            onClick={() => handleNavigate("/enquiry/list")}
          >
            <Box
              sx={{
                bgcolor: "#2196F3",
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
              <Group sx={{ color: "white", fontSize: 28 }} />
            </Box>

            <Typography variant="h3" fontWeight={700} color="#1976D2" mb={1}>
              {getCount(kpis, "enquiry")}
            </Typography>

            <Typography variant="h6" fontWeight={600} color="#1976D2">
              Total Enquiries
            </Typography>

            <Chip
              label="View All"
              size="small"
              color="primary"
              sx={{ mt: 1 }}
            />
          </Card>
        </Grid>

        {/* Total Blogs */}
        <Grid item xs={12} sm={6} md sx={{ flexGrow: 1 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "#F3E5F5",
              boxShadow: 3,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
            onClick={() => handleNavigate("/blog")}
          >
            <Box
              sx={{
                bgcolor: "#9C27B0",
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
              <Article sx={{ color: "white", fontSize: 28 }} />
            </Box>

            <Typography variant="h3" fontWeight={700} color="#7B1FA2" mb={1}>
              {getCount(kpis, "blog")}
            </Typography>

            <Typography variant="h6" fontWeight={600} color="#7B1FA2">
              Total Blogs
            </Typography>

            <Chip
              label="View All"
              size="small"
              color="primary"
              sx={{ mt: 1 }}
            />
          </Card>
        </Grid>

        {/* Total Clients */}
        <Grid item xs={12} sm={6} md sx={{ flexGrow: 1 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "#E8F5E8",
              boxShadow: 3,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
            onClick={() => handleNavigate("/client/list")}
          >
            <Box
              sx={{
                bgcolor: "#4CAF50",
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
              <People sx={{ color: "white", fontSize: 28 }} />
            </Box>

            <Typography variant="h3" fontWeight={700} color="#388E3C" mb={1}>
              {getCount(kpis, "client")}
            </Typography>

            <Typography variant="h6" fontWeight={600} color="#388E3C">
              Total Clients
            </Typography>

            <Chip
              label="View All"
              size="small"
              color="primary"
              sx={{ mt: 1 }}
            />
          </Card>
        </Grid>

        {/* Total Testimonials */}
        <Grid item xs={12} sm={6} md sx={{ flexGrow: 1 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "#FFF3E0",
              boxShadow: 3,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
            onClick={() => handleNavigate("/testimonial/list")}
          >
            <Box
              sx={{
                bgcolor: "#FF9800",
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
              <Feedback sx={{ color: "white", fontSize: 28 }} />
            </Box>

            <Typography variant="h3" fontWeight={700} color="#F57C00" mb={1}>
              {getCount(kpis, "testimonial")}
            </Typography>

            <Typography variant="h6" fontWeight={600} color="#F57C00">
              Total Testimonials
            </Typography>

            <Chip
              label="View All"
              size="small"
              color="primary"
              sx={{ mt: 1 }}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
