import dayjs from "dayjs";
import { ActivityData } from '../components/types';
import { Dictionary, mean } from 'lodash';


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
  timeFilter: "Day" | "Week" | "Month" | null,
  metric: "Distance" | "Moving Time" | "Elevation Gain" | "Calories" | "Average Speed" | "Max Heart Rate" | "Average Cadence"
): Record<string, number> {

  const aggregatedData: Record<string, number> = {};

  function getGroupKey(date: dayjs.Dayjs): string {
    if (timeFilter === "Day") {
      return date.format("YYYY-MM-DD");
    } else if (timeFilter === "Week") {
      return getWeekKey(date);
    } else if (timeFilter === "Month") {
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

  // Function to get the week key from a dayjs object
function getWeekKey(date: dayjs.Dayjs) {
  const year = date.year();
  const week = getWeekNumber(date.toDate());
  return `${year}-${week}`;
}


export function calculateMetrics(data: ActivityData[], timePeriod: string): Dictionary<any> {

  const getDateKey = (date: dayjs.Dayjs, timePeriod: string) => {
    if (timePeriod === 'Day') {
      return date.format('YYYY-MM-DD');
    } else if (timePeriod === 'Week') {
      return getWeekKey(date);
    } else if (timePeriod === 'Month') {
      return date.format('YYYY-MM');
    }
    return ''; 
  };
  
  const groupedData: Dictionary<ActivityData[]> = data.reduce((result: Dictionary<ActivityData[]>, entry) => {
    const dateKey = getDateKey(dayjs(entry.DateTime), timePeriod);
    if (!result[dateKey]) {
      result[dateKey] = [];
    }
    result[dateKey].push(entry);
    return result;
  }, {});
  
  const totalPeriods = Object.keys(groupedData).length;

  const distances = data.map((entry) => entry.Distance);
  const validDistances = distances.filter((dist) => !isNaN(dist));
  const totalDistance = validDistances.reduce((sum, distance) => sum + distance, 0);
  const totalAverageDistance = totalPeriods > 0 ? totalDistance / totalPeriods : 0;

  const times = data.map((entry) => entry['Moving Time']);
  const validTimes = times.filter((time) => !isNaN(time));
  const totalTimeInSeconds = validTimes.reduce((sum, time) => sum + time, 0);
  const totalAverageTime = totalPeriods > 0 ? totalTimeInSeconds / totalPeriods : 0;

  const activitiesCount = data.length;
  const averageActivities = totalPeriods > 0 ? activitiesCount / totalPeriods : 0;


  const elevGains = data.map((entry) => entry['Elevation Gain']);
  const validElevGains = elevGains.filter((elevGain) => !isNaN(elevGain));
  const totalElevGain = validElevGains.reduce((sum, elevGain) => sum + elevGain, 0);
  const averageElevGain = totalPeriods > 0 ? totalElevGain / totalPeriods : 0;

  const longestRunDistance = Math.max(...data.map((entry) => entry.Distance));

  const threeKData = data.filter((entry) => entry.Distance >= 3.0 && entry.Distance <= 3.2);
  const fiveKData = data.filter((entry) => entry.Distance >= 5.0 && entry.Distance <= 5.2);
  const tenKData = data.filter((entry) => entry.Distance >= 10.0 && entry.Distance <= 10.3);
  const halfMarathonData = data.filter((entry) => entry.Distance >= 21.1 && entry.Distance <= 21.4);
  const marathonData = data.filter((entry) => entry.Distance >= 42.1 && entry.Distance <= 42.6);

  const threeKDistance = threeKData.length > 0 ? Math.min(...threeKData.map((entry) => entry['Moving Time'])) : 0;
  const fiveKDistance = fiveKData.length > 0 ? Math.min(...fiveKData.map((entry) => entry['Moving Time'])) : 0;
  const tenKDistance = tenKData.length > 0 ? Math.min(...tenKData.map((entry) => entry['Moving Time'])) : 0;
  const halfMarathonDistance =
      halfMarathonData.length > 0 ? Math.min(...halfMarathonData.map((entry) => entry['Moving Time'])) : 0;
  const marathonDistance = marathonData.length > 0 ? Math.min(...marathonData.map((entry) => entry['Moving Time'])) : 0;

  const overallPerformance = {
    ["Distance / " + String(timePeriod)]: totalAverageDistance.toFixed(2),
    ["Time / " + String(timePeriod)]: formatTime(totalAverageTime),
    ["Elev Gain / " + String(timePeriod)]: averageElevGain.toFixed(2),
    ["Activities / " + String(timePeriod)]: averageActivities.toFixed(0),
    "Longest Run": longestRunDistance.toFixed(2),
  };
  
  
  const distanceMetrics = {
    "3k": formatTime(threeKDistance),
    "5k": formatTime(fiveKDistance),
    "10k": formatTime(tenKDistance),
    "Half-Marathon": formatTime(halfMarathonDistance),
    "Marathon": formatTime(marathonDistance),
  };
  
  return { overallPerformance, distanceMetrics };
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const remainingMinutes = Math.floor(remainingSeconds % 60);

  let formattedTime = '';
  if (hours > 0) {
      formattedTime += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) {
      formattedTime += `${minutes}m `;
  }
  formattedTime += `${remainingMinutes}s`;
  return formattedTime.trim();
}









  
  