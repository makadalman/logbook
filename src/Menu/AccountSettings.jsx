import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import supabase from "../CreateSupa";
import { useAuth } from "../AuthContext";

export default function AccountSettings() {
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const { user } = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      if (user) {
        // Optionally fetch from `user_info` table
        const { data: profile } = await supabase
          .from("user_info")
          .select("display_name")
          .eq("id", user.id)
          .single();
        if (profile) setDisplayName(profile.display_name || "");
      }
    };
    loadUser();
  }, []);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("user_info")
      .update({ display_name: displayName })
      .eq("id", user.id);

    if (error) {
      setStatus({ type: "error", message: error.message });
    } else {
      setStatus({ type: "success", message: "Profile updated!" });
    }
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 500, margin: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Account Settings
      </Typography>

      {status.message && (
        <Alert severity={status.type} sx={{ mb: 2 }}>
          {status.message}
        </Alert>
      )}

      <TextField
        label="Display Name"
        fullWidth
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handleUpdate}>
        Save Changes
      </Button>
    </Paper>
  );
}
