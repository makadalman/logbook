import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthScreenProvider } from "./Login/AuthScreenContext.jsx";
import { AuthProvider } from "./AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <AuthScreenProvider>
          <App />
        </AuthScreenProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
