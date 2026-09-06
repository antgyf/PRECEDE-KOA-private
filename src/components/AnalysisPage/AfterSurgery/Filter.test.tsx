import { fireEvent, render } from "@testing-library/react";
import FilterButtonsComponent from "./Filter";

jest.mock("../../../api/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => new Promise(() => {})),
  },
}));

describe("analysis filters", () => {
  const renderFilters = (onFilterApply = jest.fn()) =>
    render(
      <FilterButtonsComponent
        activeTab="after"
        currentLang="en"
        onFilterApply={onFilterApply}
      />,
    );

  it("selects and applies all four demographic defaults", () => {
    const onFilterApply = jest.fn();
    const { getByRole } = renderFilters(onFilterApply);

    for (const name of ["Age", "BMI", "Gender", "Ethnicity"]) {
      expect(getByRole("button", { name }).getAttribute("aria-pressed")).toBe("true");
    }
    expect(onFilterApply).not.toHaveBeenCalled();
    fireEvent.click(getByRole("button", { name: "Apply Filters" }));
    expect(onFilterApply).toHaveBeenCalledWith({
      categories: ["Age Range", "BMI Range", "Gender", "Ethnicity"],
      age: { range: 5 },
      bmi: { range: 2 },
      surgeonid: "",
      surgeontitle: "",
    });
  });

  it("allows gender and ethnicity to be removed, then restores defaults on Reset and Apply", () => {
    const onFilterApply = jest.fn();
    const { getByRole, getAllByRole } = renderFilters(onFilterApply);

    fireEvent.click(getByRole("button", { name: "Gender" }));
    fireEvent.click(getByRole("button", { name: "Ethnicity" }));
    fireEvent.change(getAllByRole("spinbutton")[0], { target: { value: "9" } });
    fireEvent.change(getAllByRole("spinbutton")[1], { target: { value: "4" } });
    fireEvent.change(getByRole("combobox"), { target: { value: "Consultant" } });
    fireEvent.click(getByRole("button", { name: "Apply Filters" }));
    expect(onFilterApply).toHaveBeenLastCalledWith(expect.objectContaining({
      categories: ["Age Range", "BMI Range"],
      age: { range: 9 },
      bmi: { range: 4 },
      surgeontitle: "Consultant",
    }));

    onFilterApply.mockClear();
    fireEvent.click(getByRole("button", { name: "Reset" }));
    expect(onFilterApply).not.toHaveBeenCalled();
    expect((getByRole("combobox") as HTMLSelectElement).value).toBe("");
    fireEvent.click(getByRole("button", { name: "Apply Filters" }));
    expect(onFilterApply).toHaveBeenCalledWith({
      categories: ["Age Range", "BMI Range", "Gender", "Ethnicity"],
      age: { range: 5 },
      bmi: { range: 2 },
      surgeonid: "",
      surgeontitle: "",
    });
  });

  it("allows the default Age and BMI values to be deleted and replaced", () => {
    const { container } = renderFilters();
    const inputs = container.querySelectorAll<HTMLInputElement>('input[type="number"]');
    const [ageInput, bmiInput] = Array.from(inputs);

    expect(inputs).toHaveLength(2);
    expect(ageInput.value).toBe("5");
    expect(bmiInput.value).toBe("2");

    fireEvent.change(ageInput, { target: { value: "" } });
    expect(ageInput.value).toBe("");
    fireEvent.change(ageInput, { target: { value: "8" } });
    expect(ageInput.value).toBe("8");

    fireEvent.change(bmiInput, { target: { value: "" } });
    expect(bmiInput.value).toBe("");
    fireEvent.change(bmiInput, { target: { value: "3" } });
    expect(bmiInput.value).toBe("3");
  });

  it("restores the defaults when an empty field loses focus", () => {
    const { container } = renderFilters();
    const inputs = container.querySelectorAll<HTMLInputElement>('input[type="number"]');
    const [ageInput, bmiInput] = Array.from(inputs);

    fireEvent.change(ageInput, { target: { value: "" } });
    fireEvent.blur(ageInput);
    expect(ageInput.value).toBe("5");

    fireEvent.change(bmiInput, { target: { value: "" } });
    fireEvent.blur(bmiInput);
    expect(bmiInput.value).toBe("2");
  });
});
