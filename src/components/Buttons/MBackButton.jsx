import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const WSBackButton = ({ fallback = -1, label = "Back" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof fallback === "string") {
      navigate(fallback); // go to a specific route
    } else {
      navigate(fallback); // go back by steps (default -1)
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={handleBack}
      size="small"
      sx={{
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 500,
        px: 2,
        py: 1,
      }}
    >
      {label}
    </Button>
  );
};

export default WSBackButton;