
import { Navigate, Outlet } from "react-router";

function ProtectedRoute() {
  const token = localStorage.getItem("careerbridge_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
