import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAuth } from "../AuthContext";
import supabase from "../CreateSupa.jsx";

export default function LogJumpModal({
  open,
  onClose,
  initialData = null,
  onSave,
  refreshLogbook,
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [jumpNumber, setJumpNumber] = useState(0);
  const [dropzones, setDropzones] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [teams, setTeams] = useState([]);
  const [jumpTypes, setJumpTypes] = useState([]);
  const [containers, setContainers] = useState([]);
  const [canopies, setCanopies] = useState([]);
  const [logJump, setLogJump] = useState({});
  const [jumpDate, setJumpDate] = useState(dayjs());

  useEffect(() => {
    if (!open) return;

    const loadData = async () => {
      setLoading(true);
      const [dzRes, acRes, teamRes, jtRes, ctRes, caRes] = await Promise.all([
        getDropzones(),
        getAircraft(),
        getTeams(),
        getJumpTypes(),
        getContainers(),
        getCanopies(),
      ]);

      // now do jump number setup
      if (initialData) {
        const dz =
          dzRes.find((d) => d.dropzone === initialData.dropzone)?.id || "";
        const tm = teamRes.find((t) => t.name === initialData.team)?.id || "";
        const jt =
          jtRes.find((j) => j.jump_type === initialData.jump_type)?.id || "";
        const ct =
          ctRes.find((c) => c.container === initialData.container)?.id || "";
        const ca = caRes.find((c) => c.canopy === initialData.canopy)?.id || "";
        const ac =
          acRes.find((a) => a.aircraft === initialData.aircraft)?.id || "";

        setLogJump({
          dropzone: dz,
          aircraft: ac,
          jumpNumber: initialData.jump,
          team: tm,
          jumptype: jt,
          container: ct,
          canopy: ca,
          altitude: initialData.altitude,
          delay: initialData.delay,
          formation: initialData.formation,
          remarks: initialData.remarks,
        });
        setJumpDate(dayjs(initialData.jump_date));
        setJumpNumber(initialData.jump);
      } else {
        setLogJump({});
        setJumpDate(dayjs());
        await getJumpNumber(); // sets jumpNumber
      }

      setLoading(false);
    };

    loadData();
  }, [open, initialData]);

  async function getJumpNumber() {
    const { data } = await supabase
      .from("logbook")
      .select("jump")
      .eq("user_id", user.id)
      .order("jump", { ascending: false })
      .limit(1);
    setJumpNumber((data?.[0]?.jump || 0) + 1);
  }
  async function getDropzones() {
    const { data } = await supabase.from("location").select("id, dropzone");
    const dz = data || [];
    setDropzones(dz);
    return dz;
  }
  async function getAircraft() {
    const { data } = await supabase.from("aircraft").select("id, aircraft");
    const ac = data || [];
    setAircraft(ac);
    return ac;
  }
  async function getTeams() {
    const { data } = await supabase.from("team").select("id, name");
    const tm = data || [];
    setTeams(tm);
    return tm;
  }
  async function getJumpTypes() {
    const { data } = await supabase.from("jumptype").select("id, jump_type");
    const jt = data || [];
    setJumpTypes(jt);
    return jt;
  }
  async function getContainers() {
    const { data } = await supabase
      .from("container")
      .select("id, container")
      .eq("user_id", user.id)
      .eq("currently_owned", true);
    const ct = data || [];
    setContainers(ct);
    return ct;
  }
  async function getCanopies() {
    const { data } = await supabase
      .from("canopy")
      .select("id, canopy, size, color")
      .eq("user_id", user.id)
      .eq("currently_owned", true);
    const ca = data || [];
    setCanopies(ca);
    return ca;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogJump((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const payload = {
      jump_date: jumpDate.format("YYYY-MM-DD"),
      location: logJump.dropzone,
      team: logJump.team ?? null,
      jump_type: logJump.jumptype,
      aircraft: logJump.aircraft ?? null,
      container: logJump.container ?? null,
      canopy: logJump.canopy ?? null,
      altitude: logJump.altitude ?? null,
      delay: logJump.delay ?? null,
      formation: logJump.formation ?? null,
      remarks: logJump.remarks ?? null,
    };
    if (!initialData) {
      // create mode
      const { data: last } = await supabase
        .from("logbook")
        .select("jump")
        .order("jump", { ascending: false })
        .limit(1);
      payload.jump = (last?.[0]?.jump || 0) + 1;
      payload.user_id = user.id;
    } else {
      // edit mode
      payload.jump = jumpNumber;
      payload.user_id = user.id;
      payload.id = initialData.id; // include id for update
    }

    await onSave(payload);
    onClose();
  };

  const isSaveDisabled =
    loading || !logJump.dropzone || !logJump.jumptype || !jumpDate;

  return (
    <>
      {open && !loading && (
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>
            {initialData
              ? `Edit Jump #${initialData.jump}`
              : `New Jump #${jumpNumber}`}
          </DialogTitle>

          <DialogContent sx={{ p: 2, overflowY: "auto", flex: 1 }}>
            {loading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2} paddingTop={1}>
                <Grid size={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Jump Date"
                      value={jumpDate}
                      onChange={(nv) => setJumpDate(nv)}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Jump Type</InputLabel>
                    <Select
                      autoFocus
                      name="jumptype"
                      value={logJump.jumptype || ""}
                      label="Jump Type"
                      onChange={handleChange}
                    >
                      {jumpTypes.map((jt) => (
                        <MenuItem key={jt.id} value={jt.id}>
                          {jt.jump_type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Dropzone</InputLabel>
                    <Select
                      name="dropzone"
                      value={logJump.dropzone || ""}
                      label="Dropzone"
                      onChange={handleChange}
                    >
                      {dropzones.map((dz) => (
                        <MenuItem key={dz.id} value={dz.id}>
                          {dz.dropzone}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Aircraft</InputLabel>
                    <Select
                      name="aircraft"
                      value={logJump.aircraft || ""}
                      label="Aircraft"
                      onChange={handleChange}
                    >
                      {aircraft.map((craft) => (
                        <MenuItem key={craft.id} value={craft.id}>
                          {craft.aircraft}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Formation"
                    name="formation"
                    value={logJump.formation || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Team</InputLabel>
                    <Select
                      name="team"
                      value={logJump.team || ""}
                      label="Team"
                      onChange={handleChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {teams.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                          {t.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Altitude"
                    name="altitude"
                    type="number"
                    value={logJump.altitude || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Delay"
                    name="delay"
                    type="number"
                    value={logJump.delay || ""}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Container</InputLabel>
                    <Select
                      name="container"
                      value={logJump.container || ""}
                      label="Container"
                      onChange={handleChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {containers.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.container}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Canopy</InputLabel>
                    <Select
                      name="canopy"
                      value={logJump.canopy || ""}
                      label="Canopy"
                      onChange={handleChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {canopies.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.canopy} {c.size} ({c.color})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    name="remarks"
                    multiline
                    maxRows={4}
                    value={logJump.remarks || ""}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isSaveDisabled}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
