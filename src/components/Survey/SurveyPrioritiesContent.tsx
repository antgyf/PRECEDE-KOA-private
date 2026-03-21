import React, { useState } from "react";
import { Questions } from "../../models/patient/patientDetails";
import { FormData, PrioritiesData } from "./SurveyInputPage";
import GreenButton from "../UI/Button/GreenButton";
import { useAlert } from "../../hooks/AlertContext";

interface SurveyPrioritiesContentProps {
  language: string;
  patient: any;
  form: FormData;
  priorities: PrioritiesData;
  minPriorities: number;
  onPrioritiesChange: (updatedPriorities: PrioritiesData) => void;
}

const SurveyPrioritiesContent: React.FC<SurveyPrioritiesContentProps> = ({
  language,
  form,
  priorities,
  minPriorities,
  onPrioritiesChange,
}) => {
  const { showAlert } = useAlert();
  // Ensure priorities is always an array
  const safePriorities = Array.isArray(priorities) ? priorities : [];

  // Initialize answers state
  const [answers] = useState<Record<string, string>>(() => {
    if (form && Object.keys(form).length > 0) return { ...form };

    return Questions.reduce((acc, q) => {
      acc[q.code] = "";
      return acc;
    }, {} as Record<string, string>);
  });

  // Available questions are those with an existing answer in form
  const availableQuestions = Questions.filter(
    (q) => form[q.code] && form[q.code] !== "0"
  );


  // Toggle priority selection
  const handleTogglePriority = (code: string) => {
    if (safePriorities.includes(code)) {
      onPrioritiesChange(safePriorities.filter((p) => p !== code));
    } else {
      if (safePriorities.length >= minPriorities) return;
      onPrioritiesChange([...safePriorities, code]);
    }
  };

  // Save priorities
  const handleSave = () => {
    if (safePriorities.length === 0) {
      showAlert(
        language === "zh"
          ? "请选择至少一个优先事项"
          : "Please select at least one priority", "error"
      );
      return;
    }

    // Pass current priorities to parent
    onPrioritiesChange(safePriorities);
  };

  return (
    <form className="flex flex-col gap-4 text-xl" onSubmit={(e) => e.preventDefault()}>
      <h3>
        {language === "en"
          ? "Below are the health problems you reported. Please select up to 5 problems you wish to improve most."
          : language === "zh"
          ? "以下是您报告的健康问题。请选择最多5个您最希望改善的问题。"
          : ""}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableQuestions.map((q) => {
          const isSelected = safePriorities.includes(q.code);

          return (
            <div
              key={q.code}
              onClick={() => handleTogglePriority(q.code)}
              className={`p-4 border rounded-xl cursor-pointer transition-all ${
                isSelected ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-5 w-5 border-2 rounded ${
                    isSelected ? "bg-green-600 border-green-600" : "border-gray-400"
                  }`}
                />
                <span>
                  {q.id <= 3 ? `${q.id}.` : `${q.id - 5}.`} {language === "en" ? q.question : q.chQuestion}
                </span>
              </div>

              <div className="ml-8 p-2 rounded text-gray-700">
                {language === "en" ? "Previously selected option: " : "先前选择的选项："}
                <strong>
                  {(() => {
                    const prevAnswer = answers[q.code];
                    if (!prevAnswer) return "-";
                    return language === "en"
                      ? q.list?.[Number(prevAnswer)] ?? "-"
                      : q.chList?.[Number(prevAnswer)] ?? "-";
                  })()}
                </strong>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-6">
        <GreenButton
          buttonText={language === "zh" ? "保存答案" : "Save Priorities"}
          onButtonClick={handleSave}
        />
      </div>
    </form>
  );
};

export default SurveyPrioritiesContent;
