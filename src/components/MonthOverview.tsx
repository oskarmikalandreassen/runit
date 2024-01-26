import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { ActivityData } from "./types";

interface Props {
  data: ActivityData[];
}

export default function MonthOverview({ data }: Props) {
  // Helper function to extract the month from the DateTime column
  const extractMonth = (dateTime: string) => {
    const dateParts = dateTime.split("-");
    return dateParts[1]; // Month is the second part in "YYYY-MM-DD"
  };

  // Helper function to calculate the number of activities per month
  const calculateActivitiesPerMonth = () => {
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
    const activitiesPerMonth = data.reduce((acc: any, activity) => {
      const monthIndex = parseInt(extractMonth(activity.DateTime), 10) - 1; // Adjust to 0-based index
      const monthAbbreviation = monthAbbreviations[monthIndex];
      acc[monthAbbreviation] = (acc[monthAbbreviation] || 0) + 1;
      return acc;
    }, {});
    return monthAbbreviations.map((monthAbbreviation) => ({
      month: monthAbbreviation,
      count: activitiesPerMonth[monthAbbreviation] || 0,
    }));
  };

  const activitiesPerMonthData = calculateActivitiesPerMonth();

  return (
    <BarChart
      dataset={activitiesPerMonthData}
      yAxis={[{ scaleType: "band", dataKey: "month" }]}
      series={[
        {
          dataKey: "count",
          valueFormatter: (value) => `${value} activities`,
        },
      ]}
      layout="horizontal"
      width={500}
      height={400}
    />
  );
}
