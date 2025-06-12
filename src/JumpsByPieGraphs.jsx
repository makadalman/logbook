import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Grid } from "@mui/material";
import { blueberryTwilightPalette } from "@mui/x-charts/colorPalettes";
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function JumpsByPieGraphs() {
  const [jumpsByLocation, setJumpsByLocation] = useState([]);
  const [jumpsByTeam, setJumpsByTeam] = useState([]);

  useEffect(() => {
    getJumpsByLocation();
    getJumpsByTeam();
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
              },
            },
          }}
        />
      </Grid>
    </>
  );
}
