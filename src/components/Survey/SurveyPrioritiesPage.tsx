import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../UI/Button/BackButton";
import ForwardButton from "../UI/Button/ForwardButton";
import { useAlert } from "../../hooks/AlertContext";
import Alert from "../UI/Alert";
import LanguageDropdown from "../UI/Button/LanguageDropdown";
import { Patient, FormData , PrioritiesData} from "./SurveyInputPage";
import SurveyPrioritiesContent from "./SurveyPrioritiesContent";


const SurveyPrioritiesPage: React.FC = () => {
  const { alert } = useAlert();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
  
    const langParam = params.get("lang") || "en";
    const patientParam = params.get("patient") ? JSON.parse(params.get("patient")!) : {};
    const formParam = params.get("form") ? JSON.parse(params.get("form")!) : {};
    const prioritiesParam = params.get("priorities") ? JSON.parse(params.get("priorities")!) : [];
  
    // Local state
    const [currentLang, setCurrentLang] = useState<string>(langParam);
    const [localPatient] = useState<Patient>(patientParam);
    const [localForm] = useState<FormData>(formParam);
    const [localPriorities, setLocalPriorities] = useState<PrioritiesData>(prioritiesParam);
    const minPriorities = Math.min(
      5,
      Object.values(localForm).filter(v => v !== "0" && v !== "").length
    );

    const isPrioritiesComplete =
      localPriorities.length === 0;

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-neutral">
      {/* Fixed top banner */}
      {currentLang === "en" && (
      <div className="fixed top-0 left-0 w-full bg-white z-40 shadow-md p-4 flex justify-between items-center h-20">
        {alert.message && <Alert />}

        <div className="flex items-center">
          <BackButton
            target="Back"
            to={`/surveyquestions?lang=${currentLang}&patient=${encodeURIComponent(
            JSON.stringify(localPatient)
          )}&form=${encodeURIComponent(JSON.stringify(localForm))}
          &priorities=${encodeURIComponent(JSON.stringify(localPriorities))}`} // keep lang across navigation
          />
        </div>

        <div className="flex-1 flex justify-center">
          <LanguageDropdown currentLang={currentLang} onChange={setCurrentLang} />
        </div>

        <div className="flex flex-row gap-4 items-center">
          <ForwardButton
          target="Analysis Page"
          to={
                `/surveyanalysis?lang=${currentLang}&patient=${encodeURIComponent(
                  JSON.stringify(localPatient)
                )}&form=${encodeURIComponent(JSON.stringify(localForm))}
                &priorities=${encodeURIComponent(JSON.stringify(localPriorities))}`
          }
          isDisabled={isPrioritiesComplete}
        />
        </div>
      </div>
      )}

      {currentLang === "zh" && (
      <div className="fixed top-0 left-0 w-full bg-white z-40 shadow-md p-4 flex justify-between items-center h-20">
        {alert.message && <Alert />}

        <div className="flex items-center">
          <BackButton
            target="返回"
            to={`/surveyquestions?lang=${currentLang}&patient=${encodeURIComponent(
            JSON.stringify(localPatient)
          )}&form=${encodeURIComponent(JSON.stringify(localForm))}
          &priorities=${encodeURIComponent(JSON.stringify(localPriorities))}`} // keep lang across navigation
          />
        </div>

        <div className="flex-1 flex justify-center">
          <LanguageDropdown currentLang={currentLang} onChange={setCurrentLang} />
        </div>

        <div className="flex flex-row gap-4 items-center">
          <ForwardButton
          target="下一页"
          to={
                `/surveyanalysis?lang=${currentLang}&patient=${encodeURIComponent(
                  JSON.stringify(localPatient)
                )}&form=${encodeURIComponent(JSON.stringify(localForm))}
                &priorities=${encodeURIComponent(JSON.stringify(localPriorities))}`
          }
          isDisabled={isPrioritiesComplete}
        />
        </div>
      </div>
      )}

      {/* Main content */}
      <div className="flex-1 w-full max-w-7xl px-4 mt-24 overflow-y-auto">
        <SurveyPrioritiesContent 
        language={currentLang} 
        patient={localPatient} 
        form={localForm} 
        priorities={localPriorities} 
        minPriorities={minPriorities} 
        onPrioritiesChange={(updatedPriorities) => setLocalPriorities(updatedPriorities)} />
      </div>
    </div>
  );
};

export default SurveyPrioritiesPage;
