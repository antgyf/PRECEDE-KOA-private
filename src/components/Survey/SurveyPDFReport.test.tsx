import type { PropsWithChildren } from "react";
import { render, screen } from "@testing-library/react";
import SurveyPDFReport from "./SurveyPDFReport";
import { createDefaultFilters } from "../../models/patient/defaultFilters";

// Inspect report content without starting a browser PDF renderer or loading fonts.
jest.mock("@react-pdf/renderer", () => ({
  Document: ({ children }: PropsWithChildren) => <>{children}</>,
  Page: ({ children }: PropsWithChildren) => <>{children}</>,
  Text: ({ children }: PropsWithChildren) => <span>{children}</span>,
  View: ({ children }: PropsWithChildren) => <div>{children}</div>,
  PDFViewer: ({ children }: PropsWithChildren) => <section data-testid="pdf-preview">{children}</section>,
  PDFDownloadLink: () => null,
  StyleSheet: { create: (styles: unknown) => styles },
  Font: { register: jest.fn() },
  pdf: jest.fn(),
}));
jest.mock("../../api/api", () => ({ __esModule: true, default: { post: jest.fn() } }));
jest.mock("../../hooks/AlertContext", () => ({ useAlert: () => ({ showAlert: jest.fn() }) }));
jest.mock("../ReportPage/PDFReport/Table/Table", () => () => null);
jest.mock("../ReportPage/PDFReport/QuestionWithDynamicOptions/BarChart", () => () => null);

const patient = {
  fullName: "Test Patient", age: "65", bmi: "25", height: "1.7", weight: "72", email: "",
  sex: "male", ethnicity: "0",
};

it.each([
  { lang: "en", sex: "male", ethnicity: "0", genderText: "Gender (Male)", ethnicityText: "Ethnicity (Chinese)", name: "Mr. Test Patient" },
  { lang: "zh", sex: "female", ethnicity: "2", genderText: "性别 (女)", ethnicityText: "种族 (印度人)", name: "Test Patient女士" },
])("describes the actual survey demographic filters in $lang", ({ lang, sex, ethnicity, genderText, ethnicityText, name }) => {
  render(<SurveyPDFReport
    currentLang={lang}
    patient={{ ...patient, sex, ethnicity }}
    filters={createDefaultFilters()}
    barChartData={[]}
  />);
  const content = screen.getByTestId("pdf-preview").textContent;
  expect(content).toContain(genderText);
  expect(content).toContain(ethnicityText);
  expect(content).toContain(name);
});

it("omits demographic descriptions when those filters are disabled", () => {
  render(<SurveyPDFReport
    currentLang="en"
    patient={patient}
    filters={{ ...createDefaultFilters(), categories: ["Age Range", "BMI Range"] }}
    barChartData={[]}
  />);
  const content = screen.getByTestId("pdf-preview").textContent;
  expect(content).toContain("Age");
  expect(content).toContain("BMI");
  expect(content).not.toContain("Gender");
  expect(content).not.toContain("Ethnicity");
});
