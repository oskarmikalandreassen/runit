import { ReactNode } from "react";

interface Props {
  overviewTitle: string;
  statsDict: { [key: string]: ReactNode }; // Define the type for statsDict
}

const StatsOverview = ({ overviewTitle, statsDict }: Props) => {
  return (
    <div>
      <h5>{overviewTitle}</h5>
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
