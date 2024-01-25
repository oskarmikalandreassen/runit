import React from "react";

interface RadioGroupProps {
  options: string[];
  selectedOption: string;
  onOptionChange: (option: string) => void;
}

function RadioGroup({
  options,
  selectedOption,
  onOptionChange,
}: RadioGroupProps) {
  return (
    <div className="btn-group" role="group">
      {options.map((option, index) => (
        <React.Fragment key={option}>
          <input
            type="radio"
            className="btn-check"
            name="options"
            style={{ color: "#02d5d1" }}
            id={`option${index + 1}`}
            autoComplete="off"
            checked={selectedOption === option}
            onChange={() => onOptionChange(option)}
          />
          <label
            className={`btn btn-secondary ${
              selectedOption === option ? "active" : ""
            }`}
            htmlFor={`option${index + 1}`}
          >
            {option}
          </label>
        </React.Fragment>
      ))}
    </div>
  );
}

export default RadioGroup;
