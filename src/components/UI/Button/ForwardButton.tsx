import React from "react";
import { useNavigate } from "react-router-dom";

interface ForwardButtonProps {
  target: string; // Name of the next component or page
  to: string; // Path to navigate
  onClick?: () => void; // Optional extra logic to execute on click
}

const ForwardButton: React.FC<ForwardButtonProps> = ({ target, to, onClick }) => {
  const navigate = useNavigate();

  const handleForward = () => {
    // Call any extra logic from parent
    if (onClick) onClick();

    // Navigate after that
    navigate(to);
  };

  return (
    <button
      onClick={handleForward}
      className="btn btn-primary flex items-center gap-2 text-lg m-2 text-white"
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
