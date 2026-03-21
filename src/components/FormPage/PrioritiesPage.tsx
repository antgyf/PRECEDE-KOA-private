import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../UI/Button/BackButton";
import ForwardButton from "../UI/Button/ForwardButton";
import LogoutButton from "../UI/Button/LogoutButton";
import { useAlert } from "../../hooks/AlertContext";
import Alert from "../UI/Alert";
import PrioritiesContent from "./PriorityContent";
import { useForm } from "../../hooks/FormContext";
import LanguageDropdown from "../UI/Button/LanguageDropdown";


const PrioritiesPage: React.FC = () => {
  const { alert } = useAlert();
  const { form } = useForm();

  // Read search params
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  // Extract values
  const term = Number(query.get("term"));
  const urlLang = query.get("lang"); // <-- read language

  // Initialize language based on URL (fallback to "en")
  const [currentLang, setCurrentLang] = useState<string>(urlLang ?? "en");

  if (isNaN(term)) {
    return <div>Error: No term specified</div>;
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-neutral">
      {/* Fixed top banner */}
      <div className="fixed top-0 left-0 w-full bg-white z-40 shadow-md p-4 flex justify-between items-center h-20">
        {alert.message && <Alert />}

        <div className="flex items-center">
          <BackButton
            target={currentLang === "en" ? "Form Page" : currentLang === "zh" ? "表格页" : ""}
            to={`/form?lang=${currentLang}`} // keep lang across navigation
          />
        </div>

        <div className="flex-1 flex justify-center">
          <LanguageDropdown currentLang={currentLang} onChange={setCurrentLang} />
        </div>

        <div className="flex flex-row gap-4 items-center">
          {form?.priorities && form?.priorities.length > 0 && (
            <ForwardButton
              target={currentLang === "en" ? "Analysis Page" : currentLang === "zh" ? "分析页" : ""}
              to={`/analysis?lang=${currentLang}`}
            />
          )}
          <LogoutButton language={currentLang} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full max-w-7xl px-4 mt-24 overflow-y-auto">
        <PrioritiesContent key={term} term={term} language={currentLang} />
      </div>
    </div>
  );
};

export default PrioritiesPage;
