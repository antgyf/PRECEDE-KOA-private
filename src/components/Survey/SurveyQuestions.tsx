import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../UI/Button/BackButton";
import ForwardButton from "../UI/Button/ForwardButton";
import LanguageDropdown from "../UI/Button/LanguageDropdown";
import SurveyFormContent from "./SurveyFormContent";
import { Patient, FormData, PrioritiesData } from "./SurveyInputPage";
import Alert from "../UI/Alert";
import { useAlert } from "../../hooks/AlertContext";

const SurveyFormPage: React.FC = () => {
  // Read URL params
  const { alert } = useAlert();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const langParam = params.get("lang") || "en";
  const patientParam = params.get("patient") ? JSON.parse(params.get("patient")!) : {};
  const formParam = params.get("form") ? JSON.parse(params.get("form")!) : {};
  const prioritiesParam = params.get("priorities") ? JSON.parse(params.get("priorities")!) : {};

  // Local state
  const [currentLang, setCurrentLang] = useState<string>(langParam);
  const [localPatient] = useState<Patient>(patientParam);
  const [localForm, setLocalForm] = useState<FormData>(formParam);
  const [localPriorities] = useState<PrioritiesData>(prioritiesParam);

  const isFormComplete =
  Object.values(localForm).filter(v => v !== "").length === 15;

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-neutral">
      {/* Top Bar */}
      {currentLang === "en" && (
      <div className="fixed top-0 left-0 w-full bg-white z-40 shadow-md p-4 flex justify-between items-center h-20">
        {alert.message && <Alert />}
        {/* Back Button */}
        <BackButton
          target="Back"
          to={`/survey?lang=${currentLang}&patient=${encodeURIComponent(
            JSON.stringify(localPatient)
          )}&form=${encodeURIComponent(JSON.stringify(localForm))}
          &priorities=${encodeURIComponent(JSON.stringify(localPriorities))}`}
        />

        {/* Language Selector */}
        <div className="flex-1 flex justify-center">
          <LanguageDropdown currentLang={currentLang} onChange={setCurrentLang} />
        </div>

        {/* Forward Button */}
        <ForwardButton
          target="Next Page"
          to={
                `/surveypriorities?lang=${currentLang}&patient=${encodeURIComponent(
                  JSON.stringify(localPatient)
                )}&form=${encodeURIComponent(JSON.stringify(localForm))}
                &priorities=${encodeURIComponent(JSON.stringify(localPriorities))}`
          }
          isDisabled={!isFormComplete}
        />
      </div>
      )}

      {currentLang === "zh" && (
      <div className="fixed top-0 left-0 w-full bg-white z-40 shadow-md p-4 flex justify-between items-center h-20">
      {alert.message && <Alert />}

        {/* Back Button */}
        <BackButton
          target="返回"
          to={`/survey?lang=${currentLang}&patient=${encodeURIComponent(
            JSON.stringify(localPatient)
          )}&form=${encodeURIComponent(JSON.stringify(localForm))}
          &priorities=${encodeURIComponent(JSON.stringify(localPriorities))}`}
        />

        {/* Language Selector */}
        <div className="flex-1 flex justify-center">
          <LanguageDropdown currentLang={currentLang} onChange={setCurrentLang} />
        </div>

        {/* Forward Button */}
        <ForwardButton
          target="下一页"
          to={
                `/surveypriorities?lang=${currentLang}&patient=${encodeURIComponent(
                  JSON.stringify(localPatient)
                )}&form=${encodeURIComponent(JSON.stringify(localForm))}
                &priorities=${encodeURIComponent(JSON.stringify(localPriorities))}`
          }
          isDisabled={!isFormComplete}
        />
      </div>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full max-w-4xl px-4 mt-24 pb-10 overflow-y-auto">
        <SurveyFormContent
          language={currentLang}
          patient={localPatient}
          form={localForm}
          onFormChange={(updatedForm) => setLocalForm(updatedForm)}
        />
      </div>
    </div>
    
  );
};

export default SurveyFormPage;
