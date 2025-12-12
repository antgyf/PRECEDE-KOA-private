import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../hooks/AlertContext";
import RadioChoice from "../UI/Form/RadioChoice";
import { Questions } from "../../models/patient/patientDetails";
import { AxiosError } from "axios";
import api from "../../api/api";
import { useForm } from "../../hooks/FormContext";
import GreenButton from "../UI/Button/GreenButton";
import PatientDetail from "./PatientDetail";
import { PatientForm } from "../../models/patient/patientReport";

interface FormContentProps {
  term?: number; // optional, fallback to context
  language: string; // current language
}

const FormContent: React.FC<FormContentProps> = ({ term, language }) => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { setCurrentPatient } = useForm();
  const { patient, form, term: contextTerm, setCurrentForm } = useForm();
  const termToUse = term ?? contextTerm;

  const [answers, setAnswers] = useState<Record<string, string>>(
    () => Questions.reduce((acc, q) => ({ ...acc, [q.code]: "" }), {})
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  /** Fetch form for selected term */
  useEffect(() => {
  if (!patient?.hasform || termToUse === undefined) return;

  const fetchPatientForm = async () => {
    setIsLoading(true);
    
    if (language === "en") showAlert("Loading...", "info");
    else if (language === "zh") showAlert("加载中...", "info");

    try {
      const response = await api.get("/patients/form", {
        params: { patientid: patient.patientid, term: termToUse },
      });

      if (response.data.length === 0) {
        setAnswers(Questions.reduce((acc : Record<string, string>, q) => ({ ...acc, [q.code]: "" }), {}));
        setIsDisabled(false);
        if (language === "en") showAlert("No form exists for this term. You can create one.", "info");
        else if (language === "zh") showAlert("此期间不存在表单。您可以创建一个。", "info");
        return;
      }

      const formData: PatientForm = {
        patientid: patient.patientid,
        term: termToUse,
        responses: response.data.map((item: any) => ({
          questionid: item.questionid,
          code: Questions.find(q => q.id === item.questionid)?.code || "", // Map to code
          answervalue: item.answervalue
        })),
        priorities: [] // or whatever priorities logic you have
      };

      setCurrentForm(formData, termToUse);

      // Only update context if the current form in context is undefined or different
      if (!form || form.term !== termToUse) {
        setCurrentForm(formData, termToUse);
      }

      // Map questionid -> code
      const questionIdToCode = Questions.reduce((acc, q) => {
        acc[q.id] = q.code;
        return acc;
      }, {} as Record<number, string>);

      // Transform backend data into answers keyed by question code
      const populatedAnswers = response.data.reduce((acc : Record<string, string>, item: { questionid: number; answervalue: number }) => {
        const code = questionIdToCode[item.questionid];
        if (code) {
          acc[code] = item.answervalue?.toString() || "0";
        }
        return acc;
      }, {} as Record<string, string>);

      setAnswers(populatedAnswers);
      setIsDisabled(true);
    } catch (error) {
      console.error("Error fetching form data:", error);
      if (language === "en") showAlert("Error loading form data.", "error");
      else if (language === "zh") showAlert("加载表单数据时出错。", "error");
    } finally {
      setIsLoading(false);
    }
  };

  fetchPatientForm();
}, [patient?.patientid, termToUse]);

  /** Handle radio input */
  const handleRadioInput = (code: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [code]: value,
    }));
  };

  /** Handle submit */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!patient?.patientid || termToUse === undefined) return;

    const unansweredQuestions = Questions.filter(
      (q) => !answers[q.code] || answers[q.code] === ""
    );

    if (unansweredQuestions.length > 0) {
      if (language === "en") showAlert("Please answer all questions before submitting.", "error");
      else if (language === "zh") showAlert("请在提交之前回答所有问题。", "error");
      return;
    }

    const responses = Questions.map((q) => ({
      questionid: q.id,
      code: q.code, // add this
      answervalue: parseInt(answers[q.code]),
    }));

    const formData = {
      patientid: patient.patientid,
      term: termToUse,
      responses,
    };

    try {
      showAlert("Submitting form...", "info");
      const response = await api.post(`/patients/forms`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      // ✅ store in context along with term
      setCurrentForm(formData, termToUse);
      setCurrentPatient({ ...patient, hasform: true }); // update hasform status

      if (language === "en") showAlert(
        response.data.message || "Form submitted successfully!",
        "success"
      );
      else if (language === "zh") showAlert(
        response.data.message || "表单提交成功！",
        "success"
      );
      navigate(`/priorities?term=${termToUse}`); // term already in context
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error instanceof AxiosError) {
        showAlert(
          error.response?.data.message ||
            "An error occurred while submitting the form.",
          "error"
        );
      } else {
        showAlert(
          "An unexpected error occurred. Please try again later.",
          "error"
        );
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto px-6 py-4"> {/* Remove text-xl from here */}
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <p>Loading form data...</p>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <PatientDetail currentLang={language}/>
          <article className="font-bold m-0 text-xl"> {/* Add text-xl only to elements that need it */}
            <h4 className="my-0"> {language === "en" ? "Please answer all questions below." : language === "zh" ? "请回答以下所有问题。" : ""}</h4>
          </article>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-base">
            {Questions.map((q, index) => (
              <div key={q.id} className="w-full min-w-0 break-words">
                <RadioChoice
                  name={q.code}
                  question={`${index + 1}. ${language === "en" ? q.question : q.chQuestion}`}
                  list={language === "en" ? q.list : q.chList}
                  onChange={(value) => handleRadioInput(q.code, value)}
                  value={answers[q.code]}
                  disabled={isDisabled}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            {!isDisabled && <GreenButton buttonText= {language === "en" ? "Submit" : language === "zh" ? "提交" : ""} />}
          </div>
        </form>
      )}
    </div>
  )
};

export default FormContent;
