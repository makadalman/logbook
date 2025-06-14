import { useEffect, useState } from "react";
import { Button, Grid, Modal, Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  mangoFusionPalette,
  cheerfulFiestaPalette,
} from "@mui/x-charts/colorPalettes";
import supabase from "./CreateSupa.jsx"; // Adjust the import based on your project structure

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function pivotByMonth(flat) {
  const years = [...new Set(flat.map((r) => r.year))].sort();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const data = months.map((month) => {
    const row = {
      month: MONTH_NAMES[month],
      monthNumber: month,
    };
    years.forEach((year) => {
      const match = flat.find((f) => f.year === year && f.month === month);
      row[`y${year}`] = match ? match.jumps : 0;
    });
    row.total = years.reduce((sum, year) => sum + (row[`y${year}`] || 0), 0);
    return row;
  });

  return { data, years };
}

function pivotByDay(flat, monthIndex) {
  const getDays = (year, month) => new Date(year, month, 0).getDate();
  const days = Array.from(
    { length: getDays(2020, monthIndex) },
    (_, index) => index + 1
  );
  const years = [...new Set(flat.map((r) => r.year))].sort();

  const data = days.map((day) => {
    const row = {
      day: day,
    };
    years.forEach((year) => {
      const match = flat.find((f) => f.year === year && f.day === day);
      row[`y${year}`] = match ? match.jumps : 0;
    });
    row.total = years.reduce((sum, year) => sum + (row[`y${year}`] || 0), 0);
    return row;
  });

  return { data, years };
}

export default function JumpByMonthBarGraph() {
  const [monthData, setMonthData] = useState({ data: [], years: [] });
  const [dayData, setDayData] = useState({ data: [], years: [] });
  const [modalData, setModalData] = useState(null);
  const [viewMode, setViewMode] = useState("byYear"); // or "total"

  useEffect(() => {
    const fetchMonthData = async () => {
      const { data, error } = await supabase.rpc(
        "get_jumps_by_month_by_year",
        {}
      );

      if (error) {
        console.error(error);
        return;
      }

      const counts = {};
      for (const row of data) {
        const key = `${row.year}-${row.month}`;
        if (row.jumps > 0) {
          counts[key] = row.jumps;
        }
      }

      const flat = Object.entries(counts).map(([key, jumps]) => {
        const [year, month] = key.split("-").map(Number);
        return { year, month, jumps };
      });

      setMonthData(pivotByMonth(flat));
    };
    fetchMonthData();
  }, []);

  const handleBarClick = async (event, clickedData) => {
    const clickedRow = monthData.data[clickedData.dataIndex];

    if (!clickedRow) return;

    const { data, error } = await supabase.rpc("get_jumps_by_day", {
      jump_month: clickedData.dataIndex + 1, // dataIndex is 0-based, month is 1-based
    });

    if (error) {
      console.error(error);
      return;
    }

    const counts = {};
    for (const row of data) {
      const key = `${row.year}-${row.day}`;
      if (row.jumps > 0) {
        counts[key] = row.jumps;
      }
    }

    const flat = Object.entries(counts).map(([key, jumps]) => {
      const [year, day] = key.split("-").map(Number);
      return { year, day, jumps };
    });

    setDayData(pivotByDay(flat, clickedData.dataIndex + 1));

    setModalData({
      month: clickedRow.month,
    });
  };

  return (
    <Grid sx={{ padding: 2 }} size={12}>
      <Typography variant="h5" align="center">
        Jumps by Month
      </Typography>
      <Button
        variant="outlined"
        onClick={() =>
          setViewMode((prev) => (prev === "byYear" ? "total" : "byYear"))
        }
      >
        {viewMode === "byYear" ? "Show Totals" : "Show By Year"}
      </Button>

      <BarChart
        dataset={monthData.data}
        loading={monthData.data.length === 0}
        height={400}
        xAxis={[{ dataKey: "month", scaleType: "band" }]}
        yAxis={[{ label: "Jumps" }]}
        colors={mangoFusionPalette}
        hideLegend={viewMode !== "byYear"}
        slotProps={{
          legend: {
            direction: "horizontal",
            position: { vertical: "bottom", horizontal: "center" },
          },
        }}
        series={
          viewMode === "byYear"
            ? monthData.years.map((year) => ({
                dataKey: `y${year}`,
                label: year.toString(),
                stack: "total",
              }))
            : [{ dataKey: "total", label: "Total", color: "#1976d2" }]
        }
        onItemClick={handleBarClick}
        tooltip={{ trigger: "item" }}
      />

      <Modal open={!!modalData} onClose={() => setModalData(null)}>
        <Box
          sx={{
            bgcolor: "white",
            p: 3,
            m: "auto",
            mt: 10,
            maxWidth: "80%",
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" align="center">
            Jumps by Day in {modalData?.month}
          </Typography>

          <BarChart
            dataset={dayData.data}
            loading={dayData.data.length === 0}
            height={400}
            xAxis={[{ dataKey: "day", scaleType: "band" }]}
            yAxis={[{ label: "Jumps" }]}
            colors={cheerfulFiestaPalette}
            series={dayData.years.map((year) => ({
              dataKey: `y${year}`,
              label: year.toString(),
              stack: "total",
            }))}
            tooltip={{ trigger: "item" }}
          />
        </Box>
      </Modal>
    </Grid>
  );
}
