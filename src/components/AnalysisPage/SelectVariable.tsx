import React from "react";
import { Questions } from "../../models/patient/patientDetails";

interface SelectVariableProps {
  value: string | "";
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  currentLang: string;
}
const SelectVariable: React.FC<SelectVariableProps> = ({ value, onChange, currentLang }) => {
  return (
    <article className="prose mb-5 flex flex-row items-center gap-3">
      <select
        className="select select-bordered w-full max-w-xs text-xl"
        value={value}
        onChange={onChange}
      >
        <option disabled value="">
          {currentLang === "en" ? "Select a functional area" : currentLang === "zh" ? "选择一项功能" : "Select area"}
        </option>
        {Questions.map((val) => (
          <option key={val.code} value={val.code}>
            {currentLang === "en" ? val.question : currentLang === "zh" ? val.chineseDescription : val.question}
          </option>
        ))}
      </select>
    </article>
  );
};

export default SelectVariable;
