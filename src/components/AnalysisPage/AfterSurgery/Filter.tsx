import React, { useState } from "react";
import { FilterType } from "../../../models/patient/patientDetails";

interface FilterButtonProps {
  category: string;
  toggleFilterCategory: (category: string) => void;
  isSelected: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  category,
  toggleFilterCategory,
  isSelected,
}) => {
  return (
    <button
      key={category}
      onClick={() => toggleFilterCategory(category)}
      className={`py-2 px-4 rounded-full border-2 ${
        isSelected
          ? "bg-accent text-white border-accent"
          : "bg-white text-gray-800 border-gray-500"
      } transition-all`}
    >
      {category}
    </button>
  );
};

const FilterButtonsComponent: React.FC<{
  onFilterApply: (selectedFilters: FilterType) => void;
}> = ({ onFilterApply }) => {
  const filterCategories = ["Gender", "Ethnicity"];

  const [selectedFilters, setSelectedFilters] = useState<FilterType>({
    categories: ["Age Range", "BMI Range"],
    age: { range: 5 },
    bmi: { range: 5 },
  });

  const toggleFilterCategory = (category: string) => {
    const isSelected = selectedFilters.categories.includes(category);
    const updatedCategories = isSelected
      ? selectedFilters.categories.filter((filter) => filter !== category)
      : [...selectedFilters.categories, category];

    setSelectedFilters({ ...selectedFilters, categories: updatedCategories });
  };

  const handleRangeChange = (type: "age" | "bmi", value: string) => {
    const numericValue = value ? parseInt(value, 10) : undefined;
    setSelectedFilters({
      ...selectedFilters,
      [type]: { range: numericValue },
    });
  };

  const handleApplyFilters = () => {
    onFilterApply(selectedFilters);
  };

  return (
    <div className="p-5 bg-secondary rounded-md shadow-md">
      <h3 className="text-xl font-bold mb-2">Choose Filters</h3>

      <div className="flexflex-wrap lg:flex-nowrap lg:justify-between gap-4">
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col items-start gap-2">
            <FilterButton
              key={"Age Range"}
              category={"Age Range"}
              toggleFilterCategory={toggleFilterCategory}
              isSelected={selectedFilters.categories.includes("Age Range")}
            />
            {selectedFilters.categories.includes("Age Range") && (
              <div className="flex flex-row gap-2 items-center">
                Within
                <input
                  type="number"
                  className="input input-bordered w-12"
                  min={1}
                  max={50}
                  value={selectedFilters.age?.range ?? ""}
                  onChange={(e) => handleRangeChange("age", e.target.value)}
                />
                years
              </div>
            )}
          </div>

          <div className="flex flex-col items-start gap-2">
            <FilterButton
              key={"BMI Range"}
              category={"BMI Range"}
              toggleFilterCategory={toggleFilterCategory}
              isSelected={selectedFilters.categories.includes("BMI Range")}
            />

            {selectedFilters.categories.includes("BMI Range") && (
              <div className="flex flex-row gap-2 items-center">
                Within
                <input
                  type="number"
                  className="input input-bordered w-12"
                  min={1}
                  max={60}
                  value={selectedFilters.bmi?.range ?? ""}
                  onChange={(e) => handleRangeChange("bmi", e.target.value)}
                />
                kg/m²
              </div>
            )}
          </div>

          <div className="flex flex-col items-start">
            <div className="flex gap-4">
              {filterCategories.map((category) => (
                <FilterButton
                  key={category}
                  category={category}
                  toggleFilterCategory={toggleFilterCategory}
                  isSelected={selectedFilters.categories.includes(category)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-auto flex justify-end h-12">
          <button
            className="py-2 px-6 btn-accent text-white rounded-md transition-all"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterButtonsComponent;
