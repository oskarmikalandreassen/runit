import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PaceChart from "./PaceChart";

function Resources() {
  return (
    <>
      <div className="container">
        <div className="form-container">
          <PaceChart />
        </div>
      </div>
    </>
  );
}

export default Resources;
