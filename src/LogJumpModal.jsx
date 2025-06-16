import React from "react";
import { useEffect, useState } from "react";
import {
  Button,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import supabase from "./CreateSupa.jsx";

export default function LogJumpModal() {
  const [open, setOpen] = React.useState(false);
  const [jumpNumber, setJumpNumber] = useState([]);
  const [dropzones, setDropzones] = useState([]);
  const [teams, setTeams] = useState([]);
  const [jumptype, setJumpType] = useState([]);
  const [logJump, setLogJump] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    getJumpNumber();
    getDropzones();
    getTeams();
    getJumpType();
  };

  async function getJumpNumber() {
    const { data } = await supabase
      .from("logbook")
      .select("jump")
      .order("jump", { ascending: false })
      .limit(1);
    setJumpNumber(data[0].jump + 1);
  }

  async function getDropzones() {
    const { data } = await supabase.from("location").select("id, dropzone");
    setDropzones(data);
  }

  async function getTeams() {
    const { data } = await supabase.from("team").select("id, name");
    setTeams(data);
  }

  async function getJumpType() {
    const { data } = await supabase.from("jumptype").select("id, jump_type");
    setJumpType(data);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLogJump((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSave = () => {
    onSave(jumpNumber, logJump);
  };

  async function onSave(jumpNumber, logJump) {
    // yes we need the date. but.... if it doesn't exist, make it today.
    const { error } = await supabase.from("logbook").insert({
      jump: jumpNumber,
      jump_date: new Date(),
      location: logJump.dropzone,
      team: logJump.team,
    });
  }

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        width: "100%",
        justifyContent: "right",
      }}
    >
      <button
        type="button"
        style={{ outline: "1px solid black" }}
        onClick={handleOpen}
      >
        Log Jump
      </button>
      <Modal onClose={handleClose} open={open}>
        <Box
          sx={{
            bgcolor: "white",
            p: 3,
            m: "auto",
            mt: 10,
            maxWidth: "80%",
            borderRadius: 2,
          }}
        >
          <h2>Jump #{jumpNumber}</h2>
          <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
            <DatePicker required />
          </LocalizationProvider>
          <FormControl fullWidth style={{ marginTop: "1rem" }}>
            <InputLabel id="demo-simple-select-label">Dropzone *</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Dropzone"
              required
              style={{ marginBottom: "1rem" }}
              onChange={handleChange}
              value={logJump.dropzone || ""}
              name="dropzone"
            >
              {dropzones.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.dropzone}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Team</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Team"
              style={{ marginBottom: "1rem" }}
              onChange={handleChange}
              value={logJump.team || ""}
              name="team"
            >
              {teams.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Jump Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Team"
              style={{ marginBottom: "1rem" }}
              // onChange={handleChange}
            >
              {jumptype.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.jump_type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={handleSave} sx={{ mt: 2 }}>
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
