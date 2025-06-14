import { useEffect, useState } from "react";
import supabase from "./CreateSupa.jsx";
import { Box, Container, Grid } from "@mui/material";

export default function SummaryTable() {
  const [summary, setSummary] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [containers, setContainers] = useState([]);

  useEffect(() => {
    getSummary();
    getUserInfo();
    getContainers();
  }, []);

  async function getSummary() {
    const { data } = await supabase.rpc("get_summary", {});
    setSummary(data[0]);
  }
  async function getUserInfo() {
    const { data } = await supabase.from("user_info").select().eq("id", "1");
    setUserInfo(data[0]);
  }
  async function getContainers() {
    const { data } = await supabase.rpc("get_containers", {});
    setContainers(data);
  }
  return (
    <Container style={{ justifyItems: "center" }}>
      <h2>{userInfo.user_name}</h2>
      <Grid container sx={{ padding: 1 }} rowSpacing={2} width={"100%"}>
        <Grid size={6}>
          <Box
            sx={{
              padding: 1,
              borderTopLeftRadius: "8px",
              borderBottomLeftRadius: "8px",
              borderTop: "2px solid #ccc",
              borderBottom: "2px solid #ccc",
              borderLeft: "2px solid #ccc",
            }}
          >
            <h2>Summary</h2>
            <p>Total Jumps: {summary.total_jumps}</p>
            <p>Total Distance: {summary.total_distance} miles</p>
            <p>Total Freefall: {summary.total_freefall} hours</p>
          </Box>
        </Grid>
        <Grid size={6}>
          <Box
            sx={{
              padding: 1,
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              border: "2px solid #ccc",
            }}
          >
            <h2>Info</h2>
            <p>D-License: {userInfo.d_license}</p>
            <p>USPA Membership: {userInfo.uspa_number}</p>
            <p>FAI Membership: {userInfo.fai_license}</p>
          </Box>
        </Grid>
        <Grid size={12}>
          {containers.map((row) => (
            <Rigs key={row.container} row={row} />
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}

function Rigs(props) {
  const { row } = props;

  return (
    <div style={{ width: "100%" }}>
      <Box
        sx={{
          padding: 1,
          borderRadius: "8px",
          border: "2px solid #ccc",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        <Box sx={{ gridRow: "1", gridColumn: "span 3", fontWeight: "bold" }}>
          {row.container_use} Rig
        </Box>
        <Box sx={{ gridRow: "2", gridColumn: "span 1" }}>
          Container: {row.container}
        </Box>
        <Box sx={{ gridRow: "2", gridColumn: "span 1" }}>
          Main Canopy: {row.main_canopy}
        </Box>
        <Box sx={{ gridRow: "2", gridColumn: "span 1" }}>
          Reserve Canopy: {row.reserve_canopy}
        </Box>

        <Box sx={{ gridRow: "3", gridColumn: "span 1" }}>
          Repacked: {formatDate(row.repacked)}
        </Box>
        <Box sx={{ gridRow: "3", gridColumn: "span 1" }}>
          Color: {row.main_color}
        </Box>
        <Box sx={{ gridRow: "3", gridColumn: "span 1" }}>
          Color: {row.reserve_color}
        </Box>

        <Box sx={{ gridRow: "4", gridColumn: "span 1" }}>
          Repack Due: {CalculateRepackDue(row.repacked)}
        </Box>
        <Box sx={{ gridRow: "4", gridColumn: "span 1" }}>
          Size: {row.main_size}
        </Box>
        <Box sx={{ gridRow: "4", gridColumn: "span 1" }}>
          Size: {row.reserve_size}
        </Box>
      </Box>
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString();
}

function CalculateRepackDue(repacked) {
  const repackDueDate = new Date(repacked);
  repackDueDate.setDate(repackDueDate.getDate() + 181);
  return repackDueDate.toLocaleDateString();
}
