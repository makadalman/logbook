import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import supabase from "../CreateSupa.jsx";
import { useNavigate } from "react-router-dom";
import { useAuthScreen } from "./AuthScreenContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { setAuthScreen } = useAuthScreen();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/login"); // go back one step
  };

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });

    setAuthScreen("forgot");

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for a reset link.");
    }
  };

  return (
    <Box sx={{ maxWidth: 300, mx: "auto", mt: 10 }}>
      <Typography variant="h5" mb={2}>
        Reset Password
      </Typography>
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {message && <Typography sx={{ mt: 1 }}>{message}</Typography>}
      <Button
        fullWidth
        variant="contained"
        onClick={handleReset}
        sx={{ mt: 2 }}
      >
        Send Reset Link
      </Button>
      <Button onClick={handleGoBack}>Back to Login</Button>
    </Box>
  );
}
