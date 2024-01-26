import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PaceChart from "./PaceChart";
import VDOTCalculator from "./VDOTCalculator";

function Resources() {
  return (
    <>
      <PaceChart />
      <VDOTCalculator />
    </>
  );
}

export default Resources;
