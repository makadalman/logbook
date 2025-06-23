import { useEffect, useState } from "react";
import supabase from "../CreateSupa.jsx";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Grid, Toolbar } from "@mui/material";
import {
  blueberryTwilightPalette,
  strawberrySkyPalette,
  cheerfulFiestaPalette,
  mangoFusionPalette,
} from "@mui/x-charts/colorPalettes";

export default function JumpsByPieGraphs() {
  const [jumpsByLocation, setJumpsByLocation] = useState([]);
  const [jumpsByTeam, setJumpsByTeam] = useState([]);
  const [jumpsByType, setJumpsByType] = useState([]);
  const [jumpsByAltitude, setJumpsByAltitude] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const { data: locData } = await supabase.rpc("get_jumps_by_dropzone");
      setJumpsByLocation(locData || []);

      const { data: teamData } = await supabase.rpc("get_jumps_by_team");
      const formattedTeams = (teamData || []).map((item) => ({
        label: item.pickup ? item.label + " (Pickup)" : item.label,
        value: item.value,
      }));
      setJumpsByTeam(formattedTeams);

      const { data: typeData } = await supabase.rpc("get_jumps_by_type");
      setJumpsByType(typeData || []);

      const { data: altData } = await supabase.rpc("get_jumps_by_altitude");
      setJumpsByAltitude(altData || []);
    };

    fetchAll();
  }, []);

  const graphs = {
    jumpsByLocation: {
      data: jumpsByLocation,
      title: "Jumps by Location",
      color: blueberryTwilightPalette,
    },
    jumpsByTeam: {
      data: jumpsByTeam,
      title: "Jumps by Team",
      color: strawberrySkyPalette,
    },
    jumpsByType: {
      data: jumpsByType,
      title: "Jumps by Type",
      color: mangoFusionPalette,
    },
    jumpsByAltitude: {
      data: jumpsByAltitude,
      title: "Jumps by Altitude",
      color: cheerfulFiestaPalette,
    },
  };

  const renderPieChart = (key) => {
    const { data, title, color } = graphs[key];
    if (!data || data.length === 0) {
      return null; // Skip rendering if no data is available
    }
    return (
      <Grid sx={{ padding: 2 }} size={{ sm: 12, md: 6 }} key={key}>
        <h2 style={{ display: "flex", justifyContent: "center" }}>{title}</h2>
        <PieChart
          loading={data.length === 0}
          height={400}
          colors={color}
          series={[
            {
              arcLabelMinAngle: 35,
              arcLabelRadius: "60%",
              data,
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
    );
  };

  return (
    <>
      <Toolbar />
      <Grid container spacing={2}>
        {Object.keys(graphs).map((key) => renderPieChart(key))}
      </Grid>
    </>
  );
}
