import React from "react";

export interface RadioInputProps {
  name: string;
  label: string;
  value: string;
  disabled?: boolean;
  checked?: boolean;
  onChange: (value: string) => void;
}

const RadioInput: React.FC<RadioInputProps> = ({
  name,
  label,
  value,
  disabled = false,
  checked = false,
  onChange,
}) => {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <input
        type="radio"
        name={name}
        className="radio radio-accent bg-white checked:bg-accent"
        value={value}
        onChange={() => onChange(value)} // Pass only value
        checked={checked}
        disabled={disabled}
      />
      <span>{label}</span>
    </div>
  );
};

export default RadioInput;
