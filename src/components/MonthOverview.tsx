// MonthOverview.tsx
import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { ActivityData } from "./types";
import { aggregateDataByMetric } from "../utils/helpers";
import { useChartContext } from "./ChartContext";

interface Props {
  data: ActivityData[];
}

export default function MonthOverview({ data }: Props) {
  const monthAbbreviations = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const { weekPieType, setWeekPieType, displayMode, setDisplayMode } =
    useChartContext();

  // Aggregate data by month, disregarding years
  const aggregatedData = aggregateDataByMetric(data, weekPieType, "month");

  // Sum up the values for each month
  const activitiesPerMonthData = monthAbbreviations.map(
    (monthAbbreviation, index) => {
      const sum = Object.entries(aggregatedData)
        .filter(
          ([key]) =>
            key.endsWith(`-${index + 1}`) || key.endsWith(`-0${index + 1}`)
        )
        .reduce((total, [, value]) => total + value, 0);

      return {
        month: monthAbbreviation,
        count: sum || 0,
      };
    }
  );

  // Function to map weekPieType to label
  const getLabelForWeekPieType = (type: string) => {
    switch (type) {
      case "Activities":
        return "activities";
      case "Distance":
        return "km";
      case "Time":
        return "sec";
      case "Elevation Gain":
        return "m";
      case "Calories":
        return "kcal";
      default:
        return "";
    }
  };

  return (
    <BarChart
      dataset={activitiesPerMonthData}
      yAxis={[{ scaleType: "band", dataKey: "month" }]}
      series={[
        {
          dataKey: "count",
          valueFormatter: (value) =>
            `${Math.round(value)} ${getLabelForWeekPieType(weekPieType)}`,
        },
      ]}
      layout="horizontal"
      width={500}
      height={340}
    />
  );
}
