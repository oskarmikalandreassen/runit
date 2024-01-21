import dayjs from "dayjs";
import { ActivityData } from '../components/types';
import { mean } from 'lodash';


// Function to get the week key from a dayjs object
function getWeekKey(date: dayjs.Dayjs) {
    const year = date.year();
    const week = getWeekNumber(date.toDate());
    return `${year}-${week}`;
  }

export function filterDataByDateAndType(
  data: ActivityData[],
  startDate: dayjs.Dayjs | null,
  endDate: dayjs.Dayjs | null,
  activityTypeFilter: "Run" | "Swim" | null
): ActivityData[] {
  return data.filter((entry) => {
    const typedEntry = entry as ActivityData;
    const entryDate = typedEntry.DateTime;
    const startDateString = startDate?.format("YYYY-MM-DD");
    const endDateString = endDate?.format("YYYY-MM-DD");

    const isTypeMatch =
      !activityTypeFilter || typedEntry["Activity Type"] === activityTypeFilter;

    return (
      isTypeMatch &&
      (!startDateString || entryDate >= startDateString) &&
      (!endDateString || entryDate <= endDateString)
    );
  });
}

export function aggregateDataByTimeFilter(
  data: ActivityData[],
  timeFilter: "day" | "week" | "month" | null,
  metric: "Distance" | "Moving Time" | "Elevation Gain" | "Calories" | "Average Speed" | "Max Heart Rate" | "Average Cadence"
): Record<string, number> {

  const aggregatedData: Record<string, number> = {};

  function getGroupKey(date: dayjs.Dayjs): string {
    if (timeFilter === "day") {
      return date.format("YYYY-MM-DD");
    } else if (timeFilter === "week") {
      return getWeekKey(date);
    } else if (timeFilter === "month") {
      return date.startOf("month").format("YYYY-MM-DD");
    } else {
      return "";
    }
  }

  data.forEach((entry) => {
    const date = dayjs(entry.DateTime);
    const groupKey = getGroupKey(date);
  
    const metricValue = getMetricValue(entry, metric, data);
  
    if (typeof metricValue === "number") {
      if (["Average Speed", "Max Heart Rate", "Average Cadence"].includes(metric)) {
        const groupedValues = data
          .filter((e) => getGroupKey(dayjs(e.DateTime)) === groupKey)
          .map((e) => getMetricValue(e, metric, data))
          .filter(value => value !== 0); 
  
        const averageValue = mean(groupedValues) || 0;
  
        aggregatedData[groupKey] = averageValue;
      } else {
        aggregatedData[groupKey] = (aggregatedData[groupKey] || 0) + metricValue;
      }
    }
  });
  

  return aggregatedData;
}

  // Function to get the ISO week number of a date
function getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
    return weekNo;
  }

  export function getMetricValue(entry: ActivityData, metric: "Distance" | "Moving Time" | "Elevation Gain" | "Calories" | "Average Speed" | "Max Heart Rate" | "Average Cadence", data: ActivityData[]): number {
    switch (metric) {
      case "Distance":
        return entry.Distance || 0;
      case "Moving Time":
        return (entry["Moving Time"] || 0) / 3600;
      case "Elevation Gain":
        return entry["Elevation Gain"] || 0;
      case "Calories":
        return entry["Calories"] || 0;
      case "Average Speed":
        const averageSpeed = entry["Average Speed"] || 0;
        return averageSpeed !== 0 ? 1 / (averageSpeed * 60 / 1000) : 0;
      case "Max Heart Rate":
        return entry["Max Heart Rate"] || 0;
      case "Average Cadence":
        return entry["Average Cadence"] || 0;
      default:
        return 0;
    }
  }

  
  