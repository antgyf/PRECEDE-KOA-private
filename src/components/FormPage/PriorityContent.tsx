import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../hooks/AlertContext";
import { Questions } from "../../models/patient/patientDetails";
import api from "../../api/api";
import { useForm,  } from "../../hooks/FormContext";
import GreenButton from "../UI/Button/GreenButton";

interface PriorityContentProps {
  term: number;
  onSubmit?: () => void;
}

const PrioritiesContent: React.FC<PriorityContentProps> = ({ term, onSubmit }) => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { patient, form, setPriorities } = useForm();
  const [availableQuestions, setAvailableQuestions] = useState(Questions);
  const [selectedPriorities, setSelectedPriorities] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [minPriorities, setMinPriorities] = useState(5);
  const [isDisabled, setIsDisabled] = useState(false);

  /** Fetch responses to determine available questions & previous priorities */
  useEffect(() => {
    if (!form?.priorities || term === undefined) return;

    const fetchData = async () => {
      setIsLoading(true);
      showAlert("Loading priorities...", "info");
      
      try {

        if (!patient?.patientid) throw new Error("No patient ID found");

        const response = await api.get("/patients/responses", {
          params: { patientid: patient.patientid, term },
        });

        const responses = response.data;
        const filteredResponses = responses.filter((r: any) => r.answervalue !== 0);

        const filteredQuestions = Questions.filter(q =>
          filteredResponses.some((r: any) => r.code === q.code)
        );

        setAvailableQuestions(filteredQuestions);
        const calculatedMinPriorities = Math.min(5, filteredQuestions.length);
        setMinPriorities(calculatedMinPriorities);

        if (filteredQuestions.length < 5) {
          showAlert(`Only ${calculatedMinPriorities} problem areas available for prioritization.`, "info");
        }

        // Check if priorities already exist
        const existingPriorities = filteredResponses
          .filter((r: any) => r.priority) // API marks previous priorities
          .map((r: any) => r.questionid);

        if (existingPriorities.length > 0 && term != form?.term) {
          setPriorities(existingPriorities);
          setSelectedPriorities(existingPriorities);
          setIsDisabled(true); // disable checkboxes & submission
          return;
        }

        if (form?.priorities && form.term === term) {
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
        : prev.length < minPriorities
        ? [...prev, questionId]
        : prev
    );
  };

  /** Submit via form onSubmit to get event object automatically */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!patient?.patientid || term === undefined) return;

    if (selectedPriorities.length < minPriorities) {
      showAlert(`Please select exactly ${minPriorities} priorities.`, "error");
      return;
    }

    const prioritiesData = {
      patientid: patient.patientid,
      term,
      priorities: selectedPriorities,
      minPriorities,
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
      <h3>Select your top priorities ({minPriorities} priorities):</h3>
      {availableQuestions.map((q) => (
        <div key={q.id} className="flex items-center gap-2 text-lg">
          <input
            type="checkbox"
            checked={selectedPriorities.includes(q.id)}
            onChange={() => handleTogglePriority(q.id)}
            disabled={isDisabled}
          />
          <span>{q.question}</span>
        </div>
      ))}
      {!isDisabled && (
        <div className="mt-4">
          <GreenButton buttonText="Submit Priorities" />
        </div>
      )}
    </form>
  );
};

export default PrioritiesContent;
