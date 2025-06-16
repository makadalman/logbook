import { AppBar, Box, Button, Grid, IconButton, Toolbar } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import cat from "./assets/cat-small.png";
import theme from "./theme";
import "./App.css";

import Logbook from "./Home/Logbook.jsx";
import JumpByMonthBarGraph from "./Graphs/JumpByMonthBarGraph.jsx";
import JumpsByPieGraphs from "./Graphs/JumpsByPieGraphs.jsx";
import SummaryTable from "./SummaryTable.jsx";
import LogJumpModal from "./LogJumpModal.jsx";

const pages = ["Home", "Stats Graphs", "Gear"];

function App() {
  return (
    <Router>
      <Adventurebar />
      <Grid
        container
        sx={{ padding: 2 }}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 2 }}
      >
        <Routes>
          <Route path="/" element={<SummaryTable />} />
          <Route path="/logbook" element={<Logbook />} />
          <Route
            path="/stats"
            element={
              <>
                <JumpsByPieGraphs />
                <JumpByMonthBarGraph />
              </>
            }
          />
        </Routes>
      </Grid>
    </Router>
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
            <Box sx={{ flexGrow: 1 }}>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/stats">
                Stats
              </Button>
              <Button color="inherit" component={Link} to="/logbook">
                Logbook
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

export default App;
