import dayjs from "dayjs";
import { ReactNode } from "react";

type SelectedDatesType = {
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
};

interface Props {
  overviewTitle: string;
  selectedDates: SelectedDatesType;
  statsDict: { [key: string]: ReactNode }; // Define the type for statsDict
}

const StatsOverview = ({ overviewTitle, selectedDates, statsDict }: Props) => {
  return (
    <div>
      <div className="col-12" style={{ display: "flex", gap: "10px" }}>
        <h5>{overviewTitle}</h5>
        {selectedDates.startDate && selectedDates.endDate && (
          <h5 style={{ color: "lightgray" }}>
            {selectedDates.startDate.format("DD/MM/YYYY") +
              " - " +
              selectedDates.endDate.format("DD/MM/YYYY")}
          </h5>
        )}
      </div>{" "}
      <div
        className="row"
        style={{ marginTop: "20px", paddingLeft: "10px", paddingRight: "10px" }}
      >
        <table className="table table-striped">
          <tbody>
            {Object.entries(statsDict).map(([metric, value], index) => (
              <tr key={index}>
                <th scope="row">{metric}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsOverview;
