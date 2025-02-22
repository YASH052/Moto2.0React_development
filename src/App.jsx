import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import AllRoutes from "./Components/Routes/AllRoutes";
import Sidebar from "./Components/Pages/Sidebar/Sidebar";

function AppContent() {
  const location = useLocation();
  const hideSidebarRoutes = ["/login", "/login1"];

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {!hideSidebarRoutes.includes(location.pathname.toLowerCase()) && (
        <Sidebar sx={{ flexShrink: 0, width: "250px" }} />
      )}
      <Box sx={{ flexGrow: 1, width: "100%", overflowY: "auto" }}>
        <AllRoutes />
      </Box>
    </Box>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
