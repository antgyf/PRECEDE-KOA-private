import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAnalysisExpiry } from "../../api/analysisAccess";
import AnalysisPasswordDialog from "../AnalysisPage/AnalysisPasswordDialog";
import BackButton from "../UI/Button/BackButton";
import ForwardButton from "../UI/Button/ForwardButton";
import LogoutButton from "../UI/Button/LogoutButton";
import { useAlert } from "../../hooks/AlertContext";
import Alert from "../UI/Alert";
import PrioritiesContent from "./PriorityContent";
import { useForm } from "../../hooks/FormContext";
import LanguageToggle from "../UI/Button/LanguageToggle";

const PrioritiesPage: React.FC = () => {
  const { alert } = useAlert();
  const { form, patient } = useForm();
  const navigate = useNavigate();

  // Read search params
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  // Extract values
  const termParam = query.get("term");
  const term = termParam === null ? form?.term ?? 0 : Number(termParam);
  const urlLang = query.get("lang");

  // Initialize language based on URL fallback to "en"
  const [currentLang, setCurrentLang] = useState<string>(urlLang ?? "en");
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const check = useRef<AbortController | null>(null);
  const patientid = patient?.patientid;
  const canContinue = patientid === form?.patientid && form?.term === term && form.priorities !== undefined;
  const assessmentQuery = new URLSearchParams({ term: String(term), lang: currentLang });

  useEffect(() => {
    const controller = new AbortController();
    check.current = controller;
    setCheckingAccess(false);
    setShowPassword(false);
    return () => controller.abort();
  }, [patientid, term]);

  const openAnalysis = () => navigate(`/analysis?${assessmentQuery}`);

  const continueToAnalysis = async () => {
    const signal = check.current?.signal;
    if (!patientid || !signal || signal.aborted || checkingAccess || showPassword) return;

    setCheckingAccess(true);
    try {
      const expiry = await getAnalysisExpiry({ patientid, term }, signal);
      if (signal.aborted) return;
      if (expiry !== null) openAnalysis();
      else setShowPassword(true);
    } catch {
      if (!signal.aborted) setShowPassword(true);
    } finally {
      if (!signal.aborted) setCheckingAccess(false);
    }
  };

  if (!Number.isSafeInteger(term) || term < 0) {
    return <div>Error: No term specified</div>;
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-neutral">
      {/* Top banner */}
      <div className="w-full shrink-0 bg-white z-40 shadow-md px-4 py-3 md:h-20 md:py-4">
        {alert.message && <Alert />}

        {/* Desktop top bar - unchanged */}
        <div className="hidden md:flex justify-between items-center h-full">
          <div className="flex items-center">
            <BackButton
              target={
                currentLang === "en"
                  ? "Form Page"
                  : currentLang === "zh"
                  ? "表格页"
                  : ""
              }
              to={`/form?${assessmentQuery}`}
            />
          </div>

          <div className="flex-1 flex justify-center">
            <LanguageToggle
              currentLang={currentLang}
              onChange={setCurrentLang}
            />
          </div>

          <div className="flex flex-row gap-4 items-center">
            {canContinue && (
              <ForwardButton
                target={
                  currentLang === "en"
                    ? "Analysis Page"
                    : currentLang === "zh"
                    ? "分析页"
                    : ""
                }
                onClick={continueToAnalysis}
                isDisabled={checkingAccess}
              />
            )}
            <LogoutButton language={currentLang} />
          </div>
        </div>

        {/* Mobile top bar */}
        <div className="flex md:hidden flex-col items-start gap-1">
          <div className="w-full">
            <BackButton
              target={
                currentLang === "en"
                  ? "Form Page"
                  : currentLang === "zh"
                  ? "表格页"
                  : ""
              }
              to={`/form?${assessmentQuery}`}
            />
          </div>

          {canContinue && (
            <div className="w-full">
              <ForwardButton
                target={
                  currentLang === "en"
                    ? "Analysis Page"
                    : currentLang === "zh"
                    ? "分析页"
                    : ""
                }
                onClick={continueToAnalysis}
                isDisabled={checkingAccess}
              />
            </div>
          )}

          <div className="w-full">
            <LanguageToggle
              currentLang={currentLang}
              onChange={setCurrentLang}
            />
          </div>

          <div className="w-full">
            <LogoutButton language={currentLang} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full max-w-7xl px-4 py-4 overflow-y-auto">
        <PrioritiesContent
          key={`${patientid}:${term}`}
          term={term}
          language={currentLang}
          onContinue={continueToAnalysis}
        />
      </div>
      {showPassword && patientid && (
        <AnalysisPasswordDialog
          key={`${patientid}:${term}`}
          assessment={{ patientid, term }}
          language={currentLang}
          onCancel={() => setShowPassword(false)}
          onUnlock={openAnalysis}
        />
      )}
    </div>
  );
};

export default PrioritiesPage;
