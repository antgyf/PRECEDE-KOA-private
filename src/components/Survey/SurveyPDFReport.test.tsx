import type { PropsWithChildren, ReactElement } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SurveyPDFReport from "./SurveyPDFReport";
import { createDefaultFilters } from "../../models/patient/defaultFilters";
import api from "../../api/api";

// Inspect report content without starting a browser PDF renderer or loading fonts.
jest.mock("@react-pdf/renderer", () => ({
  Document: ({ children }: PropsWithChildren) => <>{children}</>,
  Page: ({ children }: PropsWithChildren) => <>{children}</>,
  Text: ({ children }: PropsWithChildren) => <span>{children}</span>,
  View: ({ children }: PropsWithChildren) => <div>{children}</div>,
  StyleSheet: { create: (styles: unknown) => styles },
  Font: { register: jest.fn() },
}));
const mockPdfBlob = new Blob(["Generated PDF"], { type: "application/pdf" });
jest.mock("../ReportPage/PDFReport/ReportPdf", () => (
  ({ document, onEmail }: { document: ReactElement; onEmail: (blob: Blob) => void }) => (
    <section data-testid="pdf-preview">
      {document}
      <button onClick={() => onEmail(mockPdfBlob)}>Email My Report</button>
    </section>
  )
));
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

it("emails the generated PDF supplied by the preview", () => {
  jest.mocked(api.post).mockResolvedValue({ status: 200 });
  render(<SurveyPDFReport
    currentLang="en"
    patient={{ ...patient, email: "patient@example.test" }}
    filters={createDefaultFilters()}
    barChartData={[]}
  />);

  fireEvent.click(screen.getByRole("button", { name: "Email My Report" }));

  const [route, body] = jest.mocked(api.post).mock.calls[0] as [string, FormData];
  expect(route).toBe("/patients/send-report");
  expect(body.get("email")).toBe("patient@example.test");
  expect(body.get("file")).toMatchObject({
    name: "Test Patient Summary Report.pdf",
    size: mockPdfBlob.size,
    type: mockPdfBlob.type,
  });
});
