import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./Components/Redux/store.js";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ErrorBoundary from "./Components/ErrorBoundary";

const theme = createTheme({
  // Your theme customization here
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </ErrorBoundary>
);
