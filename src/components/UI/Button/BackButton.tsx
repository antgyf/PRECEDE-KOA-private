import React from "react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  target: string; // Name of the component or page
  to: string; // Path to navigate
}

const BackButton: React.FC<BackButtonProps> = ({ target, to }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(to);
  };

  return (
    <button
      onClick={handleBack}
      className="btn btn-primary flex items-center justify-center gap-2 text-lg m-2 text-white leading-snug text-center max-md:w-full max-md:m-0 max-md:text-base max-md:whitespace-normal max-md:break-keep"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-5 h-5 shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      {target}
    </button>
  );
};

export default BackButton;
