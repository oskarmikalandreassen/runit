import React, { useState } from "react";
import dayjs from "dayjs";
import { ActivityData } from "./types";
import { PieChart } from "@mui/x-charts/PieChart";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import { useChartContext } from "./ChartContext";
import MonthOverview from "./MonthOverview";

import { aggregateDataByMetric, getLabelForMetricType } from "../utils/helpers";

interface Props {
  title: string;
  filteredData: ActivityData[];
}

function WeekMonthTab({ title, filteredData }: Props) {
  const { weekPieType, setWeekPieType, displayMode, setDisplayMode } =
    useChartContext();

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
      value: "Value" | "Percentage";
    }>
  ) => {
    setDisplayMode(event.target.value as "Value" | "Percentage");
  };

  const aggregatedData = aggregateDataByMetric(
    filteredData,
    weekPieType,
    "weekday"
  );

  const orderedDaysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const data = orderedDaysOfWeek.map((dayOfWeek, id) => {
    const rawValue = aggregatedData[dayOfWeek];
    const value =
      displayMode === "Percentage"
        ? rawValue
          ? Math.round(
              (rawValue /
                Object.values(aggregatedData).reduce((sum, v) => sum + v, 0)) *
                100
            )
          : 0
        : rawValue
        ? Number(rawValue.toFixed(0))
        : 0;

    const label = dayOfWeek;

    return {
      id,
      value,
      label,
    };
  });

  return (
    <div>
      <div className="row" style={{ marginBottom: "20px" }}>
        <div className="col-8">
          <h5>{title}</h5>
          <h6>
            Break Down Activities Across Various Days of the Week and Months
          </h6>
        </div>
        <div className="col" style={{ display: "flex", gap: "10px" }}>
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
              <MenuItem value="Value">Value</MenuItem>
              <MenuItem value="Percentage">Percentage</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="row">
        <div className="col-5">
          <div className="pie-chart">
            <PieChart
              series={[
                {
                  data,
                  highlightScope: { faded: "global", highlighted: "item" },
                  cornerRadius: 5,
                  cx: 200,

                  faded: {
                    innerRadius: 30,
                    additionalRadius: -10,
                    color: "gray",
                  },
                  valueFormatter: (value) =>
                    displayMode === "Percentage"
                      ? `${(
                          (value.data /
                            data.reduce((acc, cur) => acc + cur.value, 0)) *
                          100
                        ).toFixed(0)}%`
                      : `${Math.round(value.data)} ${getLabelForMetricType(
                          weekPieType
                        )}`,
                },
              ]}
              height={300}
              slotProps={{
                legend: { hidden: true },
              }}
            />
          </div>
        </div>
        <div className="col">
          <MonthOverview data={filteredData}></MonthOverview>
        </div>
      </div>
    </div>
  );
}

export default WeekMonthTab;
