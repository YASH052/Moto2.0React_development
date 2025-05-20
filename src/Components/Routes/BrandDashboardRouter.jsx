import React from 'react';
import { Navigate } from 'react-router-dom';
import BrandDashboard from '../Pages/Dashboard/BrandDashboard';
import RATBrandDashboard from '../Pages/Dashboard/RATBrandDashboard';

// Brand Dashboard configuration mapping user types to their respective dashboards
const brandDashboardConfig = {
  // RAT User Types
  RSM: RATBrandDashboard,
  ASM: RATBrandDashboard,
  TSM: RATBrandDashboard,
  
  // Default dashboard for all other user types
  DEFAULT: BrandDashboard,
};

const BrandDashboardRouter = () => {
  // Get user type from localStorage
  const userData = localStorage.getItem('log');
  const userType = userData ? JSON.parse(userData).userType : null;

  // Get the appropriate dashboard component based on user type
  const DashboardComponent = brandDashboardConfig[userType] || brandDashboardConfig.DEFAULT;

  return <DashboardComponent />;
};

export default BrandDashboardRouter; 