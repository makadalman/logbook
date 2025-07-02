import { useEffect, useState } from "react";
import supabase from "../CreateSupa.jsx";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import {
  Grid,
  Paper,
  styled,
  tableCellClasses,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
} from "@mui/material";
import {
  blueberryTwilightPalette,
  strawberrySkyPalette,
  cheerfulFiestaPalette,
  mangoFusionPalette,
} from "@mui/x-charts/colorPalettes";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:nth-of-type(2n)": {
    backgroundColor: "lightgrey",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function JumpsByDipictions() {
  const [jumpsByLocation, setJumpsByLocation] = useState([]);
  const [jumpsByTeam, setJumpsByTeam] = useState([]);
  const [jumpsByType, setJumpsByType] = useState([]);
  const [jumpsByAltitude, setJumpsByAltitude] = useState([]);

  const [alignment, setAlignment] = useState("table");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

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

  const renderPieChart = (key, alignment) => {
    const { data, title, color } = graphs[key];
    const isTableView = alignment === "table";
    const isLoading = data.length === 0;
    if (!data || isLoading) {
      return null;
    }
    return (
      <Grid sx={{ padding: 2 }} size={{ sm: 12, md: 6 }} key={key}>
        <h2 style={{ display: "flex", justifyContent: "center", margin: 0 }}>
          {title}
        </h2>
        {isTableView ? (
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            <Table
              stickyHeader
              width="100%"
              size="small"
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Dropzone</StyledTableCell>
                  <StyledTableCell>Count</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <StyledTableRow
                    sx={{ "& > *": { borderBottom: "unset" } }}
                    key={row.label}
                  >
                    <TableCell>{row.label}</TableCell>
                    <TableCell>{row.value}</TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <PieChart
            loading={isLoading}
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
        )}
      </Grid>
    );
  };

  return (
    <>
      <Toolbar sx={{ flexGrow: 1 }} style={{ width: "100%" }} />
      <ToggleButtonGroup
        style={{ width: "100%", display: "flex", justifyContent: "right" }}
        position="fixed"
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        <ToggleButton value="graph">Graphs</ToggleButton>
        <ToggleButton value="table">Tables</ToggleButton>
      </ToggleButtonGroup>
      <Grid container style={{ width: "-webkit-fill-available" }}>
        {Object.keys(graphs).map((key) => renderPieChart(key, alignment))}
      </Grid>
    </>
  );
}
