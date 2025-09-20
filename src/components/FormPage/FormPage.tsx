import React from "react";
import BackButton from "../UI/Button/BackButton";
import ForwardButton from "../UI/Button/ForwardButton";
import FormContent from "./FormContent";
import LogoutButton from "../UI/Button/LogoutButton";
import { useForm } from "../../hooks/FormContext";
import { useAlert } from "../../hooks/AlertContext";
import Alert from "../UI/Alert";

const FormPage: React.FC = () => {
  const { patient } = useForm();
  const { alert } = useAlert();

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-neutral">
      <div className="fixed pt-14 left-0 w-full bg-white z-40 shadow-md p-4 flex justify-between items-center">
        {alert.message && <Alert />}
        <BackButton target="Patient Page" to="/home" />
        <div className="flex flex-row gap-4">
          {patient?.hasform && (
            <ForwardButton target="Analysis Page" to="/analysis" />
          )}
          <LogoutButton />
        </div>
      </div>

      {/* Form Content Wrapper (Scrollable & Avoids Overlap) */}
      <div className="flex-1 w-screen max-w-7xl px-4 pt-4 mt-32 rounded-lg overflow-y-auto">
        <FormContent />
      </div>
    </div>
  );
};

export default FormPage;
