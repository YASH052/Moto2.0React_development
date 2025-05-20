import React from 'react';
import { Navigate } from 'react-router-dom';
import HoDashboard from '../Pages/Dashboard/HoDashboard';
import RATDashboard from '../Pages/Dashboard/RATDashboard';


// Dashboard configuration mapping user types to their respective dashboards
const dashboardConfig = {
  // RAT User Types
  RSM: RATDashboard,
  ASM: RATDashboard,
  TSM: RATDashboard,
  

  
  // Default dashboard for all other user types
  DEFAULT: HoDashboard,
  
  // New user type

};

const DashboardRouter = () => {
  // Get user type from localStorage
  const userData = localStorage.getItem('log');
  const userType = userData ? JSON.parse(userData).userType : null;

  // Get the appropriate dashboard component based on user type
  const DashboardComponent = dashboardConfig[userType] || dashboardConfig.DEFAULT;

  return <DashboardComponent />;
};

export default DashboardRouter; 