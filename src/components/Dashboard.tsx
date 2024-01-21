import React, { useState } from "react";
import dayjs from "dayjs";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import PlotModule from "./PlotModule";
import RadioGroup from "./RadioGroup";
import DateSelector from "./DateSelector";
import { ActivityData } from "./types";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface Props {
  data: ActivityData[];
}

function Dashboard({ data }: Props) {
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

  const [activityType, setActivityType] = useState<"Run" | "Swim">("Run");

  const handleActivityTypeChange = (
    event: React.ChangeEvent<{ value: "Run" | "Swim" }>
  ) => {
    setActivityType(event.target.value as "Run" | "Swim");
  };

  const [timePeriod, setTimePeriod] = useState<"day" | "week" | "month">(
    "week"
  );

  const handleTimePeriodChange = (
    event: React.ChangeEvent<{ value: "day" | "week" | "month" }>
  ) => {
    setTimePeriod(event.target.value as "day" | "week" | "month");
  };

  const [selectedMetric, setSelectedMetric] = useState<string>("Distance");
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
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="container">
        <div className="form-container">
          <div className="row">
            <div className="col">
              <DateSelector
                label="Start Date"
                selectedDate={selectedDates.startDate}
                onDateChange={handleStartDateChange}
              />
            </div>
            <div className="col">
              <DateSelector
                label="End Date"
                selectedDate={selectedDates.endDate}
                onDateChange={handleEndDateChange}
              />
            </div>
            <div className="col">
              <Select
                value={activityType}
                onChange={handleActivityTypeChange}
                label="Activity Type"
              >
                <MenuItem value="Run">Run</MenuItem>
                <MenuItem value="Swim">Swim</MenuItem>
              </Select>
            </div>
            <div className="col">
              <Select
                value={timePeriod}
                onChange={handleTimePeriodChange}
                label="Time Period"
              >
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
              </Select>
            </div>
          </div>
          <PlotModule
            startDate={selectedDates.startDate}
            endDate={selectedDates.endDate}
            data={data as ActivityData[]}
            activityTypeFilter={activityType}
            timeFilter={timePeriod}
            selectedMetric={selectedMetric}
          />
          <div className="radio-group-container text-center">
            <RadioGroup
              options={distanceTimeElevMetrics}
              selectedOption={selectedMetric}
              onOptionChange={handleMetricChange}
            />
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default Dashboard;
