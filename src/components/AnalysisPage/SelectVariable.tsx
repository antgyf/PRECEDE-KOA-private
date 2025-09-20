import React from "react";
import { Questions } from "../../models/patient/patientDetails";

interface SelectVariableProps {
  value: string | "";
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
const SelectVariable: React.FC<SelectVariableProps> = ({ value, onChange }) => {
  return (
    <article className="prose mb-5 flex flex-row items-center gap-3">
      <h3 className="font-semibold">Select area:</h3>

      <select
        className="select select-bordered w-full max-w-xs"
        value={value}
        onChange={onChange}
      >
        <option disabled value="">
          Select area
        </option>
        {Questions.map((val) => (
          <option key={val.name} value={val.name}>
            {val.question}
          </option>
        ))}
      </select>
    </article>
  );
};

export default SelectVariable;
