import React from "react";

interface LanguageToggleProps {
  currentLang: string;
  onChange: (lang: string) => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLang,
  onChange,
}) => {
  const isEnglish = currentLang === "en";

  const handleToggle = () => {
    onChange(isEnglish ? "zh" : "en");
  };

  return (
    <div className="m-2">
      <button
        onClick={handleToggle}
        className="bg-primary text-white hover:bg-primary-hover rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
      >
        {isEnglish ? "华语版" : "English version"}
      </button>
    </div>
  );
};

export default LanguageToggle;