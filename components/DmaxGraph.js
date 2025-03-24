import React, { useState, useEffect, useRef } from "react";
import { Grid, Card, Box, Typography, useMediaQuery } from "@mui/material";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useTheme } from "@mui/material/styles";
import { theme, breakpoints } from "../src/theme";
import MemoryIcon from "@mui/icons-material/Memory";

export const DmaxGraph = React.memo(({ chartData, memoryLimit }) => {
  const [chartWidth, setChartWidth] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      setChartWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const currentTheme = useTheme();

  // // const { mode, setMode } = useColorScheme();
  // const [mounted, setMounted] = React.useState(false);

  // React.useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) {
  //   // for server-side rendering
  //   // learn more at https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
  //   return null;
  // }

  const matches = useMediaQuery("(max-width: " + breakpoints.values.sm + "px)"); // 'sm' は600pxに設定されていることが多い

  return (
    <>
      <Grid
        item
        xs={12}
        md={5.9}
        ref={containerRef}
        sx={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            [`@media (max-width: ${breakpoints.values.sm}px)`]: {
              display: "none",
            },
          }}
        >
          <MemoryIcon sx={{ color: theme.vars.palette.text.hint, fontSize: "1.3rem" }} />
          <Typography
            sx={{
              color: theme.vars.palette.text.hint,
              paddingRight: "0.5rem",
              alignItems: "center",
              fontSize: "0.9rem",
            }}
          >
            メモリ上限 {memoryLimit}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            minHeight: "300px",
          }}
        >
          <LineChart
            width={chartWidth}
            height={matches ? chartWidth - 40 : 440}
            data={chartData}
            margin="auto"
            display="block"
          >
            <XAxis
              dataKey="time"
              unit="s"
              type="number"
              tick={{ fill: currentTheme.palette.text.secondary }}
            />
            <YAxis yAxisId="left" tick={{ fill: currentTheme.palette.text.secondary }} />
            <YAxis
              yAxisId="right"
              unit="MB"
              type="number"
              orientation="right"
              tick={{ fontSize: 10, fill: currentTheme.palette.text.secondary }}
            />
            <Tooltip
              formatter={(value, name) => {
                let unit;
                switch (name) {
                  case "メモリ使用量":
                    unit = " MB";
                    break;
                  default:
                    unit = ""; // 何もしない
                }
                return [`${value}${unit}`, name];
              }}
              contentStyle={{ backgroundColor: currentTheme.palette.background.default }}
            />
            <Legend wrapperStyle={{ fontSize: "0.9rem" }} />
            <CartesianGrid stroke="#f5f5f5" />
            <Line
              type="linear"
              dataKey="upperLimit"
              name="ダメージ上限"
              stroke={currentTheme.palette.primary.main}
              strokeWidth={2}
              yAxisId="left"
              animationDuration={300}
            />
            <Line
              type="linear"
              dataKey="lowerLimit"
              name="ダメージ下限"
              stroke={currentTheme.palette.secondary.main}
              strokeWidth={2}
              yAxisId="left"
              animationDuration={300}
            />
            <Line
              type="linear"
              dataKey="usedMemory"
              name="メモリ使用量"
              stroke={currentTheme.palette.text.secondary}
              strokeDasharray={"3 3"}
              dot={false}
              yAxisId="right"
              animationDuration={300}
            />
          </LineChart>
        </Box>
      </Grid>
    </>
  );
});

export default DmaxGraph;
