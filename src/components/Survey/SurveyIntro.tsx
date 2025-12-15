import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ForwardButton from "../UI/Button/ForwardButton";
import LanguageDropdown from "../UI/Button/LanguageDropdown";
import { Patient, FormData, PrioritiesData } from "./SurveyInputPage";
import { useAlert } from "../../hooks/AlertContext";
import Alert from "../UI/Alert";

const SurveyIntroPage: React.FC = () => {
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
                <div className="flex-1 flex justify-center">
                    <LanguageDropdown currentLang={currentLang} onChange={setCurrentLang} />
                </div>
                <div className="flex flex-row gap-4 items-center">
                    <ForwardButton
                        target={currentLang === "zh" ? "下一页" : "Next Page"}
                        to={`/survey?lang=${currentLang}&patient=${encodeURIComponent(
                            JSON.stringify(localPatient)
                        )}&form=${encodeURIComponent(JSON.stringify(localForm))}&priorities=${encodeURIComponent(JSON.stringify(localPriorities))}`}
                        isDisabled={false}
                    />
                </div>
            </div>

            {/* Survey Introduction Section */}
            <div className="flex-1 pt-24 px-6 flex flex-col items-center justify-start text-center">
                <h1 className="text-3xl font-bold mb-4">
                    {currentLang === "zh" ? "欢迎参加调查" : "Welcome to the Survey"}
                </h1>
                <p className="text-xl max-w-3xl mb-6">
                    {currentLang === "zh"
                        ? "在接下来的页面中，您将看到关于您的健康状况的一些问题，请根据您的实际情况作答。"
                        : "In the following pages, you will see questions about your health. Please answer them honestly based on your own experience."}
                </p>
                <p className="text-lg max-w-2xl mb-6">
                    {currentLang === "zh"
                        ? "点击下方“下一页”按钮开始调查。"
                        : 'Click the "Next Page" button below to start the survey.'}
                </p>
            </div>
        </div>
    );
};

export default SurveyIntroPage;


