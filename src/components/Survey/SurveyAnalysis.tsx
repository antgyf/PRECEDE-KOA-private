import { useAlert } from "../../hooks/AlertContext";
import Alert from "../UI/Alert";
import BackButton from "../UI/Button/BackButton";
import LanguageDropdown from "../UI/Button/LanguageDropdown";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Patient, PrioritiesData, FormData } from "./SurveyInputPage";
import SurveyReportPage from "./SurveyReportPage";
import ForwardButton from "../UI/Button/ForwardButton";

const SurveyAnalysisPage: React.FC = () => {
  const { alert } = useAlert();
  
  // Read ?lang= from URL
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
    const [localPriorities] = useState<PrioritiesData>(prioritiesParam);

  // Initialize language from URL (default: "en")
  const [activeTab] = useState<"summary">(
    "summary"
  );


  return (
    <div className="w-screen h-full flex flex-col">
      {alert.message && <Alert />}

      {/* Fixed Tab Navigation */}
      <div className="top-0 left-0 w-full bg-white z-50 shadow-md p-5">
        <div className="flex justify-between">
          {/* Back Button */}
          <div className="flex items-center">
            <BackButton
              target={
                currentLang === "en"
                  ? "Back"
                  : currentLang === "zh"
                  ? "返回"
                  : ""
              }
              to={`/surveypriorities?lang=${currentLang}&patient=${encodeURIComponent(
                JSON.stringify(localPatient)
            )}&form=${encodeURIComponent(JSON.stringify(localForm))}
            &priorities=${encodeURIComponent(JSON.stringify(localPriorities))}`} // preserve language
            />
          </div>

          {/* Language Dropdown */}
          <div className="flex-1 flex justify-center">
            <LanguageDropdown
              currentLang={currentLang}
              onChange={setCurrentLang}
            />
          </div>

          <div className="flex flex-row gap-4 items-center">
          <ForwardButton
          target={currentLang === "en" ? "Finish Survey" : currentLang === "zh" ? "完成调查" : "Finish Survey"}
          to={
                `/surveyend?lang=${currentLang}&patient=${encodeURIComponent(
                  JSON.stringify(localPatient)
                )}&form=${encodeURIComponent(JSON.stringify(localForm))}
                &priorities=${encodeURIComponent(JSON.stringify(localPriorities))}`
          }
          isDisabled={false}
        />
        </div>
      </div>
        <div className="w-full py-4 text-center text-2xl font-bold">
            {currentLang === "en"
                ? "Summary Report"
                : currentLang === "zh"
                ? "总结报告"
                : ""}
            </div>

      {/* Tab Content */}
      <div className="flex-1 mt-20 bg-neutral p-6">
        <div style={{ display: activeTab === "summary" ? "block" : "none" }}>
            <SurveyReportPage activeTab={activeTab}  currentLang={currentLang} patient={localPatient} form={localForm} priorities={localPriorities} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default SurveyAnalysisPage;
