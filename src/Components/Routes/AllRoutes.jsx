import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Dashboard from '../Pages/Dashboard/Dashboard';

// Public Pages
import NotFound from '../Pages/NotFound/NotFound';
import LoginForm from '../Pages/Auth/Login/LoginForm';
import ForgotPasswordForm from '../Pages/Auth/ForgotPasswordForm';
import ResetPasswordForm from '../Pages/Auth/ResetPasswordForm';
import Reports from '../Pages/Componants/Reports';

// Private Pages
import TestCompo from '../Pages/NuralCustomComponents/TestCompo';

const AllRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/test" element={<TestCompo />} />

      </Route>

      {/* Private Routes */}
      {/* <Route element={<PrivateRoute />}> */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/Reports" element={<Reports />} />
      {/* </Route> */}

      {/* Default and Not Found Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AllRoutes;