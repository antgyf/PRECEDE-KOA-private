import React from "react";

interface SelectInputProps {
  name: string;
  label: string;
  currValue?: string;
  list: Record<string, string>;
  placeholder?: string; // Optional placeholder
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({
  name,
  label,
  currValue,
  list,
  placeholder,
  onChange,
}) => {
  return (
    <label className="form-control w-full">
      <article className="prose label">
        <h4>{label}</h4>
      </article>
      <select
        name={name}
        className="select select-bordered w-full text-[16px]"
        onChange={onChange}
        defaultValue={`${currValue} || Please select`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {Object.entries(list).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </label>
  );
};

export default SelectInput;
