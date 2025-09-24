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

interface FormContentProps {
  term: number;
}

const FormContent: React.FC<FormContentProps> = ({ term }) => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { patient, setCurrentForm } = useForm();

  // answers keyed by question code
  const [answers, setAnswers] = useState<Record<string, string>>(
    () => Questions.reduce((acc, q) => ({ ...acc, [q.code]: "" }), {})
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  /** Fetch form for selected term */
  useEffect(() => {
    if (!patient?.patientid) return;

    const fetchPatientForm = async () => {
      setIsLoading(true);
      showAlert("Loading...", "info");
      try {
        const response = await api.get("/patients/form", {
          params: { patientid: patient.patientid, term },
        });

        if (response.data.length === 0) {
          // No form yet for this term
          setAnswers(
            Questions.reduce((acc, q) => ({ ...acc, [q.code]: "" }), {})
          );
          setIsDisabled(false);
          showAlert("No form exists for this term. You can create one.", "info");
          return;
        }

        const formData = response.data[0];
        setCurrentForm(formData);

        const populatedAnswers = Questions.reduce((acc, q) => {
          acc[q.code] = formData[q.code]?.toString() || "0";
          return acc;
        }, {} as Record<string, string>);

        setAnswers(populatedAnswers);
        setIsDisabled(true); // disable editing if already filled
      } catch (error) {
        console.error("Error fetching form data:", error);
        showAlert("Error loading form data.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientForm();
  }, [term, patient?.patientid]);

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

    const unansweredQuestions = Questions.filter(
      (q) => !answers[q.code] || answers[q.code] === ""
    );

    if (unansweredQuestions.length > 0) {
      showAlert("Please answer all questions before submitting.", "error");
      return;
    }

    // ✅ Transform answers to match API structure
    const responses = Questions.map((q) => ({
      questionid: q.id,
      answervalue: parseInt(answers[q.code]),
    }));

    const formData = {
      patientid: patient?.patientid,
      term,
      responses,
    };

    try {
      showAlert("Submitting form...", "info");
      const response = await api.post(`/patients/forms`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      showAlert(
        response.data.message || "Form submitted successfully!",
        "success"
      );
      navigate("/home");
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
    <div className="w-full h-full flex flex-col overflow-y-auto px-6 py-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <p>Loading form data...</p>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <PatientDetail />
          <article className="prose-lg font-bold m-0">
            <h4 className="my-0">Please answer all questions below.</h4>
          </article>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Questions.map((q, index) => (
              <div key={q.id} className="w-full">
                <RadioChoice
                  name={q.code}
                  question={`${index + 1}. ${q.question}`}
                  list={q.list}
                  onChange={(value) => handleRadioInput(q.code, value)}
                  value={answers[q.code]}
                  disabled={isDisabled}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            {!isDisabled && <GreenButton buttonText="Submit" />}
          </div>
        </form>
      )}
    </div>
  );
};

export default FormContent;
