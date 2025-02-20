import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Box } from "@mui/material";
import AllRoutes from "./Components/Routes/AllRoutes";
import Sidebar from "./Components/Pages/Sidebar/Sidebar";

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: "flex" }}>
        <Sidebar/>
        <Box sx={{width: '100%'}}>
          <AllRoutes />
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
