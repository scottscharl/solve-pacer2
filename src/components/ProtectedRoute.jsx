import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { usePocket } from "../hooks";

function ProtectedRoute() {
  const { user } = usePocket();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
