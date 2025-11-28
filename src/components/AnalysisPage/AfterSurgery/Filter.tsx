import React, { useState, useEffect } from "react";
import { FilterType } from "../../../models/patient/patientDetails";
import api from "../../../api/api";

interface FilterButtonProps {
  value: string;            // internal param ("Age Range")
  label: string;            // displayed label ("年龄范围")
  toggleFilterCategory: (value: string) => void;
  isSelected: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  value,
  label,
  toggleFilterCategory,
  isSelected,
}) => (
  <button
    onClick={() => toggleFilterCategory(value)}
    className={`py-2 px-4 rounded-full border-2 ${
      isSelected
        ? "bg-accent text-white border-accent"
        : "bg-white text-gray-800 border-gray-500"
    } transition-all`}
  >
    {label}
  </button>
);

interface FilterButtonsComponentProps {
  onFilterApply: (selectedFilters: FilterType) => void;
  activeTab: "summary" | "before" | "after";
  currentLang: string; // "en" | "zh"
}

const FilterButtonsComponent: React.FC<FilterButtonsComponentProps> = ({
  onFilterApply,
  activeTab,
  currentLang,
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
      <h3 className="text-xl font-bold mb-4">{currentLang === "zh" ? "使用以下选项根据手术前的特征定义相似的患者" : 
      "Use the filters below to redefine similar patients based on their characteristics before surgery"}</h3>

      <div className="flex flex-col gap-6">
        {/* MAIN FILTER ROW - Everything in one horizontal line */}
        <div className="flex flex-wrap items-start gap-6">
          {/* AGE RANGE */}
          <div className="flex flex-col items-start gap-2">
            <FilterButton
              value="Age Range"
              label={currentLang === "zh" ? "年龄" : "Age"}
              toggleFilterCategory={toggleFilterCategory}
              isSelected={selectedFilters.categories.includes("Age Range")}
            />
            {selectedFilters.categories.includes("Age Range") && (
              <div className="flex flex-row gap-2 items-center mt-2">
                {currentLang === "zh" ? "相差范围" : "Within"}
                <input
                  type="number"
                  className="input input-bordered w-16 h-8 text-sm"
                  min={1}
                  max={50}
                  value={selectedFilters.age?.range || 5}
                  onChange={(e) => handleRangeChange("age", e.target.value)}
                />
                {currentLang === "zh" ? "岁" : "years"}
              </div>
            )}
          </div>

          {/* BMI RANGE */}
          <div className="flex flex-col items-start gap-2">
            <FilterButton
              value="BMI Range"
              label={currentLang === "zh" ? "体重指数(BMI)" : "BMI"}
              toggleFilterCategory={toggleFilterCategory}
              isSelected={selectedFilters.categories.includes("BMI Range")}
            />
            {selectedFilters.categories.includes("BMI Range") && (
              <div className="flex flex-row gap-2 items-center mt-2">
                {currentLang === "zh" ? "相差范围" : "Within"}
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
                  value={category}
                  label={currentLang === "zh" ? (category === "Gender" ? "性别" : "种族") : category}
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
                <option value="">{currentLang === "zh" ? "外科医生职称" : "Surgeon Title"}</option>
                <option value="Associate Consultant">{currentLang === "zh" ? "副顾问" : "Associate Consultant"}</option>
                <option value="Consultant">{currentLang === "zh" ? "顾问" : "Consultant"}</option>
                <option value="Senior Consultant">{currentLang === "zh" ? "高级顾问" : "Senior Consultant"}</option>
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
                    <option value="">{currentLang === "zh" ? "外科医生编号" : "Surgeon ID"}</option>
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
            {currentLang === "zh" ? "清除" : "Clear"}
          </button>
          <button
            className="py-2 px-6 bg-accent text-white rounded-md transition-all hover:bg-accent-dark"
            onClick={handleApplyFilters}
          >
            {currentLang === "zh" ? "应用" : "Apply Filters"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterButtonsComponent;