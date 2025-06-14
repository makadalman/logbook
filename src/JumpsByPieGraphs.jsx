import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Grid } from "@mui/material";
import {
  blueberryTwilightPalette,
  strawberrySkyPalette,
  cheerfulFiestaPalette,
  mangoFusionPalette,
} from "@mui/x-charts/colorPalettes";
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function JumpsByPieGraphs() {
  const [jumpsByLocation, setJumpsByLocation] = useState([]);
  const [jumpsByTeam, setJumpsByTeam] = useState([]);
  const [jumpsByType, setJumpsByType] = useState([]);
  const [jumpsByAltitude, setJumpsByAltitude] = useState([]);

  useEffect(() => {
    getJumpsByLocation();
    getJumpsByTeam();
    getJumpsByType();
    getJumpsByAltitude();
  }, []);

  async function getJumpsByLocation() {
    const { data } = await supabase.rpc("get_jumps_by_dropzone", {});
    setJumpsByLocation(data);
  }
  async function getJumpsByTeam() {
    const { data } = await supabase.rpc("get_jumps_by_team", {});
    const formattedTeams = data.map((item) => ({
      label: item.pickup ? item.label + " (Pickup)" : item.label,
      value: item.value,
    }));
    setJumpsByTeam(formattedTeams);
  }

  async function getJumpsByType() {
    const { data } = await supabase.rpc("get_jumps_by_type", {});
    setJumpsByType(data);
  }

  async function getJumpsByAltitude() {
    const { data } = await supabase.rpc("get_jumps_by_altitude", {});
    setJumpsByAltitude(data);
  }

  return (
    <>
      <Grid sx={{ padding: 2 }} size={{ sm: 12, md: 6 }}>
        <h2 style={{ display: "flex", justifyContent: "center" }}>
          Jumps by Location
        </h2>
        <PieChart
          loading={jumpsByLocation.length === 0}
          height={400}
          colors={blueberryTwilightPalette}
          series={[
            {
              arcLabelMinAngle: 35,
              arcLabelRadius: "60%",
              data: jumpsByLocation,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontWeight: "bold",
            },
          }}
          slotProps={{
            legend: {
              sx: {
                overflowY: "scroll",
                flexWrap: "nowrap",
                height: "300px",
                width: "25%",
              },
            },
          }}
        />
      </Grid>
      <Grid sx={{ padding: 2 }} size={{ sm: 12, md: 6 }}>
        <h2 style={{ display: "flex", justifyContent: "center" }}>
          Jumps by Team
        </h2>
        <PieChart
          loading={jumpsByTeam.length === 0}
          height={400}
          series={[
            {
              arcLabelMinAngle: 35,
              arcLabelRadius: "60%",
              data: jumpsByTeam,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontWeight: "bold",
            },
          }}
          slotProps={{
            legend: {
              sx: {
                // overflowY: "scroll",
                flexWrap: "nowrap",
                height: "100%",
                width: "25%",
              },
            },
          }}
        />
      </Grid>
      <Grid sx={{ padding: 2 }} size={{ sm: 12, md: 6 }}>
        <h2 style={{ display: "flex", justifyContent: "center" }}>
          Jumps by Type
        </h2>
        <PieChart
          loading={jumpsByType.length === 0}
          height={400}
          colors={mangoFusionPalette}
          series={[
            {
              arcLabelMinAngle: 35,
              arcLabelRadius: "60%",
              data: jumpsByType,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontWeight: "bold",
            },
          }}
          slotProps={{
            legend: {
              sx: {
                overflowY: "scroll",
                flexWrap: "nowrap",
                height: "300px",
                width: "25%",
              },
            },
          }}
        />
      </Grid>
      <Grid sx={{ padding: 2 }} size={{ sm: 12, md: 6 }}>
        <h2 style={{ display: "flex", justifyContent: "center" }}>
          Jumps by Altitude
        </h2>
        <PieChart
          loading={jumpsByAltitude.length === 0}
          height={400}
          colors={cheerfulFiestaPalette}
          series={[
            {
              arcLabelMinAngle: 35,
              arcLabelRadius: "60%",
              data: jumpsByAltitude,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontWeight: "bold",
            },
          }}
          slotProps={{
            legend: {
              sx: {
                overflowY: "scroll",
                flexWrap: "nowrap",
                height: "300px",
                width: "25%",
              },
            },
          }}
        />
      </Grid>
    </>
  );
}
