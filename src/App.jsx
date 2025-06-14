import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import cat from "./assets/cat-small.png";
import theme from "./theme";
import "./App.css";

import JumpTable from "./JumpTable.jsx";
import JumpByMonthBarGraph from "./JumpByMonthBarGraph.jsx";
import JumpsByPieGraphs from "./JumpsByPieGraphs.jsx";
import SummaryTable from "./SummaryTable.jsx";
import LogJumpModal from "./LogJumpModal.jsx";

function App() {
  return (
    <>
      <Adventurebar />
      <Grid
        container
        sx={{ padding: 2 }}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 2 }}
      >
        <Grid size={12}>
          <SummaryTable />
        </Grid>
        <Grid sx={{ padding: 2 }} size={12}>
          <JumpTable />
        </Grid>
        <JumpsByPieGraphs />
        <JumpByMonthBarGraph />
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
            <LogJumpModal />
          </Toolbar>
        </AppBar>
      </Box>
      <Toolbar />
    </>
  );
}

export default App;
