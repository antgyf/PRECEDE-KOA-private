import React, { useState } from "react";
import BackButton from "../UI/Button/BackButton";
import ForwardButton from "../UI/Button/ForwardButton";
import LogoutButton from "../UI/Button/LogoutButton";
import FormContent from "./FormContent";
import Alert from "../UI/Alert";
import { useForm } from "../../hooks/FormContext";
import { useAlert } from "../../hooks/AlertContext";
import LanguageToggle from "../UI/Button/LanguageToggle";
import { useLocation } from "react-router-dom";

const FormPage: React.FC = () => {
  const { patient, term } = useForm();
  const { alert } = useAlert();

  // Read search params
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  // Read ?lang= from URL
  const urlLang = query.get("lang");

  // Initialize language from URL, fallback to "en"
  const [currentLang, setCurrentLang] = useState<string>(urlLang ?? "en");

  // Term dropdown
  const [selectedTerm] = useState<number>(term ?? 0);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-neutral max-lg:dark:bg-neutral max-lg:text-gray-900 max-lg:dark:text-gray-900">
      {alert.message && <Alert />}

      {/* Fixed top banner */}
      <div className="fixed top-0 left-0 w-full bg-white text-gray-900 z-40 shadow-md p-3 sm:p-4 min-h-20 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 max-lg:dark:bg-white max-lg:dark:text-gray-900">
        {/* Left side: Back */}
        <div className="flex items-center justify-start min-w-0">
          <BackButton
            target={
              currentLang === "en"
                ? "Patient Page"
                : currentLang === "zh"
                ? "患者主页"
                : ""
            }
            to={`/home?lang=${currentLang}`}
          />
        </div>

        {/* Center: Language Dropdown */}
        <div className="flex items-center justify-center">
          <LanguageToggle
            currentLang={currentLang}
            onChange={setCurrentLang}
          />
        </div>

        {/* Right side: Forward + Logout */}
        <div className="flex flex-row gap-2 sm:gap-4 items-center justify-end min-w-0">
          {patient?.hasform && (
            <ForwardButton
              target={
                currentLang === "en"
                  ? "Priorities Page"
                  : currentLang === "zh"
                  ? "优先事项页"
                  : ""
              }
              to={`/priorities?term=${selectedTerm}&lang=${currentLang}`}
            />
          )}

          <LogoutButton language={currentLang} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full max-w-7xl px-4 mt-28 sm:mt-24 overflow-y-auto">
        {/* Form Content */}
        <div className="flex-1 w-full max-w-7xl rounded-lg overflow-y-auto">
          <FormContent
            key={selectedTerm}
            term={selectedTerm}
            language={currentLang}
          />
        </div>
      </div>
    </div>
  );
};

export default FormPage;