import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Modal, Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { cheerfulFiestaPalette } from "@mui/x-charts/colorPalettes";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function pivotByDay(flat) {
  const getDays = (year, month) => new Date(year, month, 0).getDate();
  const days = getDays(2021, 8);
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

export default function JumpBreakdownModal({
  open,
  onClose,
  month,
  monthNumber,
  breakdown,
}) {
  const [dayData, setDayData] = useState({ data: [], years: [] });

  useEffect(() => {
    if (!open) return;
    const fetchData = async () => {
      const { data, error } = await supabase.rpc("get_jumps_by_day", {
        jump_month: monthNumber,
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

      setDayData(pivotByDay(flat));
    };

    fetchData();
  }, []);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "white",
          p: 3,
          m: "auto",
          mt: 10,
          maxWidth: 400,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" align="center">
          Jumps by Day
        </Typography>

        <BarChart
          dataset={dayData.data}
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
  );
}
