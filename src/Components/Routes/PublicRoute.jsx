import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  // Replace this with your actual authentication logic
  const isAuthenticated = localStorage.getItem('token') !== null;

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default PublicRoute; 