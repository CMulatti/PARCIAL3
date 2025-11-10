import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requireAdmin = false }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userRole = localStorage.getItem("userRole");
  
  //if not authenticated at all, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If route requires admin and user is not admin, redirect to homepage
  if (requireAdmin && userRole !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default ProtectedRoute;