import React from "react";
import { useNavigate } from "react-router-dom";

interface ForwardButtonProps {
  target: string;
  to: string;
  onClick?: () => void;
  isDisabled?: boolean;
}

const ForwardButton: React.FC<ForwardButtonProps> = ({
  target,
  to,
  onClick,
  isDisabled = false,
}) => {
  const navigate = useNavigate();

  const handleForward = () => {
    if (isDisabled) {
      alert("Please complete all required fields before proceeding.");
      return;
    }

    if (onClick) onClick();
    navigate(to);
  };

  return (
    <button
      disabled={isDisabled}
      onClick={handleForward}
      className={`btn flex items-center gap-2 text-lg m-2 text-white
        ${
          isDisabled
            ? "bg-gray-400 cursor-not-allowed opacity-60"
            : "btn-primary hover:brightness-110"
        }`}
    >
      {target}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
        />
      </svg>
    </button>
  );
};

export default ForwardButton;
