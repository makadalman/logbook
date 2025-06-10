import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Container,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

import cat from "./assets/cat-small.png";
import theme from "./theme";
import "./App.css";

import JumpTable from "./JumpTable.jsx";
import SummaryTable from "./SummaryTable.jsx";
import LogJumpModal from "./LogJumpModal.jsx";

import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [jumpsByLocation, setJumpsByLocation] = useState([]);
  const [jumpsByMonth, setJumpsByMonth] = useState([]);

  // useEffect(() => {
  //   getJumpsByLocation();
  //   getJumpsByMonth();
  // }, []);

  // async function getJumpsByLocation() {
  //   const { data } = await supabase.rpc("get_jumps_by_dropzone", {});
  //   setJumpsByLocation(data);
  // }
  // async function getJumpsByMonth() {
  //   const { data } = await supabase.rpc("get_jumps_by_month", {});
  //   setJumpsByMonth(data);
  // }

  return (
    <>
      <Adventurebar />
      <Grid
        container
        sx={{ padding: 2 }}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 2 }}
      >
        <Grid size={{ sm: 12, md: 6 }}>
          <SummaryTable />
        </Grid>
        <Grid sx={{ padding: 2 }} size={{ sm: 12, md: 6 }}>
          <JumpTable />
        </Grid>
        {/* <Grid size={6}>
          <PieChart 
            loading={jumpsByLocation.length === 0}
            height={400}
            series={[
              {
                arcLabelMinAngle: 35,
                arcLabelRadius: '60%',
                data: jumpsByLocation,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontWeight: 'bold',
              },
            }}
            slotProps={{
              legend: {
                sx: {
                  overflowY: 'scroll',
                  flexWrap: 'nowrap',
                  height: '100%',
                },
              },
            }}
          />
        </Grid> */}
        {/* <PieChart 
          loading={jumpsByMonth.length === 0}
          series={[
            {
              arcLabelMinAngle: 35,
              arcLabelRadius: '60%',
              data: jumpsByMonth,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontWeight: 'bold',
            },
          }}
        /> */}
      </Grid>
    </>
  );
}

function Adventurebar() {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar theme={theme} position="fixed">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <img src={cat} className="small-cat" alt="cat" />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Log book adventures
            </Typography>
            {/* <LogJumpModal /> */}
          </Toolbar>
        </AppBar>
      </Box>
      <Toolbar />
    </>
  );
}

export default App;
