import React from "react";
import { Navigate } from "react-router-dom";
import { useFavorites } from "./FavoritesContext.jsx";
import { ADMIN_EMAIL } from "../utils/admin.js";

const AdminRoute = ({ children }) => {
  const { user, loading } = useFavorites();

  if (loading) return null;

  return user && user.email === ADMIN_EMAIL ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
