import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthScreenProvider } from "./Login/AuthScreenContext.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import { ThemeProvider } from "@mui/material/styles";
import logbookTheme from "./logbookTheme.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <AuthScreenProvider>
          <ThemeProvider theme={logbookTheme}>
            <App />
          </ThemeProvider>
        </AuthScreenProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
