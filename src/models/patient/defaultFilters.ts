import type { FilterType } from "./patientDetails";

export const createDefaultFilters = (): FilterType => ({
  categories: ["Age Range", "BMI Range", "Gender", "Ethnicity"],
  age: { range: 5 },
  bmi: { range: 2 },
  surgeonid: "",
  surgeontitle: "",
});
