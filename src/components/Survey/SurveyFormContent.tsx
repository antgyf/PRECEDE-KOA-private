import React, { useState } from "react";
import RadioChoice from "../UI/Form/RadioChoice";
import { Questions } from "../../models/patient/patientDetails";
import { FormData } from "./SurveyInputPage";
import { useAlert } from "../../hooks/AlertContext";

interface SurveyFormContentProps {
  language: string;
  patient: any;
  form: FormData;
  onFormChange: (updatedForm: any) => void;
}

const SurveyFormContent: React.FC<SurveyFormContentProps> = ({
  language,
  form,
  patient,
  onFormChange,
}) => {
  // Initialize answers for all questions
  const { showAlert } = useAlert();
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
  if (form && Object.keys(form).length > 0) {
    return { ...form }; // clone existing answers
  }

  // otherwise initialize empty answers
  return Questions.reduce((acc, q) => {
    acc[q.code] = "";
    return acc;
  }, {} as Record<string, string>);
});


  const setLocalForm = (answers: Record<string, string>) => {
  const updatedForm = {
    ...form,      // keep existing form data
    ...answers,   // add/update answers by q.code
  };

  onFormChange(updatedForm);
};

  // Handle radio selection
  const handleRadioInput = (code: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [code]: value }));
  };

  // Handle next button click
  const handleNext = () => {
    const missing = Questions.filter((q) => !answers[q.code]);
    if (missing.length > 0) {
      showAlert(language === "zh" ? "请回答所有问题" : "Please answer all questions", "error");
      return;
    }

    setLocalForm(answers); // 🔥 THIS is what you want
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto px-6 py-4">
      {/* Patient details table */}
      {patient && language === "en" && (
        <table className="table-auto w-full border border-gray-300 mb-6">
          <thead className="text-base bg-secondary">
            <tr className="leading-tight">
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Age</th>
              <th className="border px-3 py-2">Sex</th>
              <th className="border px-3 py-2">Ethnicity</th>
              <th className="border px-3 py-2">BMI</th>
            </tr>
          </thead>
          <tbody className="text-base bg-white text-center">
            <tr>
              <td className="border px-3 py-2">{patient.fullName || "-"}</td>
              <td className="border px-3 py-2">{patient.age || "-"}</td>
              <td className="border px-3 py-2">{patient.sex || "-"}</td>
              <td className="border px-3 py-2">
                {(() => {
                  const ethMapEn = ["Chinese", "Malay", "Indian", "Caucasian", "Others"];
                  const idx = parseInt(patient.ethnicity);
                  if (isNaN(idx)) return "-";
                  return ethMapEn[idx];
                })()}
              </td>
              <td className="border px-3 py-2">{patient.bmi || "-"}</td>
            </tr>
          </tbody>
        </table>
      )}

    {patient && language === "zh" && (
        <table className="table-auto w-full border border-gray-300 mb-6">
            <thead className="text-base bg-secondary">
            <tr className="leading-tight">
                <th className="border px-3 py-2">姓名</th>
                <th className="border px-3 py-2">年龄</th>
                <th className="border px-3 py-2">性别</th>
                <th className="border px-3 py-2">种族</th>
                <th className="border px-3 py-2">体重指数</th>
            </tr>
            </thead>
            <tbody className="text-base bg-white text-center">
            <tr>
                <td className="border px-3 py-2">{patient.fullName || "-"}</td>
                <td className="border px-3 py-2">{patient.age || "-"}</td>
                <td className="border px-3 py-2">
                {patient.sex || "-"}
                </td>
                <td className="border px-3 py-2">
                {(() => {
                    const ethMapZh = ["华人", "马来人", "印度人", "白种人", "其他"];
                    const idx = parseInt(patient.ethnicity);
                    if (isNaN(idx)) return "-";
                    return ethMapZh[idx];
                })()}
                </td>
                <td className="border px-3 py-2">{patient.bmi || "-"}</td>
            </tr>
            </tbody>
        </table>
      )}
    
      {/* Instructions */}
      <article className="font-bold m-0 text-xl mb-4">
        <h4>
          {language === "en"
            ? "Please answer all questions below. Do save your answers before proceeding to the next page."
            : "请回答以下所有问题。在进入下一页之前请保存您的答案。"}
        </h4>
      </article>

      {/* Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-base">
        {Questions.map((q, index) => (
          <div key={q.id}>
            <RadioChoice
              name={q.code}
              question={`${index + 1}. ${
                language === "en" ? q.question : q.chQuestion
              }`}
              list={language === "en" ? q.list : q.chList}
              onChange={(value) => handleRadioInput(q.code, value)}
              value={answers[q.code]}
            />
          </div>
        ))}
      </div>

      {/* Next button */}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleNext}
        >
          {language === "zh" ? "保存答案" : "Save Answers"}
        </button>
      </div>
    </div>
  );
};

export default SurveyFormContent;
