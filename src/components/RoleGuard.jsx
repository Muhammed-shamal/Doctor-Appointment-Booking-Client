import { Navigate } from "react-router-dom";

const RoleGuard = ({
  allowed = false,
  children,
  fallback = null,
  redirectTo = "/unauthorized",
}) => {
  // If allowed → render content
  if (allowed) {
    return children;
  }

  // If fallback exists → render fallback
  if (fallback) {
    return fallback;
  }

  // Otherwise redirect
  return <Navigate to={redirectTo} replace />;
};

export default RoleGuard;