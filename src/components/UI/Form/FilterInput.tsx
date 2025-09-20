export interface SelectProps {
  label: string;
  list: Record<string, string>;
  name: string;
  value?: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterInput: React.FC<SelectProps> = ({
  label,
  list,
  name,
  value,
  onChange,
}) => {
  return (
    <select
      className="select select-bordered max-w-xs mr-2 mt-2 text-[16px]"
      value={value || ""}
      name={name}
      onChange={onChange}
    >
      <option value="">{label}</option>
      {Object.entries(list).map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </select>
  );
};

export default FilterInput;
