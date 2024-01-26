// ChartContext.tsx
import React, { createContext, useContext, useState } from "react";

interface ChartContextProps {
  weekPieType:
    | "Distance"
    | "Time"
    | "Calories"
    | "Elevation Gain"
    | "Activities";
  displayMode: "Value" | "Percentage";
  setWeekPieType: React.Dispatch<
    React.SetStateAction<
      "Distance" | "Time" | "Calories" | "Elevation Gain" | "Activities"
    >
  >;
  setDisplayMode: React.Dispatch<React.SetStateAction<"Value" | "Percentage">>;
}

const ChartContext = createContext<ChartContextProps | undefined>(undefined);

export const ChartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [weekPieType, setWeekPieType] = useState<
    "Distance" | "Time" | "Calories" | "Elevation Gain" | "Activities"
  >("Distance");
  const [displayMode, setDisplayMode] = useState<"Value" | "Percentage">(
    "Value"
  );

  const contextValue = {
    weekPieType,
    displayMode,
    setWeekPieType,
    setDisplayMode,
  };

  return (
    <ChartContext.Provider value={contextValue}>
      {children}
    </ChartContext.Provider>
  );
};

export const useChartContext = () => {
  const context = useContext(ChartContext);

  if (!context) {
    throw new Error("useChartContext must be used within a ChartProvider");
  }

  return context;
};
