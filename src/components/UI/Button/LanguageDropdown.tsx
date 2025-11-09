import React from "react";

interface LanguageDropdownProps {
  currentLang: string;
  onChange: (lang: string) => void;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  currentLang,
  onChange,
}) => {
  return (
    <div className="m-2">
        <select
        value={currentLang}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-primary text-white border-0 hover:bg-primary-hover rounded-lg px-3 py-2 focus:outline-none min-w-[70px] cursor-pointer"
        style={{
            backgroundImage: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
        }}
        >
        <option value="en">English</option>
        <option value="zh">中文</option>
        </select>
    </div>
  );
};

export default LanguageDropdown;