import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAnalysisExpiry, type Assessment } from "../../api/analysisAccess";
import { useForm } from "../../hooks/FormContext";
import AnalysisPage from "./AnalysisPage";

function AnalysisAccessCheck({ patientid, term, language }: Assessment & { language: string }) {
  const [expiresAt, setExpiresAt] = useState<number | null>();

  useEffect(() => {
    const controller = new AbortController();
    let timer: number | undefined;

    getAnalysisExpiry({ patientid, term }, controller.signal).then((expiry) => {
      if (controller.signal.aborted) return;
      setExpiresAt(expiry);
      if (expiry !== null) {
        timer = window.setTimeout(() => setExpiresAt(null), Math.max(0, expiry - Date.now()));
      }
    }).catch(() => {
      if (!controller.signal.aborted) setExpiresAt(null);
    });

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [patientid, term]);

  if (expiresAt === undefined) {
    return <p role="status" className="p-6">{language === "zh" ? "正在验证分析访问权限…" : "Checking analysis access…"}</p>;
  }
  if (expiresAt === null || expiresAt <= Date.now()) {
    return <Navigate to={`/priorities?${new URLSearchParams({ lang: language, term: String(term) })}`} replace />;
  }
  return <AnalysisPage />;
}

export default function ProtectedAnalysisPage() {
  const { patient, form } = useForm();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const language = query.get("lang") ?? "en";
  const requestedTerm = query.get("term");

  if (!patient) return <Navigate to="/home" replace />;
  if (!form || form.patientid !== patient.patientid) return <Navigate to="/form" replace />;
  if (requestedTerm !== null && requestedTerm !== String(form.term)) {
    return <Navigate to={`/priorities?${new URLSearchParams({ lang: language, term: String(form.term) })}`} replace />;
  }

  return <AnalysisAccessCheck key={`${patient.patientid}:${form.term}`} patientid={patient.patientid} term={form.term} language={language} />;
}
