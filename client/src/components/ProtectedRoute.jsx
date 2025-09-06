// client/src/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute() {
  const { isChecking, isAuthed } = useAuth();
  const loc = useLocation();

  if (isChecking) {
    return <div className="p-6 text-center">Checking session...</div>;
  }

  if (!isAuthed) {
    return <Navigate to="/admin/login" replace state={{ from: loc }} />;
  }

  return <Outlet />;
}