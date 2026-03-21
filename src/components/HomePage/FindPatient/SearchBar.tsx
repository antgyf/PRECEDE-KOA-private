import React from "react";
import BrownButton from "../../UI/Button/BrownButton";

interface SearchBarProps {
  query: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onClear: () => void;
}
const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChange,
  onSearch,
  onClear,
}) => {
  return (
    <div className="flex items-center gap-2 mt-2 w-full max-w-md">
      <input
        type="text"
        className="input input-bordered grow"
        placeholder="Search by name of patient"
        value={query}
        onChange={onChange}
      />
      <BrownButton buttonText="Search" onButtonClick={onSearch} />
      <BrownButton buttonText="Clear" onButtonClick={onClear} />
    </div>
  );
};

export default SearchBar;
