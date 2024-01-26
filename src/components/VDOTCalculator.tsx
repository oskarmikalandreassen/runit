import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";

const VDOTCalculator = () => {
  const [eventDistance, setEventDistance] = useState<
    "3k" | "5k" | "10k" | "Half-Marathon" | "Marathon" | null
  >(null);

  const handleEventDistanceChange = (
    event: React.ChangeEvent<{
      value: "3k" | "5k" | "10k" | "Half-Marathon" | "Marathon";
    }>
  ) => {
    setEventDistance(
      event.target.value as "3k" | "5k" | "10k" | "Half-Marathon" | "Marathon"
    );
  };

  const [paceInput, setPaceInput] = useState("");
  useEffect(() => {
    const [hours, minutes, seconds] = paceInput.split(":").map(Number);
    const totalSeconds = hours * 60 * 60 + minutes * 60 + seconds;
  }, [paceInput]);

  return (
    <div className="container">
      <div className="form-container">
        <div className="row">
          <div className="col-12 mb-3">
            <h5>VDOT Running Calculator</h5>
            <h6>Get your training paces.</h6>
          </div>
          <div>
            <FormControl fullWidth>
              <InputLabel id="eventDistance">Event Distance</InputLabel>
              <Select
                id="eventDistance"
                value={eventDistance}
                onChange={handleEventDistanceChange}
                label="Event Distance"
              >
                <MenuItem value="3k">3k</MenuItem>
                <MenuItem value="5k">5k</MenuItem>
                <MenuItem value="10k">10k</MenuItem>
                <MenuItem value="Half-Marathon">Half-Marathon</MenuItem>
                <MenuItem value="Marathon">Marathon</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            <TextField
              id="standard-basic"
              label="Time (hh:mm:ss)"
              variant="outlined"
              value={paceInput}
              onChange={(e: any) => setPaceInput(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VDOTCalculator;
