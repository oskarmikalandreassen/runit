import { LineChart } from "@mui/x-charts/LineChart";
import { ActivityData } from "./types";

interface Props {
  data: ActivityData[];
}

function PlotModule({ data }: Props) {
  const filteredDataForChart = Object.keys(data).map((entry: any) => ({
    x: entry,
    y: data[entry],
  }));

  return (
    <LineChart
      width={1000}
      height={400}
      series={[
        {
          data: filteredDataForChart.map((entry: any) => entry.y),
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
