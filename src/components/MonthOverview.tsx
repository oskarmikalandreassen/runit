// MonthOverview.tsx
import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { ActivityData } from "./types";
import { useChartContext } from "./ChartContext";

import { aggregateDataByMetric, getLabelForMetricType } from "../utils/helpers";

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

  return (
    <BarChart
      dataset={activitiesPerMonthData}
      yAxis={[{ scaleType: "band", dataKey: "month" }]}
      series={[
        {
          dataKey: "count",
          valueFormatter: (value) =>
            displayMode === "Value"
              ? `${(
                  (value /
                    activitiesPerMonthData.reduce(
                      (acc, cur) => acc + cur.count,
                      0
                    )) *
                  100
                ).toFixed(0)}%`
              : `${Math.round(value)} ${getLabelForMetricType(weekPieType)}`,
        },
      ]}
      layout="horizontal"
      width={500}
      height={350}
    />
  );
}
