import React, { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

interface Props {
  label: string;
  selectedDate: dayjs.Dayjs | null;
  onDateChange: (newDate: dayjs.Dayjs | null) => void;
}

function DateSelector({ selectedDate, onDateChange, label }: Props) {
  const [date, setSelectedDate] = useState<dayjs.Dayjs | null>(selectedDate);

  useEffect(() => {
    setSelectedDate(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setSelectedDate(dayjs(newDate));
      onDateChange(dayjs(newDate));
    } else {
      setSelectedDate(null);
      onDateChange(null);
    }
  };

  return (
    <DatePicker
      label={label}
      value={date ? date.toDate() : null}
      onChange={handleDateChange}
      format="DD/MM/YYYY"
    />
  );
}

export default DateSelector;
