import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../hooks/AlertContext";
import RadioChoice from "../UI/Form/RadioChoice";
import { Questions } from "../../models/patient/patientDetails";
import RankingSection from "./RankingSection";
import axios, { AxiosError } from "axios";
import { useForm } from "../../hooks/FormContext";
import GreenButton from "../UI/Button/GreenButton";
import PatientDetail from "./PatientDetail";

const FormContent: React.FC = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { patient, setCurrentForm } = useForm();

  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(
    () => new Set()
  );
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Questions.reduce((acc, q) => ({ ...acc, [q.name]: "" }), {})
  );

  const [rankingOptions, setRankingOptions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (!patient?.hasform) return;

    const fetchPatientForm = async () => {
      setIsLoading(true);
      showAlert("Loading...", "info");
      try {
        const response = await axios.get(
          "https://precede-koa.netlify.app/.netlify/functions/api/patients/form",
          {
            params: { patientid: patient.patientid },
          }
        );
        showAlert("Successfully loaded from data", "success");
        const formData = response.data[0];
        setCurrentForm(formData);

        // Populate the state with retrieved data
        const populatedAnswers = Questions.reduce((acc, q) => {
          acc[q.name] = formData[q.name]?.toString() || "0";
          return acc;
        }, {} as Record<string, string>);

        // Populate selectedQuestions with rank1 through rank5
        const ranks = [
          formData.rank1,
          formData.rank2,
          formData.rank3,
          formData.rank4,
          formData.rank5,
        ];

        setAnswers(populatedAnswers);
        setSelectedQuestions(new Set(ranks));
        setRankingOptions(ranks);
        setIsDisabled(true); // Disable the form if it has been filled
      } catch (error) {
        console.error("Error fetching form data:", error);
        showAlert("Error loading form data.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientForm();
  }, []);

  const handleCheckboxChange = (questionName: string) => {
    setSelectedQuestions((prev) => {
      const updated = new Set(prev);
      if (updated.has(questionName)) {
        updated.delete(questionName);
      } else if (updated.size < 5) {
        updated.add(questionName);
      } else {
        showAlert("You can select exactly 5 areas only.", "error");
      }
      return updated;
    });
  };

  const handleRadioInput = (name: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate that exactly 5 questions are selected
    if (selectedQuestions.size !== 5) {
      showAlert("You must select exactly 5 areas before proceeding.", "error");
      return;
    }

    // Validate all radio inputs
    const unansweredQuestions = Questions.filter(
      (q) => !answers[q.name] || answers[q.name] === ""
    );

    if (unansweredQuestions.length > 0) {
      showAlert("Please answer all questions before submitting.", "error");
      return;
    }

    // Move to the ranking page
    setRankingOptions(Array.from(selectedQuestions));
    setCurrentPage(2);
  };

  const handleBack = () => {
    setCurrentPage(1);
  };

  const handleSubmit = async (rankedValues: string[]) => {
    const formData = {
      ...answers,
      rank1: rankedValues[0],
      rank2: rankedValues[1],
      rank3: rankedValues[2],
      rank4: rankedValues[3],
      rank5: rankedValues[4],
      patientid: patient?.patientid,
    };

    try {
      showAlert("Submitting form...", "info");
      const response = await axios.post(
        `https://precede-koa.netlify.app/.netlify/functions/api/patients/form`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
      ) : currentPage === 1 ? (
        <form className="flex flex-col gap-4" onSubmit={handleNext}>
          <PatientDetail />
          <article className="prose-lg font-bold m-0">
            <h4 className="my-0">
              Please check the boxes next to the top 5 areas where you would
              like to see improvements.
            </h4>
          </article>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Questions.map((q, index) => (
              <div key={index} className="flex items-start gap-4">
                {/* Checkbox */}
                <div>
                  <input
                    type="checkbox"
                    id={`question-${index}`}
                    className="checkbox bg-white checkbox-accent border-2"
                    onChange={() => handleCheckboxChange(q.name)}
                    checked={selectedQuestions.has(q.name)}
                    disabled={isDisabled}
                  />
                </div>

                {/* RadioChoice Component */}
                <div className="w-full">
                  <RadioChoice
                    name={q.name}
                    question={`${q.question}`}
                    list={q.list}
                    onChange={(value) => handleRadioInput(q.name, value)}
                    value={answers[q.name]}
                    disabled={isDisabled}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end m-0">
            <GreenButton buttonText="Next" />
          </div>
        </form>
      ) : (
        <>
          <RankingSection
            rankingOptions={rankingOptions}
            values={isDisabled ? rankingOptions : undefined}
            onSubmit={handleSubmit}
            disabled={isDisabled}
          />
          <div className="mt-4 flex justify-between">
            <GreenButton buttonText="Back" onButtonClick={handleBack} />
            {!isDisabled && (
              <GreenButton
                buttonText="Submit"
                onButtonClick={() => handleSubmit(rankingOptions)}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FormContent;
