import React, { useState, useEffect } from "react";
import { FilterType } from "../../../models/patient/patientDetails";
import api from "../../../api/api";

interface FilterButtonProps {
  category: string;
  toggleFilterCategory: (category: string) => void;
  isSelected: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  category,
  toggleFilterCategory,
  isSelected,
}) => (
  <button
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

interface FilterButtonsComponentProps {
  onFilterApply: (selectedFilters: FilterType) => void;
  activeTab: "summary" | "before" | "after";
}

const FilterButtonsComponent: React.FC<FilterButtonsComponentProps> = ({
  onFilterApply,
  activeTab,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<FilterType>({
    categories: ["Age Range", "BMI Range"],
    age: { range: 5 },
    bmi: { range: 5 },
    surgeontitle: "",
    surgeonid: "",
  });

  const [surgeonIds, setSurgeonIds] = useState<string[]>([]);
  const [loadingSurgeons, setLoadingSurgeons] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Determine which dropdown should be disabled
  const isSurgeonTitleDisabled = !!selectedFilters.surgeonid;
  const isSurgeonIdDisabled = !!selectedFilters.surgeontitle;

  // Fetch surgeon IDs from backend
  useEffect(() => {
    const fetchSurgeonIds = async () => {
      try {
        setLoadingSurgeons(true);
        setError(null);

        const response = await api.get("/surgeons/available-ids");

        if (!response.data) throw new Error("Failed to fetch surgeon IDs");

        const data = response.data;
        
        // Handle different response formats safely
        if (Array.isArray(data)) {
          const ids = data.map((surgeon: any) => 
            surgeon.surgeonid?.toString() || surgeon.id?.toString() || surgeon.toString()
          );
          setSurgeonIds(ids);
        } else if (typeof data === 'object' && data.ids) {
          setSurgeonIds(data.ids.map((id: any) => id.toString()));
        } else {
          throw new Error("Unexpected response format from server");
        }
      } catch (err: any) {
        console.error("Error fetching surgeon IDs:", err);
        setError(err.message || "An error occurred while fetching surgeons.");
      } finally {
        setLoadingSurgeons(false);
      }
    };

    fetchSurgeonIds();
  }, []);

  const toggleFilterCategory = (category: string) => {
    const isSelected = selectedFilters.categories.includes(category);
    const updatedCategories = isSelected
      ? selectedFilters.categories.filter((filter) => filter !== category)
      : [...selectedFilters.categories, category];

    setSelectedFilters({ ...selectedFilters, categories: updatedCategories });
  };

  const handleRangeChange = (type: "age" | "bmi", value: string) => {
    const numericValue = value ? parseInt(value, 10) : 0;
    setSelectedFilters({
      ...selectedFilters,
      [type]: { range: numericValue },
    });
  };

  const handleDropdownChange = (field: "surgeontitle" | "surgeonid", value: string) => {
    // If selecting a value in one dropdown, clear the other dropdown
    const updatedFilters = { 
      ...selectedFilters, 
      [field]: value 
    };
    
    if (field === "surgeontitle" && value) {
      updatedFilters.surgeonid = ""; // Clear surgeon ID when title is selected
    } else if (field === "surgeonid" && value) {
      updatedFilters.surgeontitle = ""; // Clear surgeon title when ID is selected
    }
    
    setSelectedFilters(updatedFilters);
  };

  const clearAllFilters = () => {
    // Reset to only Age Range and BMI Range with default values
    setSelectedFilters({
      categories: ["Age Range", "BMI Range"],
      age: { range: 5 },
      bmi: { range: 5 },
      surgeontitle: "",
      surgeonid: "",
    });
  };

  const handleApplyFilters = () => {
    onFilterApply(selectedFilters);
  };

  return (
    <div className="p-5 bg-secondary rounded-md shadow-md">
      <h3 className="text-xl font-bold mb-4">Choose Filters</h3>

      <div className="flex flex-col gap-6">
        {/* MAIN FILTER ROW - Everything in one horizontal line */}
        <div className="flex flex-wrap items-start gap-6">
          {/* AGE RANGE */}
          <div className="flex flex-col items-start gap-2">
            <FilterButton
              category="Age Range"
              toggleFilterCategory={toggleFilterCategory}
              isSelected={selectedFilters.categories.includes("Age Range")}
            />
            {selectedFilters.categories.includes("Age Range") && (
              <div className="flex flex-row gap-2 items-center mt-2">
                Within
                <input
                  type="number"
                  className="input input-bordered w-16 h-8 text-sm"
                  min={1}
                  max={50}
                  value={selectedFilters.age?.range || 5}
                  onChange={(e) => handleRangeChange("age", e.target.value)}
                />
                years
              </div>
            )}
          </div>

          {/* BMI RANGE */}
          <div className="flex flex-col items-start gap-2">
            <FilterButton
              category="BMI Range"
              toggleFilterCategory={toggleFilterCategory}
              isSelected={selectedFilters.categories.includes("BMI Range")}
            />
            {selectedFilters.categories.includes("BMI Range") && (
              <div className="flex flex-row gap-2 items-center mt-2">
                Within
                <input
                  type="number"
                  className="input input-bordered w-16 h-8 text-sm"
                  min={1}
                  max={60}
                  value={selectedFilters.bmi?.range || 5}
                  onChange={(e) => handleRangeChange("bmi", e.target.value)}
                />
                kg/m²
              </div>
            )}
          </div>

          {/* GENDER & ETHNICITY BUTTONS */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {["Gender", "Ethnicity"].map((category) => (
                <FilterButton
                  key={category}
                  category={category}
                  toggleFilterCategory={toggleFilterCategory}
                  isSelected={selectedFilters.categories.includes(category)}
                />
              ))}
            </div>
          </div>

          {/* SURGEON FILTERS - Positioned next to ethnicity */}
          {activeTab !== "before" && (
          <div className="flex flex-wrap gap-4 items-start">
            {/* SURGEON TITLE DROPDOWN */}
            <div className="flex flex-col gap-2">
              <select
                className={`select w-40 h-10 text-sm ${
                  isSurgeonTitleDisabled 
                    ? "select-disabled bg-gray-100 text-gray-400" 
                    : "select-bordered"
                }`}
                value={selectedFilters.surgeontitle || ""}
                onChange={(e) => handleDropdownChange("surgeontitle", e.target.value)}
                disabled={isSurgeonTitleDisabled}
              >
                <option value="">Surgeon Title</option>
                <option value="Associate Consultant">Associate Consultant</option>
                <option value="Consultant">Consultant</option>
                <option value="Associate Professor OR p.surgeontitle = Professor">Senior Consultant</option>
              </select>
            </div>

            {/* SURGEON ID DROPDOWN AND CLEAR BUTTON */}
            <div className="flex items-end gap-2">
              <div className="flex flex-col gap-2">
                {loadingSurgeons ? (
                  <div className="w-40 h-10 flex items-center justify-center border rounded-lg bg-gray-100 text-sm">
                    <span>Loading...</span>
                  </div>
                ) : error ? (
                  <div className="w-40">
                    <p className="text-red-500 text-xs">{error}</p>
                  </div>
                ) : (
                  <select
                    className={`select w-40 h-10 text-sm ${
                      isSurgeonIdDisabled 
                        ? "select-disabled bg-gray-100 text-gray-400" 
                        : "select-bordered"
                    }`}
                    value={selectedFilters.surgeonid || ""}
                    onChange={(e) => handleDropdownChange("surgeonid", e.target.value)}
                    disabled={isSurgeonIdDisabled}
                  >
                    <option value="">Surgeon ID</option>
                    {surgeonIds.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
          )}
        </div>

        

        {/* APPLY BUTTON */}
        <div className="flex justify-end gap-2">
          {/* CLEAR BUTTON */}
          <button
            onClick={clearAllFilters}
            className="py-2 px-6 bg-accent text-white rounded-md transition-all hover:bg-accent-dark"
            title="Clear all filters"
          >
            Clear
          </button>
          <button
            className="py-2 px-6 bg-accent text-white rounded-md transition-all hover:bg-accent-dark"
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