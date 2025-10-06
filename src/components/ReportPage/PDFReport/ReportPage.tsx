import { useEffect, useState } from "react";
import PDFReport from "./PDFReport";
import FilterButtonsComponent from "../../AnalysisPage/AfterSurgery/Filter";
import {
  BarChartData,
  FilterType,
  OtherOptions,
  QuestionData,
  Questions,
  QuestionType,
} from "../../../models/patient/patientDetails";
import { getRankDescription } from "../../../utils/helper";
import { useAlert } from "../../../hooks/AlertContext";
import api from "../../../api/api";
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
  const [, setQuestionData] = useState<Record<number, QuestionData>>({});
  const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [radarData, setRadarData] = useState<RadarDataPoint[]>([]);
  const [radarImage, setRadarImage] = useState<string | null>(null);

  if (!form) {
    return (
      <>Something went wrong with retrieving patient data. Please try again.</>
    );
  }

  if (!form.priorities || form.priorities.length === 0) {
    return <>No priorities selected. Please go back to the previous page.</>;
  }

  const variables: number[] = form.priorities;

  const getPriorityScore = (question: number): number => {
    return question;
  };

  const questionsWithOptions = (form.priorities || [])
    .map((qid) => {
      const question = Questions.find((q) => q.id === qid);
      const response = form.responses.find((r) => r.questionid === qid);

      return question
        ? {
            ...question,
            value: response?.answervalue ?? null,
          }
        : null;
    })
    .filter(Boolean) as (QuestionType & { value: any })[];


  useEffect(() => {
    if (variables.length === 0) return;
    //console.log("Fetching data for variables:", variables);
    setIsLoading(true);
    setRadarImage(null);
    
    // Reset state to prevent accumulation when navigating back
    setRadarData([]);
    setQuestionData({});
    setBarChartData([]);

    const fetchDataForVariable = async (
      item: QuestionType & { value: any }
    ) => {
      try {
        const options = Object.keys(item.list).map(Number);

        //console.log("Fetching data for question:", item.id, item.question);

        showAlert("Loading...", "info");

        const response = await api.post(
          "/patients/after",
          {
            questionid: item.id,
            options: options,
            filters: filters,
            patient: patient,
            initial: form?.responses.find((r) => r.questionid === item.id)
              ?.answervalue,
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
          // Find the corresponding response value from form.responses
          const responseValue = form.responses.find(
            (r) => r.questionid === item.id
          )?.answervalue ?? -1;

          const importance = getPriorityScore(item.id);
          
          const newEntry = {
            questionid: response.data.questionid, // should now be the question ID
            initial: responseValue,
            median: response.data.median,
            n: response.data.totalRows ?? 0,
            importance,
          };

          // Always replace existing entry or add new one (no accumulation)
          const filteredData = prevData.filter(d => d.questionid !== response.data.questionid);
          return [...filteredData, newEntry];
        });


        setQuestionData((prevData) => {
          const updatedData: Record<number, QuestionData> = {
            ...prevData,
            [response.data.questionid]: {
              totalRows: response.data.totalRows,
              data: [...response.data.data], // Create new array to avoid reference issues
              questionid: response.data.questionid,
            },
          };

          // Sort keys based on importance
          const sortedKeys = variables.filter((id) => updatedData[id]);

          //console.log("Sorted Question IDs:", sortedKeys);

          const updatedBarChartData: BarChartData[] = sortedKeys.map((key) => {
            const data = updatedData[key]!;

            const title = `Responses of ${data.totalRows} patient(s) similar to ${
              patient?.sex ? "Ms." : "Mr."
            } ${patient?.fullname}`;

            // Clone data array for manipulation (deep copy to prevent mutations)
            let chartData = data.data.map(item => ({ ...item }));

            //console.log("Processing Question ID:", data.questionid);
            //console.log("Original Chart Data:", chartData);

            // ✅ Merge and shift for Question 2
            if (data.questionid === 2) {
              const opt2 = chartData.find((v) => Number(v.option) === 2);
              const opt3 = chartData.find((v) => Number(v.option) === 3);

              if (opt2 && opt3) {
                // Merge option 3 into option 2
                opt2.count = `${Number(opt2.count) + Number(opt3.count)}`;
                chartData = chartData.filter((v) => Number(v.option) !== 3);

                // Shift all options > 3 down by 1
                chartData = chartData.map((v) => {
                  const optNum = Number(v.option);
                  if (optNum > 3) {
                    return { ...v, option: (optNum - 1).toString() as "0" | "1" | "2" | "3" | "4" };
                  }
                  return v;
                });
              }
            }

        // ✅ Merge and shift for Question 3
        if (data.questionid === 3) {
          const mergeOptions = (a: number, b: number) => {
            const optA = chartData.find((v) => Number(v.option) === a);
            const optB = chartData.find((v) => Number(v.option) === b);
            if (optA && optB) {
              optA.count = `${Number(optA.count) + Number(optB.count)}`;
              chartData = chartData.filter((v) => Number(v.option) !== b);
            }
          };

          // Perform the merges
          mergeOptions(2, 3);
          mergeOptions(4, 5);

          // Shift down all options above removed ones
          const removed = [3, 5];
          chartData = chartData.map((v) => {
            const optNum = Number(v.option);
            const shift = removed.filter((r) => optNum > r).length;
            return { ...v, option: (optNum - shift).toString() as "0" | "1" | "2" | "3" | "4"  };
          });
        }

        //console.log("Chart Data after Merging and Shifting:", chartData);

        // ✅ Calculate percentage labels
        const labelsAndPercentages = chartData.map((v) => {
          const total = Number(data.totalRows);
          const count = Number(v.count);
          const percentage =
            total > 0 ? ((count / total) * 100).toFixed(0) : "0";
          
          return {
            label: `${OtherOptions[v.option]}`,
            percentage: `${percentage}% (${count})`,
          };
        });

        //console.log("Processed Chart Data:", chartData);
        //console.log("Labels and Percentages:", labelsAndPercentages);

        return {
          title,
          options: labelsAndPercentages,
          questionid: data.questionid,
          variableQuestion: Questions.find((q) => q.id === data.questionid)?.question,
          initial: form?.responses.find((r) => r.questionid === key)?.answervalue ?? -1,
        };
      });

      setBarChartData(updatedBarChartData);
      return updatedData;
    });


      } catch (error) {
        showAlert("Failed to fetch data. Please try again.", "error");
      }
    };

    Promise.all(questionsWithOptions.map(fetchDataForVariable))
    .finally(() => setIsLoading(false));
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
