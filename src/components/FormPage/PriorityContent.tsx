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
  onSubmit?: () => void;
}

const PrioritiesContent: React.FC<PriorityContentProps> = ({ term, onSubmit }) => {
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
      showAlert("Loading priorities...", "info");
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
          showAlert(`Only ${calculatedMinPriorities} problem areas available for prioritization.`, "info");
        }

        console.log("form from context:", form?.priorities);
      
        if (form && !form.priorities) {
          setSelectedPriorities([]);
          setIsDisabled(false);
        }

        const existingPriorities = await api.get("/patients/priority", {
          params: { patientid: patient.patientid, term }
        });

        if (existingPriorities.data?.priorities?.length > 0) {
          console.log("Existing priorities found from backend:", existingPriorities.data.priorities);
          setSelectedPriorities(existingPriorities.data.priorities);
          setPriorities(existingPriorities.data.priorities);
          setIsDisabled(true);
          return;
        }

        // If priorities already exist for this term, load them and disable further changes
        if (form?.priorities && form.term === term) {
          console.log("Existing priorities found:", form.priorities);
          setSelectedPriorities(form.priorities);
          setPriorities(form.priorities);
          setIsDisabled(true);
          return;
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
      showAlert(`Please select ${maxPriorities} or less priorities.`, "error");
      return;
    }

    const prioritiesData = {
      patientid: patient.patientid,
      term,
      priorities: selectedPriorities,
      maxPriorities: maxPriorities,
    };

    try {
      showAlert("Submitting priorities...", "info");
      const response = await api.post("/patients/priorities", prioritiesData, {
        headers: { "Content-Type": "application/json" },
      });

      setPriorities(selectedPriorities);
      showAlert(response.data.message || "Priorities submitted successfully!", "success");

      onSubmit?.();
      navigate(`/analysis?term=${term}`);
    } catch (err) {
      console.error("Error submitting priorities:", err);
      showAlert("An error occurred while submitting priorities.", "error");
    }
  };

  if (isLoading) return <p>Loading priorities...</p>;

  return (
    <form className="flex flex-col gap-4 text-lg" onSubmit={handleSubmit}>
      <h3>Below are the health problems you reported. Please select up to 5 problems you wish to improve most by placing a ☑ in front of the relevant questions.
        </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableQuestions.map((q, index) => (
          <div
            key={q.question.id}
            className="p-4 border rounded-xl shadow-sm bg-white flex flex-col gap-2"
          >
            {/* Checkbox row */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedPriorities.includes(q.question.id)}
                disabled={isDisabled}
                onChange={() => handleTogglePriority(q.question.id)}
                className="mt-1 h-5 w-5 accent-green-600 cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="font-medium">{`${index + 1}. ${q.question.question}`}</span>
              </div>
            </div>

            {/* Previous response (disabled radio buttons) */}
            <div className="ml-8">
              <RadioChoice
                name={q.question.code}
                question=""
                list={q.question.list}
                value={String(q.answervalue)}
                disabled={true}
                onChange={() => {}}
              />
            </div>
          </div>
        ))}
      </div>
      {!isDisabled && (
        <div className="mt-4">
          <GreenButton buttonText="Submit Priorities" />
        </div>
      )}
    </form>
  );
};

export default PrioritiesContent;
