import { useAlert } from "../../hooks/AlertContext";
import ReportPage from "../ReportPage/PDFReport/ReportPage";
import Alert from "../UI/Alert";
import BackButton from "../UI/Button/BackButton";
import LogoutButton from "../UI/Button/LogoutButton";
import AfterSurgery from "./AfterSurgery/AfterSurgery";
import BeforeSurgery from "./BeforeSurgery/BeforeSurgery";
import { useState } from "react";

const AnalysisPage: React.FC = () => {
  const { alert } = useAlert();
  const [activeTab, setActiveTab] = useState<"summary" | "before" | "after">(
    "summary"
  );

  return (
    <div className="w-screen h-full flex flex-col">
      {alert.message && <Alert />}
      {/* Fixed Tab Navigation */}
      <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-md p-5">
        <div className="flex justify-between">
          <BackButton target="Priority Page" to="/priorities" />
          <LogoutButton />
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
            Summary Report
          </button>
          <button
            onClick={() => setActiveTab("before")}
            className={`px-6 py-3 font-bold text-lg rounded-sm transition-all ${
              activeTab === "before"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Before Surgery
          </button>
          <button
            onClick={() => setActiveTab("after")}
            className={`px-6 py-3 font-bold text-lg rounded-sm transition-all ${
              activeTab === "after"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            More Analysis
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 mt-40 bg-neutral p-6">
        <div style={{ display: activeTab === "summary" ? "block" : "none" }}>
          <ReportPage activeTab={activeTab} />
        </div>
        <div style={{ display: activeTab === "before" ? "block" : "none" }}>
          <BeforeSurgery activeTab={activeTab} />
        </div>
        <div style={{ display: activeTab === "after" ? "block" : "none" }}>
          <AfterSurgery activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
