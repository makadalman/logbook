import React, { useState } from "react";
import supabase from "../CreateSupa.jsx";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("Check your email to confirm sign-up!");
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" mb={2}>
        Sign Up
      </Typography>
      <form onSubmit={handleSignUp}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMsg && <Typography color="error">{errorMsg}</Typography>}
        {successMsg && <Typography color="primary">{successMsg}</Typography>}
        <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
          Sign Up
        </Button>
        <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate("/login")}>
          Already have an account? Log in
        </Button>
      </form>
    </Box>
  );
}
