import React from "react";
import RadioChoice from "../UI/Form/RadioChoice";
import GreenButton from "../UI/Button/GreenButton";
import PatientDetail from "./PatientDetail";
import { Questions } from "../../models/patient/patientDetails";


interface DesktopFormProps {
  Questions: typeof Questions;
  answers: Record<string, string>;
  handleRadioInput: (code: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isDisabled: boolean;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  originalAnswers: Record<string, string>;
  language: string;
}

const DesktopForm: React.FC<DesktopFormProps> = ({
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
}) => {
  
  const isUnchanged = React.useMemo(() => {
    return JSON.stringify(answers) === JSON.stringify(originalAnswers);
  }, [answers, originalAnswers]);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <PatientDetail currentLang={language} />

      <h4 className="text-3xl font-bold">
        {language === "en"
          ? "Please answer all questions below."
          : "请回答以下所有问题。"}
      </h4>

      <div className="grid grid-cols-1 gap-8 text-base">
        {Questions.map((q, index) => (
          <RadioChoice
            key={q.id}
            name={q.code}
            question={`${index + 1}. ${
              language === "en" ? q.question : q.chQuestion
            }`}
            list={language === "en" ? q.list : q.chList}
            onChange={(value) => handleRadioInput(q.code, value)}
            value={answers[q.code]}
            disabled={isDisabled}
          />
        ))}
      </div>

      <div className="flex justify-end gap-4 mt-6">
        {isDisabled && !isEditing && (
          <GreenButton
            buttonText={language === "en" ? "Edit" : "编辑"}
            onButtonClick={() => {
              setIsEditing(true);
              setIsDisabled(false);
            }}
          />
        )}

        {isEditing && (
          <GreenButton
            buttonText={language === "en" ? "Cancel" : "取消"}
            onButtonClick={() => {
              setAnswers(originalAnswers);
              setIsEditing(false);
              setIsDisabled(true);
            }}
          />
        )}

        {!isDisabled && (
          <GreenButton
            buttonText={
              isEditing
                ? language === "en"
                  ? "Update"
                  : "更新"
                : language === "en"
                ? "Submit"
                : "提交"
            }
            disabled={isUnchanged}
          />
        )}
      </div>
    </form>
  );
};

export default DesktopForm;