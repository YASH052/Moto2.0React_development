import React from "react";
import { BrowserRouter, useLocation, useRoutes } from "react-router-dom";
import { Box } from "@mui/material";
import ALL_ROUTES from "./Components/Routes/AllRoutes";
import Sidebar from "./Components/Pages/Sidebar/Sidebar";

function AppContent() {
  const location = useLocation();
  const hideSidebarRoutes = ["/login", "/login1", "/forgot-password","/reset-password"];

  const element = useRoutes(ALL_ROUTES());

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {!hideSidebarRoutes.includes(location.pathname.toLowerCase()) && (
        <Sidebar sx={{ flexShrink: 0, width: "250px" }} />
      )}
      <Box sx={{ flexGrow: 1, width: "100%", overflowY: "auto" }}>
        {element}
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


{/* 

import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {

const router = createBrowserRouter(
    ALL_ROUTES({
    // any propers want to pass to all routes or layout
    })
  );

  return (
    <ConfigProvider theme={themes}>
      <style>{styles}</style>
      <Helmet>
        <link
          rel="shortcut icon"
          href={
            userDetails?.organizationFavIcon
              ? userDetails?.organizationFavIcon
              : process.env.REACT_APP_FAVICON
          }
        />
      </Helmet>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;


 */}