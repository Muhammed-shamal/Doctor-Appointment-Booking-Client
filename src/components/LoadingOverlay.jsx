import { CircularProgress, Backdrop } from "@mui/material";

const LoadingOverlay = ({ loading }) => {
    return (
        <Backdrop
            open={loading}
            sx={{ zIndex: 1301, color: "#fff", backdropFilter: "blur(5px)" }}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default LoadingOverlay;
