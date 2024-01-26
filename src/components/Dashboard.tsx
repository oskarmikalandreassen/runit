import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import PlotModule from "./PlotModule";
import RadioGroup from "./RadioGroup";
import StatsOverview from "./StatsOverview";
import DateSelector from "./DateSelector";
import PieChart from "./PieActiveChart";

import {
  filterDataByDateAndType,
  aggregateDataByTimeFilter,
  calculateMetrics,
} from "../utils/helpers";

import { ActivityData } from "./types";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";

interface Props {
  data: ActivityData[];
}

function Dashboard({ data }: Props) {
  // DATE SELECTORS

  const [selectedDates, setSelectedDates] = useState<{
    startDate: dayjs.Dayjs | null;
    endDate: dayjs.Dayjs | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const handleStartDateChange = (startDate: dayjs.Dayjs | null) => {
    setSelectedDates((prevDates) => ({
      ...prevDates,
      startDate: startDate ? dayjs(startDate) : null,
    }));
  };

  const handleEndDateChange = (endDate: dayjs.Dayjs | null) => {
    setSelectedDates((prevDates) => ({
      ...prevDates,
      endDate: endDate ? dayjs(endDate) : null,
    }));
  };

  // SELECTORS

  const [activityType, setActivityType] = useState<"Run" | "Swim">("Run");
  const handleActivityTypeChange = (
    event: React.ChangeEvent<{ value: "Run" | "Swim" }>
  ) => {
    setActivityType(event.target.value as "Run" | "Swim");
  };

  const [timePeriod, setTimePeriod] = useState<"Day" | "Week" | "Month">(
    "Week"
  );
  const handleTimePeriodChange = (
    event: React.ChangeEvent<{ value: "Day" | "Week" | "Month" }>
  ) => {
    setTimePeriod(event.target.value as "Day" | "Week" | "Month");
  };

  // RADIO GROUP

  const [selectedMetric, setSelectedMetric] = useState<any>("Distance");
  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
  };

  const distanceTimeElevMetrics = [
    "Distance",
    "Moving Time",
    "Elevation Gain",
    "Calories",
    "Average Cadence",
    "Average Speed",
    "Max Heart Rate",
  ];

  // FILTERING AND AGGREGATING DATA

  const filteredData = filterDataByDateAndType(
    data,
    selectedDates.startDate,
    selectedDates.endDate,
    activityType
  );

  const aggregatedData = aggregateDataByTimeFilter(
    filteredData,
    timePeriod,
    selectedMetric
  );

  const metrics = calculateMetrics(filteredData, timePeriod);
  const overallPerformance = metrics.overallPerformance;
  const distanceMetrics = metrics.distanceMetrics;

  // SCROLLING
  const [isSticky, setIsSticky] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 30); // Change the threshold as needed
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={`sticky-container ${isSticky ? "sticky" : ""}`}>
        <div className="form-container">
          <div className="row">
            <div className="col-4" style={{ display: "flex", gap: "10px" }}>
              <DateSelector
                label="Start Date"
                selectedDate={selectedDates.startDate}
                onDateChange={handleStartDateChange}
              />
              <DateSelector
                label="End Date"
                selectedDate={selectedDates.endDate}
                onDateChange={handleEndDateChange}
              />
            </div>

            <div className="col-5"></div>

            <div className="col" style={{ display: "flex", gap: "10px" }}>
              <FormControl>
                <InputLabel id="activityType">Activity</InputLabel>
                <Select
                  id="activityType"
                  value={activityType}
                  onChange={handleActivityTypeChange}
                  label="Activity"
                >
                  <MenuItem value="Run">Run</MenuItem>
                  <MenuItem value="Swim">Swim</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="timePeriod">Period</InputLabel>
                <Select
                  id="timePeriod"
                  value={timePeriod}
                  onChange={handleTimePeriodChange}
                  label="Period"
                >
                  <MenuItem value="Day">Day</MenuItem>
                  <MenuItem value="Week">Week</MenuItem>
                  <MenuItem value="Month">Month</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="form-container">
          <div className="row">
            <div className="col-6" style={{ display: "flex", gap: "10px" }}>
              <h5>{"Activities Overview"}</h5>
              {selectedDates.startDate && selectedDates.endDate && (
                <h5 style={{ color: "lightgray" }}>
                  {String(selectedDates.startDate.format("DD/MM/YYYY")) +
                    " - " +
                    String(selectedDates.endDate.format("DD/MM/YYYY"))}
                </h5>
              )}
            </div>
          </div>

          <PlotModule data={aggregatedData} />
          <div className="radio-group-container text-center">
            <RadioGroup
              options={distanceTimeElevMetrics}
              selectedOption={selectedMetric}
              onOptionChange={handleMetricChange}
            />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="form-container">
          <div className="row">
            <div className="col">
              <StatsOverview
                overviewTitle={
                  (timePeriod === "Day" ? "Daily" : timePeriod + "ly") +
                  " Performance"
                }
                selectedDates={selectedDates}
                statsDict={overallPerformance}
              />
            </div>
            <div className="col">
              <StatsOverview
                overviewTitle={"Estimated Best Efforts"}
                selectedDates={selectedDates}
                statsDict={distanceMetrics}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="form-container">
          <div className="row">
            <div className="col">
              <PieChart title="Week Breakdown" filteredData={filteredData} />
            </div>
            <div className="col"></div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default Dashboard;
