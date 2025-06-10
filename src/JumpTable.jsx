import * as React from "react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import theme from "./theme";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";

import { Box, IconButton, Typography } from "@mui/material";
import Collapse from "@mui/material/Collapse";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
  "&:nth-of-type(4n-1)": {
    backgroundColor: "lightgrey",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function JumpTable() {
  const [jumps, setJumps] = useState([]);

  useEffect(() => {
    getJumps();
  }, []);

  async function getJumps() {
    const { data } = await supabase.rpc("get_jumps", {}).limit(20);
    setJumps(data);
  }

  //   {
  //     "jump": 1508,
  //     "jump_date": "2025-05-25",
  //     "jump_type": "RW",
  //     "dropzone": "Skydive Paraclete XP",
  //     "team": null,
  //     "aircraft": "Twin Otter",
  //     "altitude": 13500,
  //     "delay": 71,
  //     "formation": 14,
  //     "container": "Cat Javelin",
  //     "canopy": "Sabre2",
  //     "canopy_color": "Orange",
  //     "canopy_size": "120"
  // }

  return (
    <TableContainer position="fixed" component={Paper} sx={{ maxHeight: 530 }}>
      <Table stickyHeader size="small" aria-label="simple table">
        <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
          <TableRow>
            <StyledTableCell />
            <StyledTableCell>Jump</StyledTableCell>
            <StyledTableCell align="right">Date</StyledTableCell>
            <StyledTableCell align="right">Dropzone</StyledTableCell>
            <StyledTableCell align="right">Jump&nbsp;Type</StyledTableCell>
            <StyledTableCell align="right">Team</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jumps.map((row) => (
            <Row key={row.jump} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.jump}
        </TableCell>
        <TableCell align="right">
          {new Date(row.jump_date).toLocaleDateString()}
        </TableCell>
        <TableCell align="right">{row.dropzone}</TableCell>
        <TableCell align="right">
          {row.jump_type ? row.jump_type : ""}
        </TableCell>
        <TableCell align="right">{row.team ? row.team : ""}</TableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                style={{ backgroundColor: "orchid" }}
              >
                More Info and shit
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="right">
                      Exit&nbsp;Altitude (feet)
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Free&nbsp;Fall (seconds)
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Formation&nbsp;Size
                    </StyledTableCell>
                    <StyledTableCell align="right">Aircraft</StyledTableCell>
                    <StyledTableCell align="right">Container</StyledTableCell>
                    <StyledTableCell align="right">Canopy</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.jump}>
                    <TableCell align="right">
                      {row.altitude ? row.altitude : ""}
                    </TableCell>
                    <TableCell align="right">
                      {row.delay ? row.delay : ""}
                    </TableCell>
                    <TableCell align="right">
                      {row.formation ? row.formation : ""}
                    </TableCell>
                    <TableCell align="right">
                      {row.aircraft ? row.aircraft : ""}
                    </TableCell>
                    <TableCell align="right">
                      {row.container ? row.container : ""}
                    </TableCell>
                    <TableCell align="right">
                      {FormatCanopyColor(row)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function FormatCanopyColor(data) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>{data.canopy ? data.canopy : ""}</span>
      <span>{data.canopy_color ? data.canopy_color : ""}</span>
      <span>{data.canopy_size ? `(${data.canopy_size})` : ""}</span>
    </div>
  );
}
