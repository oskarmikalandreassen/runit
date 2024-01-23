import { ReactNode } from "react";

interface Props {
  overviewTitle: string;
  statsDict: { [key: string]: ReactNode }; // Define the type for statsDict
}

const StatsOverview = ({ overviewTitle, statsDict }: Props) => {
  return (
    <div>
      <h5>{overviewTitle}</h5>
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
  );
};

export default StatsOverview;
