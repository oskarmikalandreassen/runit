import React, { useState } from "react";
import dayjs from "dayjs";
import { ActivityData } from "./types";
import { PieChart } from "@mui/x-charts/PieChart";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";

interface Props {
  title: string;
  filteredData: ActivityData[];
}

function PieActiveChart({ title, filteredData }: Props) {
  const [weekPieType, setWeekPieType] = useState<
    "Distance" | "Time" | "Calories" | "Elevation Gain" | "Activities"
  >("Distance");

  const [displayMode, setDisplayMode] = useState<"Absolute" | "Percentage">(
    "Absolute"
  );

  const handleWeekPieTypeChange = (
    event: React.ChangeEvent<{
      value: "Distance" | "Time" | "Calories" | "Elevation Gain" | "Activities";
    }>
  ) => {
    setWeekPieType(
      event.target.value as
        | "Distance"
        | "Time"
        | "Calories"
        | "Elevation Gain"
        | "Activities"
    );
  };

  const handleDisplayModeChange = (
    event: React.ChangeEvent<{
      value: "Absolute" | "Percentage";
    }>
  ) => {
    setDisplayMode(event.target.value as "Absolute" | "Percentage");
  };

  // Aggregate data based on the selected metric
  const aggregatedData: Record<string, number> = {};

  filteredData.forEach((activity) => {
    const dateTime = dayjs(activity.DateTime);
    const dayOfWeek = dateTime.format("dddd");

    if (aggregatedData[dayOfWeek] === undefined) {
      aggregatedData[dayOfWeek] = 0;
    }

    // Adjust the aggregation based on the selected metric
    switch (weekPieType) {
      case "Distance":
        aggregatedData[dayOfWeek] += activity.Distance;
        break;
      case "Time":
        aggregatedData[dayOfWeek] += activity["Moving Time"];
        break;
      case "Calories":
        aggregatedData[dayOfWeek] += activity.Calories;
        break;
      case "Elevation Gain":
        aggregatedData[dayOfWeek] += activity["Elevation Gain"];
        break;
      case "Activities":
        aggregatedData[dayOfWeek] += 1; // Counting the number of activities
        break;
      default:
        break;
    }
  });

  const orderedDaysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const data = orderedDaysOfWeek.map((dayOfWeek, id) => ({
    id,
    value:
      displayMode === "Percentage"
        ? Math.round(
            (aggregatedData[dayOfWeek] /
              Object.values(aggregatedData).reduce((sum, v) => sum + v, 0)) *
              100
          )
        : aggregatedData[dayOfWeek].toFixed(2),
    label: dayOfWeek,
  }));

  return (
    <div>
      <div className="row" style={{ marginBottom: "20px" }}>
        <div className="col">
          <h5>{title}</h5>
        </div>
      </div>
      <div className="row">
        <div className="col-12" style={{ display: "flex", gap: "10px" }}>
          <FormControl>
            <InputLabel id="pieChartType">Metric</InputLabel>

            <Select
              id="pieChartType"
              value={weekPieType}
              onChange={handleWeekPieTypeChange}
              label="Metric"
            >
              <MenuItem value="Distance">Distance</MenuItem>
              <MenuItem value="Time">Time</MenuItem>
              <MenuItem value="Calories">Calories</MenuItem>
              <MenuItem value="Elevation Gain">Elevation Gain</MenuItem>
              <MenuItem value="Activities">Activities</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="pieChartUnit">Unit</InputLabel>

            <Select
              id="pieChartUnit"
              value={displayMode}
              label="Unit"
              onChange={handleDisplayModeChange}
            >
              <MenuItem value="Absolute">Absolute</MenuItem>
              <MenuItem value="Percentage">Percentage</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="pie-chart">
            <PieChart
              series={[
                {
                  data,
                  highlightScope: { faded: "global", highlighted: "item" },
                  cornerRadius: 5,
                  cx: 150,

                  faded: {
                    innerRadius: 30,
                    additionalRadius: -10,
                    color: "gray",
                  },
                },
              ]}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PieActiveChart;
