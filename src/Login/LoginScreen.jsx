import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import supabase from "../CreateSupa.jsx";
import { useAuthScreen } from "./AuthScreenContext";
import { useNavigate } from "react-router-dom";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { setAuthScreen } = useAuthScreen();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate("/"); // redirect to home
    }
  };

  const handleForgotPassword = () => {
    setAuthScreen("forgot");
    navigate("/forgot-password"); // redirect to forgot password
  };

  const handleSignUp = () => {
    setAuthScreen("signup");
    navigate("/signup"); // redirect to sign up
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        padding: 4,
        mt: 8,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "#fff",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleLogin}
      >
        Sign In
      </Button>
      <Button fullWidth onClick={handleForgotPassword}>
        Forgot Password?
      </Button>
      <Button fullWidth onClick={handleSignUp} sx={{ mt: 1 }}>
        Don't have an account? Sign Up
      </Button>
    </Box>
  );
}

export default LoginScreen;
