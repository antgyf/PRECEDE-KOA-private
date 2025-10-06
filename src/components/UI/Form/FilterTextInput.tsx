export interface FilterTextProps {
  label: string;
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; // default "text", can be "number" for numeric inputs
}

const FilterTextInput: React.FC<FilterTextProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
}) => {
  return (
    <div className="mr-2 mt-2"> 
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="input input-bordered max-w-xs text-[16px] placeholder-black" 
        placeholder={label}
        min={type === "number" ? 1 : undefined}  // disallow negatives
      />
    </div>
  );
};

export default FilterTextInput;
