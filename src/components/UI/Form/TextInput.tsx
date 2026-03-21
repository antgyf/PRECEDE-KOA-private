import React from "react";

export interface TextInputProps {
  name: string;
  label: string;
  placeholder?: string;
  password?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  placeholder,
  password,
  disabled,
  value,
  onChange,
}) => {
  return (
    <label className="form-control w-full">
      <article className="prose label">
        <h4>{label}</h4>
      </article>
      <input
        name={name}
        type={password ? "password" : "text"}
        placeholder={placeholder}
        className={`input input-bordered w-full ${
          disabled ? "!bg-gray-300" : ""
        }`}
        onChange={onChange}
        disabled={disabled}
        value={value}
      />
    </label>
  );
};

export default TextInput;
