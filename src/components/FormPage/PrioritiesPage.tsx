import React from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../UI/Button/BackButton";
import ForwardButton from "../UI/Button/ForwardButton";
import LogoutButton from "../UI/Button/LogoutButton";
import { useAlert } from "../../hooks/AlertContext";
import Alert from "../UI/Alert";
import PrioritiesContent from "./PriorityContent";
import { useForm } from "../../hooks/FormContext";

const PrioritiesPage: React.FC = () => {
  const { alert } = useAlert();
  const { form } = useForm();

  // Get term from query params
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const term = Number(query.get("term"));

  if (isNaN(term)) {
    return <div>Error: No term specified</div>;
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-neutral">
      {/* Fixed top banner */}
      <div className="fixed top-0 left-0 w-full bg-white z-40 shadow-md p-4 flex justify-between items-center h-20">
        {alert.message && <Alert />}
        <BackButton target="Form Page" to="/form" />
        <div className="flex flex-row gap-4">
          {form?.priorities && (
            <ForwardButton target="Analysis Page" to="/analysis" />
          )}
          <LogoutButton />
        </div>
      </div>

      {/* Main content shifted down by banner height */}
      <div className="flex-1 w-full max-w-7xl px-4 mt-24 overflow-y-auto">
        <PrioritiesContent
          key={term}
          term={term}
        />
      </div>
    </div>
  );
};

export default PrioritiesPage;
