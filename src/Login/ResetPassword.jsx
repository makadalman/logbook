import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../CreateSupa.jsx";
import { Box } from "@mui/material";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const type = params.get("type");

    if (type === "recovery") {
      // User has been redirected from the email link with a valid session
      // Supabase auto signs them in with a short-lived session
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert("Error resetting password: " + error.message);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <p>
        Password updated! You can now
        <a href="/login">log in</a>
      </p>
    );
  }

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
      <h2>Reset your password</h2>
      <input
        type="password"
        placeholder="New password"
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleReset}>Update Password</button>
    </Box>
  );
}
