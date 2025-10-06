import React, { useState } from "react";
import BackButton from "../UI/Button/BackButton";
import ForwardButton from "../UI/Button/ForwardButton";
import FormContent from "./FormContent";
import LogoutButton from "../UI/Button/LogoutButton";
import { useForm } from "../../hooks/FormContext";
import { useAlert } from "../../hooks/AlertContext";
import Alert from "../UI/Alert";

const FormPage: React.FC = () => {
  const { patient, term } = useForm();
  const { alert } = useAlert();
  const [selectedTerm, setSelectedTerm] = useState<number>(term ?? 0);

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-neutral">
      {/* Fixed top banner */}
      <div className="fixed top-0 left-0 w-full bg-white z-40 shadow-md p-4 flex justify-between items-center h-20">
        {alert.message && <Alert />}
        <BackButton target="Patient Page" to="/home" />
        <div className="flex flex-row gap-4">
          {patient?.hasform && (
            <ForwardButton target="Priorities Page" to={`/priorities?term=${selectedTerm}`} />
          )}
          <LogoutButton />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full max-w-7xl px-4 mt-24 overflow-y-auto">
        {/* Term Selector */}
        <div className="mb-4">
          <label className="mr-2 font-bold">Select Term:</label>
          <select
            className="select select-bordered"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(Number(e.target.value))}
          >
            {/* Options for terms, disable all except term 0 for now */}
            {[0].map((t) => (
              <option key={t} value={t}>
                Term {t}
              </option>
            ))}
          </select>
        </div>

        {/* Form Content */}
        <div className="flex-1 w-full max-w-7xl rounded-lg overflow-y-auto">
          <FormContent
            key={selectedTerm}
            term={selectedTerm}
          />
        </div>
      </div>
    </div>
  );
};

export default FormPage;
