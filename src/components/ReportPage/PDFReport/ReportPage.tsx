import { useEffect, useState } from "react";
import PDFReport from "./PDFReport";
import FilterButtonsComponent from "../../AnalysisPage/AfterSurgery/Filter";
import {
  AllOptionsType,
  BarChartData,
  FilterType,
  OtherOptions,
  QuestionData,
  Questions,
  QuestionType,
} from "../../../models/patient/patientDetails";
import { getRankDescription } from "../../../utils/helper";
import { useAlert } from "../../../hooks/AlertContext";
import axios from "axios";
import { useForm } from "../../../hooks/FormContext";
import { RadarDataPoint } from "../../../models/patient/patientReport";
import RadarChartCustom from "../RadarChart";
import Alert from "../../UI/Alert";

const ReportPage: React.FC = () => {
  const { form, patient } = useForm();
  const [filters, setFilters] = useState<FilterType>({
    categories: ["Age Range", "BMI Range"],
    age: { range: 5 },
    bmi: { range: 5 },
  });
  const { alert, showAlert } = useAlert();
  const [, setQuestionData] = useState<Record<string, QuestionData>>({});
  const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [radarData, setRadarData] = useState<RadarDataPoint[]>([]);
  const [radarImage, setRadarImage] = useState<string | null>(null);

  if (!form) {
    return (
      <>Something went wrong with retrieving patient data. Please try again.</>
    );
  }

  const getImportance = (question: string): number => {
    if (form.rank1 === question) return 1;
    if (form.rank2 === question) return 2;
    if (form.rank3 === question) return 3;
    if (form.rank4 === question) return 4;
    if (form.rank5 === question) return 5;
    return 6; // default for unranked items, or use `null`, `undefined`, or `0` depending on your logic
  };

  const variables: AllOptionsType[] = [
    form.rank1,
    form.rank2,
    form.rank3,
    form.rank4,
    form.rank5,
  ].filter(Boolean);

  const questionsWithOptions = variables
    .map((variable) => {
      const question = Questions.find((q) => q.name === variable);
      return question
        ? {
            ...question,
            value: form[variable],
          }
        : null;
    })
    .filter(Boolean) as (QuestionType & { value: any })[];

  useEffect(() => {
    if (variables.length === 0) return;

    setIsLoading(true);
    setRadarImage(null);

    const fetchDataForVariable = async (
      item: QuestionType & { value: any }
    ) => {
      try {
        const options = Object.keys(item.list).map(Number);

        showAlert("Loading...", "info");

        const response = await axios.post(
          "https://precede-koa.netlify.app/.netlify/functions/api/patients/after",
          {
            variableName: item.name,
            options: options,
            filters: filters,
            patient: patient,
            initial: form?.[item.name],
            median: true,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        showAlert("Successfully loaded patient", "success");

        setRadarData((prevData) => {
          const existsIndex = prevData.findIndex(
            (d) => d.variableName === response.data.variableName
          );
          if (existsIndex !== -1) {
            // Replace existing item
            const newData = [...prevData];
            newData[existsIndex] = {
              variableName: response.data.variableName,
              initial: form?.[item.name],
              median: response.data.median,
              n: response.data.totalRows ?? 0,
              importance: getImportance(item.name),
            };
            return newData;
          } else {
            // Append new item
            return [
              ...prevData,
              {
                variableName: response.data.variableName,
                initial: form?.[item.name],
                median: response.data.median,
                n: response.data.totalRows ?? 0,
                importance: getImportance(item.name),
              },
            ];
          }
        });

        setQuestionData((prevData) => {
          const updatedData: Partial<Record<AllOptionsType, QuestionData>> = {
            ...prevData,
            [response.data.variableName]: {
              totalRows: response.data.totalRows,
              data: response.data.data,
              variableName: response.data.variableName,
            },
          };

          const presentKeys: AllOptionsType[] = Questions.map(
            (q) => q.name
          ).filter((key) => updatedData[key]) as AllOptionsType[];

          // Sort keys based on importance
          const sortedKeys = [...presentKeys].sort((a, b) => {
            const importanceA = getImportance(a);
            const importanceB = getImportance(b);
            return importanceA - importanceB;
          });

          const updatedBarChartData = sortedKeys.map((key) => {
            const data = updatedData[key]!;

            const title = `Responses of ${
              data.totalRows
            } patient(s) similar to ${patient?.sex ? "Ms." : "Mr."} ${
              patient?.fullname
            }`;

            const labelsAndPercentages = data.data.map((value) => ({
              label: `${OtherOptions[value.option]}`,
              percentage: `${value.percentage}% (${value.count})`,
            }));

            return {
              title,
              options: labelsAndPercentages,
              variableName: data.variableName,
              variableQuestion: Questions.find(
                (q) => q.name === data.variableName
              )?.question,
              initial: form?.[data.variableName as AllOptionsType],
            };
          });

          setBarChartData(updatedBarChartData);
          return updatedData;
        });
      } catch (error) {
        showAlert("Failed to fetch data. Please try again.", "error");
      }
    };

    Promise.all(questionsWithOptions.map(fetchDataForVariable)).finally(() =>
      setIsLoading(false)
    );
  }, [filters]);
  // Handle filter changes from FilterButtonsComponent
  const handleFilterChange = (selectedFilters: FilterType) => {
    setFilters(selectedFilters); // Update filter state
  };

  return (
    <div className="flex flex-col items-start justify-start h-full w-full gap-2">
      {alert.message && <Alert />}
      <div className="flex flex-col w-full justify-start mb-1">
        {/* Description on how to use */}
        <article className="prose mb-1 max-w-none">
          <h3>
            Self-reported Functions of Similar Patients 6 Months after Surgery
          </h3>
          <ul>
            <li>{getRankDescription()}</li>
            <li>
              Use the filters below to redefine similar patients based on their
              characteristics before surgery
            </li>
          </ul>
        </article>
        {/* Filter component */}
        <FilterButtonsComponent onFilterApply={handleFilterChange} />
      </div>

      {/* Generate radar image only when data is ready */}
      {!radarImage && !isLoading && (
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <RadarChartCustom
            radarData={radarData}
            onImageGenerated={setRadarImage}
          />
        </div>
      )}
      {radarImage && (
        <PDFReport
          filters={filters}
          radarImage={radarImage}
          barChartData={barChartData}
        />
      )}
    </div>
  );
};

export default ReportPage;
