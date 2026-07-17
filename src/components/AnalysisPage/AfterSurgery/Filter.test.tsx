import { fireEvent, render } from "@testing-library/react";
import FilterButtonsComponent from "./Filter";

jest.mock("../../../api/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => new Promise(() => {})),
  },
}));

describe("analysis range filters", () => {
  const renderFilters = () =>
    render(
      <FilterButtonsComponent
        activeTab="after"
        currentLang="en"
        onFilterApply={jest.fn()}
      />,
    );

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
