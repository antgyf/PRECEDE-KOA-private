import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import api from "../../api/api";
import BeforeSurgery from "./BeforeSurgery/BeforeSurgery";
import AfterSurgery from "./AfterSurgery/AfterSurgery";
import ReportPage from "../ReportPage/PDFReport/ReportPage";
import SurveyReportPage from "../Survey/SurveyReportPage";
import SurveyPDFReport from "../Survey/SurveyPDFReport";

jest.mock("../../api/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));
jest.mock("../../hooks/AlertContext", () => ({
  useAlert: () => ({ alert: { message: "" }, showAlert: jest.fn() }),
}));
jest.mock("../../hooks/FormContext", () => ({
  useForm: () => ({
    patient: { fullname: "Test Patient", age: 65, bmi: 25, sex: 0, ethnicity: 0 },
    form: { term: 0, priorities: [1], responses: [{ questionid: 1, answervalue: 0 }] },
  }),
}));
jest.mock("../FormPage/PatientDetail", () => () => null);
jest.mock("../ReportPage/PDFReport/PDFReport", () => () => null);
jest.mock("../ReportPage/RadarChart", () => () => null);
jest.mock("../Survey/SurveyPDFReport", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

const expectedFilters = {
  categories: ["Age Range", "BMI Range", "Gender", "Ethnicity"],
  age: { range: 5 },
  bmi: { range: 2 },
  surgeonid: "",
  surgeontitle: "",
};

beforeEach(() => {
  jest.clearAllMocks();
  window.scrollTo = jest.fn();
  jest.mocked(api.get).mockResolvedValue({ data: [] });
  jest.mocked(api.post).mockResolvedValue({
    data: { questionid: 1, totalRows: 0, data: [], median: 0 },
  });
});

it.each([
  { Page: BeforeSurgery, tab: "before" as const },
  { Page: AfterSurgery, tab: "after" as const },
])("uses the defaults and preserves applied filters when switching $tab questions", async ({ Page, tab }) => {
  render(<Page activeTab={tab} currentLang="en" />);
  const questionSelect = screen.getByRole("option", { name: "Select a functional area" }).parentElement!;
  fireEvent.change(questionSelect, { target: { value: "KFS" } });

  await waitFor(() => expect(api.post).toHaveBeenCalledWith(
    `/patients/${tab}`,
    expect.objectContaining({ filters: expectedFilters, patient: expect.objectContaining({ sex: 0, ethnicity: 0 }) }),
  ));

  fireEvent.click(screen.getByRole("button", { name: "Gender" }));
  fireEvent.click(screen.getByRole("button", { name: "Ethnicity" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply Filters" }));
  await waitFor(() => expect(api.post).toHaveBeenLastCalledWith(
    `/patients/${tab}`,
    expect.objectContaining({ filters: { ...expectedFilters, categories: ["Age Range", "BMI Range"] } }),
  ));

  fireEvent.change(questionSelect, { target: { value: "KFW" } });
  await waitFor(() => expect(api.post).toHaveBeenLastCalledWith(
    `/patients/${tab}`,
    expect.objectContaining({ questionid: 2, filters: { ...expectedFilters, categories: ["Age Range", "BMI Range"] } }),
  ));
  for (const name of ["Gender", "Ethnicity"]) {
    expect(screen.getByRole("button", { name }).getAttribute("aria-pressed")).toBe("false");
  }
});

it("uses all four filters for the initial main report request", async () => {
  render(<ReportPage activeTab="summary" currentLang="en" />);
  await waitFor(() => expect(api.post).toHaveBeenCalledWith(
    "/patients/after",
    expect.objectContaining({ assessmentTerm: 0, filters: expectedFilters, patient: expect.objectContaining({ sex: 0, ethnicity: 0 }) }),
    expect.any(Object),
  ));
});

it.each([
  { sex: "male", code: 0, ethnicity: "0" },
  { sex: "female", code: 1, ethnicity: "2" },
])("normalizes $sex survey demographics and keeps an empty cohort report renderable", async ({ sex, code, ethnicity }) => {
  jest.mocked(api.post).mockResolvedValue({
    data: { message: "No baseline patients found for the given filters." },
  });
  render(<SurveyReportPage
    currentLang="en"
    patient={{ fullName: "Test Patient", age: "65", bmi: "25", height: "1.7", weight: "72", email: "", sex, ethnicity }}
    form={{ KFS: "0" }}
    priorities={["KFS"]}
  />);

  await waitFor(() => expect(api.post).toHaveBeenCalledWith(
    "/patients/survey/after",
    expect.objectContaining({
      filters: expectedFilters,
      patient: expect.objectContaining({ sex: code, ethnicity: Number(ethnicity) }),
    }),
    expect.any(Object),
  ));
  await waitFor(() => expect(SurveyPDFReport).toHaveBeenLastCalledWith(
    expect.objectContaining({
      filters: expectedFilters,
      barChartData: [expect.objectContaining({
        options: [expect.objectContaining({ label: "No data available", percent: 0 })],
      })],
    }),
    expect.anything(),
  ));
});
