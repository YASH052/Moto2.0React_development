import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Replace this with your actual authentication logic
  const isAuthenticated = sessionStorage.getItem('token') !== null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute; 