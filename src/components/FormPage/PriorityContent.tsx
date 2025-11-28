import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../hooks/AlertContext";
import { Questions, QuestionType } from "../../models/patient/patientDetails";
import api from "../../api/api";
import { useForm,  } from "../../hooks/FormContext";
import GreenButton from "../UI/Button/GreenButton";
import RadioChoice from "../UI/Form/RadioChoice";

interface PriorityContentProps {
  term: number;
  language: string;
  onSubmit?: () => void;
}

const PrioritiesContent: React.FC<PriorityContentProps> = ({ term, language, onSubmit }) => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { patient, form, setPriorities } = useForm();
  const [availableQuestions, setAvailableQuestions] = useState<{ question : QuestionType, answervalue: number }[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maxPriorities, setMaxPriorities] = useState(5);
  const [isDisabled, setIsDisabled] = useState(false);

  /** Fetch responses to determine available questions & previous priorities */
  useEffect(() => {
    if (!patient?.patientid || term === undefined) return;

    const fetchData = async () => {
      
      try {
      setIsLoading(true);
      showAlert(language === "en" ? "Loading priorities..." : language === "zh" ? "加载优先事项..." : "", "info");
        if (!patient?.patientid) throw new Error("No patient ID found");

        const response = await api.get("/patients/responses", {
          params: { patientid: patient.patientid, term },
        });

        const filteredResponses = response.data
          .filter((r: { code: string; answervalue: number }) => r.answervalue !== 0)

        const questionsWithAnswers = filteredResponses.map((r : { code: string; answervalue: number }) => {
                const question = Questions.find((q) => q.code === r.code);
                return question ? { question, answervalue: r.answervalue } : null;
        });
        
        setAvailableQuestions(questionsWithAnswers);
        const calculatedMinPriorities = Math.min(5, questionsWithAnswers.length);
        setMaxPriorities(calculatedMinPriorities);

        if (filteredResponses.length < 5) {
          showAlert(language === "en" ? `Only ${calculatedMinPriorities} problem areas available for prioritization.` : 
            language === "zh" ? `只有${calculatedMinPriorities}个问题方面可供优先排序。` : "", "info");
        }

        const existingPriorities = await api.get("/patients/priority", {
          params: { patientid: patient.patientid, term }
        });

        if (existingPriorities.data?.length > 0) {
          setSelectedPriorities(existingPriorities.data);
          setPriorities(existingPriorities.data);
          setIsDisabled(true);
          return;
        }

        // If priorities already exist for this term, load them and disable further changes
        if (form?.priorities && form.term === term) {
          setSelectedPriorities(form.priorities);
          setPriorities(form.priorities);
          setIsDisabled(true);
          return;
        }

        if (form && !form.priorities) {
          setSelectedPriorities([]);
          setIsDisabled(false);
        }

      } catch (err) {
        console.error("Error fetching responses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [patient?.patientid, term]);

  const handleTogglePriority = (questionId: number) => {
    if (isDisabled) return; // do nothing if priorities already exist

    setSelectedPriorities((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : prev.length < maxPriorities
        ? [...prev, questionId]
        : prev
    );
  };

  /** Submit via form onSubmit to get event object automatically */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!patient?.patientid || term === undefined) return;

    if (selectedPriorities.length > maxPriorities) {
      
      showAlert(language === "en" ? `Please select ${maxPriorities} or less priorities.` : 
        language === "zh" ? `请选择不超过${maxPriorities}个优先事项。` : "", "error");
      return;
    }

    const prioritiesData = {
      patientid: patient.patientid,
      term,
      priorities: selectedPriorities,
      maxPriorities: maxPriorities,
    };

    try {
      showAlert(language === "en" ? "Submitting priorities..." : 
        language === "zh" ? "提交优先事项..." : "", "info");
      const response = await api.post("/patients/priorities", prioritiesData, {
        headers: { "Content-Type": "application/json" },
      });

      setPriorities(selectedPriorities);
      showAlert(response.data.message || (language === "en" ? "Priorities submitted successfully!" : 
        language === "zh" ? "优先事项提交成功！" : ""), "success");

      onSubmit?.();
      navigate(`/analysis?term=${term}`);
    } catch (err) {
      console.error("Error submitting priorities:", err);
      showAlert("An error occurred while submitting priorities.", "error");
    }
  };
  
  if (isLoading) return <p>{language === "en" ? "Loading priorities..." : language === "zh" ? "加载优先事项..." : ""}</p>;

  return (
    <form className="flex flex-col gap-4 text-xl" onSubmit={handleSubmit}>
      <h3>
        {language === "en" ? "Below are the health problems you reported. Please select up to 5 problems you wish to improve most." : 
      language === "zh" ? "以下是您报告的健康问题。请选择最多5个您最希望改善的问题。" : ""}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableQuestions.map((q, index) => (
          <div
            key={q.question.id}
            className={`p-4 border rounded-xl shadow-sm bg-white flex flex-col gap-2 cursor-pointer transition-all ${
              selectedPriorities.includes(q.question.id)
                ? 'ring-2 ring-green-500 bg-green-50 border-green-300'
                : 'hover:bg-gray-50 hover:shadow-md'
            }`}
            onClick={() => !isDisabled && handleTogglePriority(q.question.id)}
          >
            {/* Checkbox row - now just visual indicator */}
            <div className="flex items-start gap-3">
              <div className={`mt-1 h-5 w-5 border-2 rounded flex items-center justify-center ${
                selectedPriorities.includes(q.question.id)
                  ? 'bg-green-600 border-green-600'
                  : 'border-gray-400'
              }`}>
                {selectedPriorities.includes(q.question.id) && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{`${index + 1}. ${language === "en" ? q.question.question : language === "zh" ? q.question.chineseDescription : ""}`}</span>
              </div>
            </div>

            {/* Previous response (disabled radio buttons) */}
            <div className="ml-8 p-2 rounded text-gray-700">
              {language === "en" ? "Previously selected option: " : language === "zh" ? "先前选择的选项：" : ""}
              <strong>
                {language === "en"
                  ? q.question.list[q.answervalue]
                  : language === "zh"
                  ? q.question.chList[q.answervalue]
                  : ""}
              </strong>
            </div>
          </div>
        ))}
      </div>
      <div className={`${isDisabled ? 'mb-6' : ''}`}>
      {!isDisabled && (
        <div className="mt-4">
          <GreenButton buttonText={language === "en" ? "Submit Priorities" : language === "zh" ? "提交优先事项" : ""} />
        </div>
      )}
      </div>
    </form>
  );
};

export default PrioritiesContent;
