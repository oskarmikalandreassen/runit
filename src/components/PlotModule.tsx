// PlotModule.tsx

import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import dayjs from "dayjs";
import { ActivityData } from "./types";
import {
  filterDataByDateAndType,
  aggregateDataByTimeFilter,
  getMetricValue,
} from "../utils/helpers";

interface Props {
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  data: ActivityData[];
  activityTypeFilter: "Run" | "Swim" | null;
  timeFilter: "day" | "week" | "month" | null;
  selectedMetric: "Distance" | "Moving Time" | "Elevation Gain";
}

function PlotModule({
  startDate,
  endDate,
  data,
  activityTypeFilter,
  timeFilter,
  selectedMetric,
}: Props) {
  const filteredData = filterDataByDateAndType(
    data,
    startDate,
    endDate,
    activityTypeFilter
  );

  const aggregatedData = aggregateDataByTimeFilter(
    filteredData,
    timeFilter,
    selectedMetric
  );

  const filteredDataForChart = Object.keys(aggregatedData).map((entry) => ({
    x: entry,
    y: aggregatedData[entry],
  }));

  return (
    <LineChart
      width={1000}
      height={400}
      series={[
        {
          data: filteredDataForChart.map((entry) => entry.y),
          area: true,
        },
      ]}
      xAxis={[
        {
          scaleType: "point",
          data: filteredDataForChart.map((entry) => entry.x),
        },
      ]}
    />
  );
}

export default PlotModule;
