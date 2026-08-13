import { Navigate } from "react-router-dom";
import { getRole } from "../utils/jwtUtils";

function AdminRoute({ children }) {

  const role = getRole();

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;