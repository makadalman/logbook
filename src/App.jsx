import {
  AppBar,
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { Routes, Route, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import supabase from "./CreateSupa.jsx";
import { useNavigate, useLocation } from "react-router-dom";

import cat from "./assets/cat-small.png";
import theme from "./theme.js";
import "./App.css";

import Logbook from "./Home/Logbook.jsx";
import JumpByMonthBarGraph from "./Graphs/JumpByMonthBarGraph.jsx";
import JumpsByPieGraphs from "./Graphs/JumpsByPieGraphs.jsx";
import SummaryTable from "./Menu/SummaryTable.jsx";
import AccountSettings from "./Menu/AccountSettings.jsx";

import LoginScreen from "./Login/LoginScreen.jsx";
import ForgotPassword from "./Login/ForgotPassword.jsx";
import UpdatePassword from "./Login/UpdatePassword.jsx";
import SignUpScreen from "./Login/SignUp.jsx";
import { useAuth } from "./AuthContext";

import ResetPassword from "./Login/ResetPassword.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const settings = [
  { label: "Summary", route: "/summary" },
  { label: "Account", route: "/account" },
  { label: "Logout", route: "/logout" },
];

function App() {
  const [session, setSession] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("type") === "recovery") {
      navigate("/reset-password", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session) return <Dashboard />;

  if (location.pathname === "/reset-password") {
    return <ResetPassword />;
  }
  if (location.pathname === "/signup") {
    return <SignUpScreen />;
  }

  return <LoginScreen />;
}

function Dashboard() {
  return (
    <>
      <Adventurebar />
      <Grid
        container
        sx={{ padding: 2 }}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 2 }}
      >
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/update-password" element={<UpdatePassword />} /> */}
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/signup" element={<SignUpScreen />} />
          {/* Protected routes */}

          <Route
            path="/"
            element={
              // <ProtectedRoute>
              <Logbook />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/summary"
            element={
              // <ProtectedRoute>
              <SummaryTable />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              // <ProtectedRoute>
              <AccountSettings />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <>
                {/* <ProtectedRoute> */}
                <JumpsByPieGraphs />
                {/* </ProtectedRoute> */}
                {/* <ProtectedRoute> */}
                <JumpByMonthBarGraph />
                {/* </ProtectedRoute> */}
              </>
            }
          />
        </Routes>
      </Grid>
    </>
  );
}

function Adventurebar() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth();

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleMenuClick = (route) => {
    handleCloseUserMenu();
    handleCloseNavMenu();
    if (route === "/logout") {
      supabase.auth.signOut().then(() => {
        navigate("/login");
      });
    } else {
      navigate(route);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar theme={theme} position="fixed">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
            >
              <img src={cat} className="small-cat" alt="cat" />
            </IconButton>

            {isMobile ? (
              <>
                <IconButton
                  size="large"
                  color="inherit"
                  aria-label="open nav menu"
                  onClick={handleOpenNavMenu}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorElNav}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  anchorOrigin={{ vertical: "top", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  <MenuItem onClick={() => handleMenuClick("/")}>
                    Logbook
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuClick("/stats")}>
                    Stats
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ flexGrow: 1 }}>
                <Button color="inherit" component={Link} to="/">
                  Logbook
                </Button>
                <Button color="inherit" component={Link} to="/stats">
                  Stats
                </Button>
              </Box>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user?.user_metadata?.display_name || user?.email}
                    src="/static/images/avatar/2.jpg"
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.label}
                    onClick={() => handleMenuClick(setting.route)}
                  >
                    <Typography textAlign="center">{setting.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

export default App;
