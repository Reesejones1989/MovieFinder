import React from "react";
import { Navigate } from "react-router-dom";
import { useFavorites } from "./FavoritesContext.jsx";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useFavorites();

  if (loading) return null;

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
