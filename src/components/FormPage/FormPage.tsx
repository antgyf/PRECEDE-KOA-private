import React, { useState } from "react";
import BackButton from "../UI/Button/BackButton";
import ForwardButton from "../UI/Button/ForwardButton";
import LogoutButton from "../UI/Button/LogoutButton";
import FormContent from "./FormContent";
import Alert from "../UI/Alert";
import { useForm } from "../../hooks/FormContext";
import { useAlert } from "../../hooks/AlertContext";
import LanguageDropdown from "../UI/Button/LanguageDropdown"; // 👈 import your new component

const FormPage: React.FC = () => {
  const { patient, term } = useForm();
  const { alert } = useAlert();
  const [selectedTerm, setSelectedTerm] = useState<number>(term ?? 0);
  const [currentLang, setCurrentLang] = useState<string>("en"); // State for current language

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-neutral">
      {/* Fixed top banner */}
      <div className="fixed top-0 left-0 w-full bg-white z-40 shadow-md p-4 flex justify-between items-center h-20">
        {alert.message && <Alert />}

        {/* Left side: Back button */}
        <div className="flex items-center">
          <BackButton target={currentLang === "en" ? "Patient Page" : currentLang === "zh" ? "病人主页" : ""} to="/home" />
        </div>

        {/* Center: Language dropdown */}
        <div className="flex-1 flex justify-center">
          <LanguageDropdown currentLang={currentLang} onChange={setCurrentLang} />
        </div>

        {/* Right side: Forward + Logout buttons */}
        <div className="flex flex-row gap-4 items-center">
          {patient?.hasform && (
            <ForwardButton target={currentLang === "en" ? "Priorities Page" : currentLang === "zh" ? "优先事项页" : ""} to={`/priorities?term=${selectedTerm}`} />
          )}
          <LogoutButton language={currentLang} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full max-w-7xl px-4 mt-24 overflow-y-auto">
        {/* Term Selector */}
        <div className="mb-4">
          <label className="mr-2 font-bold"> {currentLang === "en" ? "Select Term:" : currentLang === "zh" ? "选择期间:" : ""}</label>
          <select
            className="select select-bordered"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(Number(e.target.value))}
          >
            {[0].map((t) => (
              <option key={t} value={t}>
                {currentLang === "en" ? `Term ${t}` : currentLang === "zh" ? `期间 ${t}` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Form Content */}
        <div className="flex-1 w-full max-w-7xl rounded-lg overflow-y-auto">
          <FormContent key={selectedTerm} term={selectedTerm} language={currentLang} />
        </div>
      </div>
    </div>
  );
};

export default FormPage;
