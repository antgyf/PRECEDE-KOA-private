import React, { useEffect, useState } from "react";
import { useAlert } from "../../hooks/AlertContext";
import { Questions } from "../../models/patient/patientDetails";
import { AxiosError } from "axios";
import api from "../../api/api";
import { useForm } from "../../hooks/FormContext";
import { useNavigate } from "react-router-dom";
import DesktopForm from "./DesktopForm";
import MobileForm from "./MobileForm";

interface FormContentProps {
  term?: number; // optional, fallback to context
  language: string;
}

const FormContent: React.FC<FormContentProps> = ({ term, language }) => {
  const { showAlert } = useAlert();
  const { patient, term: contextTerm, setCurrentForm, setCurrentPatient } = useForm();
  const termToUse = term ?? contextTerm;
  const navigate = useNavigate();

  const [answers, setAnswers] = useState<Record<string, string>>(
    () => Questions.reduce((acc, q) => ({ ...acc, [q.code]: "" }), {})
  );
  const [originalAnswers, setOriginalAnswers] = useState<Record<string, string>>(
    () => Questions.reduce((acc, q) => ({ ...acc, [q.code]: "" }), {})
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // --- Check if form has any changes
  //const isUnchanged = JSON.stringify(answers) === JSON.stringify(originalAnswers);

  // --- Fetch existing form data
  useEffect(() => {
    if (!patient?.hasform || termToUse === undefined) return;

    const fetchPatientForm = async () => {
      setIsLoading(true);
      showAlert(language === "en" ? "Loading..." : "加载中...", "info");

      try {
        const response = await api.get("/patients/form", {
          params: { patientid: patient.patientid, term: termToUse },
        });

        if (response.data.length === 0) {
          // No form exists
          const emptyAnswers = Questions.reduce(
            (acc, q) => ({ ...acc, [q.code]: "" }),
            {}
          );
          setAnswers(emptyAnswers);
          setOriginalAnswers(emptyAnswers);
          setIsDisabled(false);
          showAlert(
            language === "en"
              ? "No form exists for this term. You can create one."
              : "此期间不存在表单。您可以创建一个。",
            "info"
          );
          return;
        }

        // Map backend data into answers
        const questionIdToCode = Questions.reduce((acc, q) => {
          acc[q.id] = q.code;
          return acc;
        }, {} as Record<number, string>);

        const populatedAnswers = response.data.reduce(
          (acc: Record<string, string>, item: { questionid: number; answervalue: number }) => {
            const code = questionIdToCode[item.questionid];
            if (code) acc[code] = item.answervalue?.toString() || "0";
            return acc;
          },
          {} as Record<string, string>
        );

        setAnswers(populatedAnswers);
        setOriginalAnswers(populatedAnswers);
        setIsDisabled(true);
        setIsEditing(false);

        // Update context
        setCurrentForm(
          {
            patientid: patient.patientid,
            term: termToUse,
            responses: response.data.map((item: any) => ({
              questionid: item.questionid,
              code: questionIdToCode[item.questionid],
              answervalue: item.answervalue,
            })),
            priorities: [],
          },
          termToUse
        );
      } catch (error) {
        console.error("Error fetching form data:", error);
        showAlert(
          language === "en" ? "Error loading form data." : "加载表单数据时出错。",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientForm();
  }, [patient?.patientid, termToUse]);

  // --- Handle radio input changes
  const handleRadioInput = (code: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [code]: value }));
  };

  // --- Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient?.patientid || termToUse === undefined) return;

    const unanswered = Questions.filter((q) => !answers[q.code] || answers[q.code] === "");
    if (unanswered.length > 0) {
      showAlert(
        language === "en"
          ? "Please answer all questions before submitting."
          : "请在提交之前回答所有问题。",
        "error"
      );
      return;
    }

    const responses = Questions.map((q) => ({
      questionid: q.id,
      code: q.code,
      answervalue: parseInt(answers[q.code]),
    }));

    const formData = { patientid: patient.patientid, term: termToUse, responses };

    try {
      showAlert(language === "en" ? "Submitting form..." : "提交中...", "info");

      const method = isEditing ? api.put : api.post;
      const endpoint = "/patients/forms";

      const response = await method(endpoint, formData, {
        headers: { "Content-Type": "application/json" },
      });

      // Update context
      setCurrentForm(formData, termToUse);
      setCurrentPatient({ ...patient, hasform: true });

      // Update original answers snapshot
      setOriginalAnswers(answers);
      setIsDisabled(true);
      setIsEditing(false);

      showAlert(
        response.data.message ||
          (isEditing
            ? language === "en"
              ? "Form updated successfully!"
              : "表单更新成功！"
            : language === "en"
            ? "Form submitted successfully!"
            : "表单提交成功！"),
        "success"
      );

      // Navigate only on first submit
      if (!isEditing) navigate(`/priorities?term=${termToUse}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error instanceof AxiosError) {
        showAlert(error.response?.data.message || "An error occurred while submitting the form.", "error");
      } else {
        showAlert("An unexpected error occurred. Please try again later.", "error");
      }
    }
  };

  // --- Detect mobile / desktop
  const isSmallScreen = window.innerWidth < 1024;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading form data...</p>
      </div>
    );
  }

  // --- Shared props
  const sharedProps = {
    Questions,
    answers,
    handleRadioInput,
    handleSubmit,
    isDisabled,
    isEditing,
    setIsEditing,
    setIsDisabled,
    setAnswers,
    originalAnswers,
    language,
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto px-6 py-4">
      {isSmallScreen ? <MobileForm {...sharedProps} /> : <DesktopForm {...sharedProps} />}
    </div>
  );
};

export default FormContent;