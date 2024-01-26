import React, { useState, useEffect, ReactNode } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";

const PaceChart = () => {
  const [paceFormat, setPaceFormat] = useState<"min/km" | "min/mi" | null>(
    null
  );

  const handlePaceFormatChange = (
    event: React.ChangeEvent<{ value: "min/km" | "min/mi" }>
  ) => {
    setPaceFormat(event.target.value as "min/km" | "min/mi");
  };

  const [minsPerKm, setMinsPerKm] = useState(0);
  const [minsPerMile, setMinsPerMile] = useState(0);

  const [paceInput, setPaceInput] = useState<string | null>(null); // Updated to allow string or null

  useEffect(() => {
    if (paceInput !== null) {
      const [minutes, seconds] = paceInput.split(":").map(Number);
      const totalSeconds = minutes * 60 + seconds;

      if (paceFormat === "min/km") {
        setMinsPerKm(totalSeconds);
        setMinsPerMile(totalSeconds * 1.621371192);
      } else {
        setMinsPerMile(totalSeconds);
        setMinsPerKm(totalSeconds / 1.621371192);
      }
    }
  }, [paceInput, paceFormat]);

  const calculateTime = (totalSeconds: number) => {
    if (isNaN(totalSeconds)) {
      return " ";
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds.toFixed(0)).padStart(2, "0")}`;

    return formattedTime;
  };

  const time5K = calculateTime(
    paceFormat === "min/km"
      ? minsPerKm * 5
      : (1 / 1.621371192) * minsPerMile * 5
  );
  const time10K = calculateTime(
    paceFormat === "min/km"
      ? minsPerKm * 10
      : (1 / 1.621371192) * minsPerMile * 10
  );
  const timeHalfMarathon = calculateTime(
    paceFormat === "min/km"
      ? minsPerKm * 21.0975
      : (1 / 1.621371192) * minsPerMile * 21.0975
  );
  const timeMarathon = calculateTime(
    paceFormat === "min/km"
      ? minsPerKm * 42.195
      : (1 / 1.621371192) * minsPerMile * 42.195
  );

  return (
    <div className="container">
      <div className="form-container">
        <div>
          <h5>Pace Chart</h5>
          <h6>
            Enter your pace to see corresponding duration for various distances.
          </h6>
        </div>
        <div className="row" style={{ marginTop: "20px", textAlign: "center" }}>
          <div className="col-3" style={{ display: "flex", gap: "10px" }}>
            <TextField
              id="standard-basic"
              label="Pace (mm:ss)"
              variant="outlined"
              value={paceInput}
              onChange={(e: any) => setPaceInput(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="paceFormat">Unit</InputLabel>

              <Select
                id="paceFormat"
                value={paceFormat}
                onChange={handlePaceFormatChange}
                label="Unit"
              >
                <MenuItem value="min/km">min/km</MenuItem>
                <MenuItem value="min/mi">min/mi</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-7"></div>
        </div>
        <div className="row" style={{ marginTop: "20px", textAlign: "center" }}>
          <table>
            <thead>
              <tr>
                <th>min/km</th>
                <th>min/mi</th>
                <th>5K</th>
                <th>10K</th>
                <th>Half-Marathon</th>
                <th>Marathon</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{calculateTime(minsPerKm)}</td>
                <td>{calculateTime(minsPerMile)}</td>
                <td>{time5K}</td>
                <td>{time10K}</td>
                <td>{timeHalfMarathon}</td>
                <td>{timeMarathon}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaceChart;
