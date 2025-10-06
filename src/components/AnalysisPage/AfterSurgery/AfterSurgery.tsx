import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { useForm } from "../../../hooks/FormContext";
import {
  AllOptionsType,
  FilterType,
  Questions,
  QuestionType,
} from "../../../models/patient/patientDetails";
import PatientDetail from "../../FormPage/PatientDetail";
import FilterButtonsComponent from "./Filter";
import SelectVariable from "../SelectVariable";
import { endColor, generateGradientColors, startColor } from "../../../models/UI/Color";
import { useAlert } from "../../../hooks/AlertContext";
import Alert from "../../UI/Alert";
import { GraphData } from "../../../models/patient/patientReport";
import {
  getFilterDescription,
  getName,
  getRankDescription,
} from "../../../utils/helper";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface AfterData {
  totalRows: number;
  data: {
    option: number;
    count: number;
    percentage: number;
  }[];
}

interface Description {
  description: string; // The text of the description
  color: string; // The corresponding color for the description
}

const AfterSurgery: React.FC = () => {
  const { form, patient } = useForm();
  const { alert, showAlert } = useAlert();

  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [gradientColors, setGradientScheme] = useState<string[]>([]);
  const [afterData, setAfterData] = useState<AfterData | null>(null);
  const [, setDescriptionList] = useState<Description[]>([]);
  const [_, setGraphData] = useState<GraphData>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [filters, setFilters] = useState<FilterType>({
    categories: [],
    age: { range: 5 },
    bmi: { range: 5 },
  });

  const termToMonths = (term: number) => {
    switch (term) {
      case 1: return 6;
      case 2: return 12;
      case 3: return 24;
      default: return term; // fallback
    }
  };

  // Fetch data whenever filters or variable change
  useEffect(() => {
    if (!question) return;

    const fetchData = async () => {
      setIsLoading(true);
      showAlert("Fetching data...", "info");
      try {
        const options = Object.entries(question?.list).map(([key]) =>
          parseInt(key, 10)
        );

        const scrollY = window.scrollY; // Save current scroll position

        console.log("Fetching data with:", {
          questionid: question.id,
          options: options,
          filters: filters,
          patient: patient,
          term: selectedTerm,
          initial: form?.responses.find(
            (r) => r.questionid === question.id
          )?.answervalue,
        });

        const response = await api.post(
          "/patients/after",
          {
            questionid: question.id,
            options: options,
            filters: filters,
            patient: patient,
            term: selectedTerm,
            initial: form?.responses.find(
              (r) => r.questionid === question.id
            )?.answervalue,
          }
        );
        showAlert("Successfuly fetched patient data", "success");

        const newAfterData = {
          totalRows: +response.data.totalRows,
          data: response.data.data,
        };

        setAfterData(newAfterData);

        setTimeout(() => {
          window.scrollTo(0, scrollY); // Restore scroll position
        }, 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        showAlert("Failed to fetch data. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [question, filters, selectedTerm]);

  // Process data after `afterData` is updated
  useEffect(() => {
    if (!afterData || !question) return;

    const processGraphData = (): GraphData => {
      if (!afterData || !afterData.data || !question || !question.list) {
        showAlert(
          "Something went wrong with retrieving the data. Please try again.",
          "error"
        );
        return [];
      }

      const gradient = generateGradientColors(afterData.data.length, startColor, endColor);
      setGradientScheme(gradient);

      return [
        [
          "Option",
          "Count",
          { role: "style" },
          {
            role: "annotation",
            type: "string",
          },
        ],
        ...afterData.data.map((item): [string, number, string, string] => [
          `${question.list[item.option]} `,
          +item.count,
          gradientColors[item.option % gradientColors.length],
          `${String(item.percentage)}%(${item.count})`,
        ]),
      ];
    };

    const processDescriptionList = () => {
      if (!question?.list || !afterData?.data) {
        return [];
      }

      return afterData.data.map((item, index) => ({
        description: `${question.list[item.option]}`,
        color: gradientColors[index % gradientColors.length],
      }));
    };

    setGraphData(processGraphData());
    setDescriptionList(processDescriptionList());
  }, [afterData, question]);

  // Handle filter changes from FilterButtonsComponent
  const handleFilterChange = (selectedFilters: FilterType) => {
    setFilters(selectedFilters);
  };

  if (!form || !patient) {
    return <div>No patient form found.</div>;
  }
  const renderHumanIcons = () => {
    if (!afterData || !afterData.data || !question) return null;

    return afterData.data.map((item: any, index: number) => (
      <div key={index} className="flex items-start mb-4 w-full">
        {/* Fixed Left Space for "Currently Here" Box */}
        <div className="w-1/5 min-w-[150px] flex justify-start items-center">
          {index == Number(form.responses.find((r) => r.questionid === question.id)?.answervalue) ? (
            <div className="flex items-center">
              <div className="bg-white rounded-md px-3 py-2 shadow-md">
                {getName()} is currently here
              </div>
              <div className="text-4xl ml-2">👉</div>
            </div>
          ) : (
            <div className="w-1/5 min-w-[150px]"></div>
          )}
        </div>

        {/* Human Icons and Label */}
        <div className="flex flex-col w-4/5">
          <div className="flex flex-row items-center mb-2">
            <div
              className="text-lg font-semibold mr-2 "
              style={{
                color: gradientColors[index % gradientColors.length],
              }}
            >
              {question.list[item.option]}
            </div>
            <div>
              {String(item.percentage)}% ({item.count})
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {Array.from({ length: item.count }).map((_, i) => (
              <div key={i} className="flex items-center">
                <FontAwesomeIcon
                  key={i}
                  icon={faUser}
                  className="text-xl mx-1"
                  style={{
                    color: gradientColors[index % gradientColors.length],
                    // filter:
                    //   "drop-shadow(0 0 .5px black) drop-shadow(0 0 .5px black)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full h-full rounded-md ">
      <div className="flex flex-col">
        {alert.message && <Alert />}
        {/* Information Section */}
        <article className="prose mb-5 max-w-none">
          <h3>Self-reported Functions of Similar Patients after Surgery</h3>
          <ul>
            <li>{getRankDescription()}</li>
            <li>
              Select an area you wish to know how similar patients functioned
              after surgery
              <SelectVariable
                value={question?.code || ""}
                onChange={(e) => {
                  const selectedCode = e.target.value;
                  const foundQuestion = Questions.find(q => q.code === selectedCode);
                  if (foundQuestion) setQuestion(foundQuestion);
                }}
          />
            </li>
            <li>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="whitespace-nowrap">
                  Select the post-surgery time point:
                </span>

                <form className="flex flex-wrap ml-2 gap-3 mt-2 items-center">
                  {/* Time Selection Buttons - Hide Others When One is Selected */}
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: 1, label: "6" },
                      { value: 2, label: "12" },
                      { value: 3, label: "24" },
                    ].map(({ value, label }) => (
                      <label key={value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="timePeriod"
                          value={value}
                          className="hidden peer"
                          onChange={() => setSelectedTerm(value)}
                          checked={selectedTerm === value}
                        />
                        <span className="btn bg-white peer-checked:bg-primary peer-checked:text-white">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Text remains in a single line */}
                  <span className="whitespace-nowrap">months</span>
                </form>
              </div>
            </li>

            <li>
              Use the filters below to redefine similar patients based on their
              characteristics before surgery
            </li>
          </ul>
        </article>
        {/* Filter Buttons */}
        <FilterButtonsComponent
          key={question ? question.id : "no-question"}
          onFilterApply={handleFilterChange}
        />

        <PatientDetail />
      </div>

      {/* Loading, Error, or Graph Section */}
      {isLoading ? (
        <div>Loading data...</div>
      ) : (
        question && (
          <div className="bg-secondary p-4 shadow-md">
            {/* Responsive Container for Text and Chart */}
            <div className="flex flex-wrap lg:flex-nowrap gap-4 ">
              <div className="w-full">
                <article className="prose max-w-none">
                  <p>
                    Below are what past patients reported{" "}
                    <strong style={{ color: "#1976D2" }}>{termToMonths(selectedTerm)}</strong>{" "}
                    months after surgery. Those patients are similar to{" "}
                    {getName()}
                    {getFilterDescription(filters, patient)}, and they
                    experienced the same level of problem as {getName()} before
                    surgery.
                  </p>
                  <h3>{question.question}</h3>
                  <h4>
                    Responses of {afterData?.totalRows} patients similar to{" "}
                    {getName()} {termToMonths(selectedTerm)} months after surgery
                  </h4>
                </article>

                <div className="w-full flex flex-row items-start mt-5">
                  <div>{renderHumanIcons()}</div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AfterSurgery;
