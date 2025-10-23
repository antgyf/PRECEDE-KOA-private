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
  term?: number; // optional, fallback to context
}

const FormContent: React.FC<FormContentProps> = ({ term }) => {
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
    showAlert("Loading...", "info");

    try {
      const response = await api.get("/patients/form", {
        params: { patientid: patient.patientid, term: termToUse },
      });

      if (response.data.length === 0) {
        setAnswers(Questions.reduce((acc : Record<string, string>, q) => ({ ...acc, [q.code]: "" }), {}));
        setIsDisabled(false);
        showAlert("No form exists for this term. You can create one.", "info");
        return;
      }

      const formData = response.data[0];

      // Only update context if the current form in context is undefined or different
      if (!form || form.term !== termToUse) {
        console.log("Setting current form in context:", formData);
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
      showAlert("Error loading form data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  fetchPatientForm();
}, [patient?.patientid, termToUse, form, setCurrentForm]);

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
      showAlert("Please answer all questions before submitting.", "error");
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

      showAlert(
        response.data.message || "Form submitted successfully!",
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
    <div className="w-full h-full flex flex-col overflow-y-auto px-6 py-4 text-lg">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <p>Loading form data...</p>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <PatientDetail />
          <article className="prose-lg font-bold m-0 text-lg">
            <h4 className="my-0">Please answer all questions below.</h4>
          </article>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Questions.map((q, index) => (
              <div key={q.id} className="w-full text-lg">
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
