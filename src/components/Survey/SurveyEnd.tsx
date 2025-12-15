import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../UI/Button/BackButton";
import LanguageDropdown from "../UI/Button/LanguageDropdown";
import { Patient, FormData, PrioritiesData } from "./SurveyInputPage";
import { useAlert } from "../../hooks/AlertContext";
import Alert from "../UI/Alert";

const SurveyEndPage: React.FC = () => {
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
    const [localPriorities] = useState<PrioritiesData>(prioritiesParam);

    return (
        <div className="w-screen h-screen flex flex-col bg-neutral">
            {/* Fixed top banner */}
            <div className="fixed top-0 left-0 w-full bg-white z-40 shadow-md p-4 flex justify-between items-center h-20">
                {alert.message && <Alert />}
                <div className="flex flex-row gap-4 items-center">
                    <BackButton
                        target={currentLang === "zh" ? "返回" : "Back"}
                        to={`/surveyanalysis?lang=${currentLang}&patient=${encodeURIComponent(
                            JSON.stringify(localPatient)
                        )}&form=${encodeURIComponent(JSON.stringify(localForm))}&priorities=${encodeURIComponent(JSON.stringify(localPriorities))}`}
                    />
                </div>
                <div className="flex-1 flex justify-center">
                    <LanguageDropdown currentLang={currentLang} onChange={setCurrentLang} />
                </div>

            </div>

            {/* Survey End Section */}
            <div className="flex-1 pt-24 px-6 flex flex-col items-center justify-start text-center">
                <h1 className="text-3xl font-bold mb-4">
                    {currentLang === "zh" ? "感谢您的参与" : "Thank You for Completing the Survey"}
                </h1>
                <p className="text-xl max-w-3xl mb-6">
                    {currentLang === "zh"
                        ? "您的回答已成功提交。我们非常感谢您花时间完成此调查。"
                        : "Your responses have been successfully submitted. We sincerely appreciate you taking the time to complete this survey."}
                </p>
                <p className="text-lg max-w-2xl mb-6">
                    {currentLang === "zh"
                        ? "您可以点击返回按钮查看或修改先前的回答。"
                        : "You can click the Back button to review or edit your previous answers."}
                </p>
            </div>
        </div>
    );
};

export default SurveyEndPage;
