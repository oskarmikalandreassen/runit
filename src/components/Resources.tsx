import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function Resources() {
  console.log("HEkko");
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}></LocalizationProvider>
  );
}

export default Resources;
