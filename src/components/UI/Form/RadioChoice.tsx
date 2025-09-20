import React from "react";
import RadioInput from "./RadioInput";

export interface RadioChoiceProps {
  question: string;
  list: Record<number, string>;
  name: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const RadioChoice: React.FC<RadioChoiceProps> = ({
  question,
  list,
  name,
  disabled = false,
  value = "",
  onChange,
}) => {
  const handleRadioChange = (key: string) => {
    if (onChange) onChange(key);
  };

  return (
    <div className="form-control">
      <article className="prose mb-1">
        <h4>{question}</h4>
      </article>

      {Object.entries(list).map(([key, displayValue]) => (
        <RadioInput
          key={key}
          name={name}
          value={key}
          label={displayValue}
          onChange={() => handleRadioChange(key)} // Ensure only value is passed
          disabled={disabled}
          checked={value.toString() === key}
        />
      ))}
    </div>
  );
};

export default RadioChoice;
