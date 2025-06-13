import * as React from "react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Grid } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { mangoFusionPalette } from "@mui/x-charts/colorPalettes";
import theme from "./theme";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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

const transformToPivot = (data) => {
  const years = [...new Set(data.map((d) => d.year))];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return months.map((month) => {
    const row = { month: MONTH_NAMES[month] };
    years.forEach((year) => {
      const match = data.find((d) => d.year === year && d.month === month);
      row[`y${year}`] = match ? match.jumps : 0;
    });
    return row;
  });
};

export default function JumpByMonthBarGraph() {
  const [pivotData, setPivotData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.rpc(
        "get_jumps_by_month_by_year",
        {}
      );

      if (error) {
        console.error(error);
        return;
      }

      // Group the raw date values into year/month counts
      const counts = {};

      for (const row of data) {
        const year = row.year;
        const month = row.month;

        const key = `${year}-${month}`;
        if (row.jumps > 0) {
          counts[key] = row.jumps;
        }
      }

      // Flatten into array format
      const flat = Object.entries(counts).map(([key, jumps]) => {
        const [year, month] = key.split("-").map(Number);
        return { year, month, jumps };
      });

      setPivotData(transformToPivot(flat));
    };

    fetchData();
  }, []);

  const years =
    pivotData.length > 0
      ? Object.keys(pivotData[0])
          .filter((k) => k.startsWith("y"))
          .map((k) => +k.slice(1))
      : [];

  return (
    <Grid sx={{ padding: 2 }} size={12}>
      <h2 style={{ display: "flex", justifyContent: "center" }}>
        Jumps by Month
      </h2>
      <BarChart
        dataset={pivotData}
        loading={pivotData.length === 0}
        height={400}
        xAxis={[{ dataKey: "month" }]}
        yAxis={[{ label: "Jumps" }]}
        colors={mangoFusionPalette}
        series={years.map((y, idx) => ({
          dataKey: `y${y}`,
          stack: "total",
          label: y.toString(),
        }))}
      />
    </Grid>
  );
}
