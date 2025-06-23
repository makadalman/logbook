import { useState } from "react";
import supabase from "../CreateSupa.jsx";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Password updated successfully.");
      setTimeout(() => navigate("/"), 1500);
    }
  };

  return (
    <Box sx={{ maxWidth: 300, mx: "auto", mt: 10 }}>
      <Typography variant="h5" mb={2}>
        Set New Password
      </Typography>
      <TextField
        fullWidth
        label="New Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {msg && <Typography sx={{ mt: 1 }}>{msg}</Typography>}
      <Button
        fullWidth
        variant="contained"
        onClick={handleUpdate}
        sx={{ mt: 2 }}
      >
        Update Password
      </Button>
    </Box>
  );
}
