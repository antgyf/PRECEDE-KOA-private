import { useAlert } from "../../hooks/AlertContext";
import ReportPage from "../ReportPage/PDFReport/ReportPage";
import Alert from "../UI/Alert";
import BackButton from "../UI/Button/BackButton";
import LanguageDropdown from "../UI/Button/LanguageDropdown";
import LogoutButton from "../UI/Button/LogoutButton";
import AfterSurgery from "./AfterSurgery/AfterSurgery";
import BeforeSurgery from "./BeforeSurgery/BeforeSurgery";
import { useState } from "react";

const AnalysisPage: React.FC = () => {
  const { alert } = useAlert();
  const [activeTab, setActiveTab] = useState<"summary" | "before" | "after">(
    "summary"
  );
  const [currentLang, setCurrentLang] = useState<string>("en");

  return (
    <div className="w-screen h-full flex flex-col">
      {alert.message && <Alert />}
      {/* Fixed Tab Navigation */}
      <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-md p-5">
        <div className="flex justify-between">
          <div className="flex items-center">
            <BackButton target={currentLang === "en" ? "Priority Page" : currentLang === "zh" ? "优先事项页" : ""} to="/priorities" />
          </div>

          <div className="flex-1 flex justify-center">
            <LanguageDropdown currentLang={currentLang} onChange={setCurrentLang} />
          </div>

          <div className="flex items-center">
            <LogoutButton language={currentLang} />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-6 py-3 font-bold text-lg rounded-sm transition-all ${
              activeTab === "summary"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {currentLang === "en" ? "Summary Report" : currentLang === "zh" ? "总结报告" : ""}
            
          </button>
          <button
            onClick={() => setActiveTab("before")}
            className={`px-6 py-3 font-bold text-lg rounded-sm transition-all ${
              activeTab === "before"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >

            {currentLang === "en" ? "Before Surgery" : currentLang === "zh" ? "手术前" : ""}
            
          </button>
          <button
            onClick={() => setActiveTab("after")}
            className={`px-6 py-3 font-bold text-lg rounded-sm transition-all ${
              activeTab === "after"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >

            {currentLang === "en" ? "More Analysis" : currentLang === "zh" ? "更多分析" : ""}

          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 mt-40 bg-neutral p-6">
        <div style={{ display: activeTab === "summary" ? "block" : "none" }}>
          <ReportPage activeTab={activeTab} currentLang={currentLang} />
        </div>
        <div style={{ display: activeTab === "before" ? "block" : "none" }}>
          <BeforeSurgery activeTab={activeTab} currentLang={currentLang} />
        </div>
        <div style={{ display: activeTab === "after" ? "block" : "none" }}>
          <AfterSurgery activeTab={activeTab} currentLang={currentLang} />
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
