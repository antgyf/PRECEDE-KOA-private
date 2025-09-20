import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AllOptionsType,
  FilterType,
  Questions,
  QuestionType,
} from "../../../models/patient/patientDetails";
import PatientDetail from "../../FormPage/PatientDetail";
import SelectVariable from "../SelectVariable";
import { colorScheme } from "../../../models/UI/Color";
import { useForm } from "../../../hooks/FormContext";
import { useAlert } from "../../../hooks/AlertContext";
import Alert from "../../UI/Alert";
import { GraphData } from "../../../models/patient/patientReport";
import FilterButtonsComponent from "../AfterSurgery/Filter";
import {
  getFilterDescription,
  getName,
  getRankDescription,
} from "../../../utils/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface BeforeData {
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

const BeforeSurgery: React.FC = () => {
  const { form, patient } = useForm();
  const { alert, showAlert } = useAlert();

  const [variable, setVariable] = useState<AllOptionsType>();
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [, setDescriptionList] = useState<Description[]>([]);
  const [beforeData, setBeforeData] = useState<BeforeData | null>(null);
  const [, setGraphData] = useState<GraphData>([]);
  const [filters, setFilters] = useState<FilterType>({
    categories: ["Age Range", "BMI Range"],
    age: { range: 5 },
    bmi: { range: 5 },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (selectedFilters: FilterType) => {
    setFilters(selectedFilters);
  };

  // Set selected question based on selected variable chosen
  useEffect(() => {
    if (variable) {
      const foundQuestion = Questions.find((q) => q.name === variable);
      if (foundQuestion) {
        setQuestion(foundQuestion);
      }
    } else {
      setQuestion(null);
    }
  }, [variable]);

  // Fetch before surgery data when filters or variable change
  useEffect(() => {
    if (!variable || !question) return;

    const fetchData = async () => {
      setIsLoading(true);
      showAlert("Fetching data...", "info");

      try {
        const options = Object.entries(question.list);

        const scrollY = window.scrollY; // Save scroll position
        const response = await axios.post(
          "https://precede-koa.netlify.app/.netlify/functions/api/patients/before",
          {
            variableName: variable,
            filters: filters,
            options: options.map(([key]) => +key),
            patient: patient,
          }
        );

        showAlert("Successfully fetched patient data", "success");

        setBeforeData({
          totalRows: +response.data.totalRows,
          data: response.data.data,
        });

        requestAnimationFrame(() => {
          document.documentElement.style.scrollBehavior = "auto"; // Prevent conflict
          window.scrollTo({ top: scrollY, behavior: "instant" });
          document.documentElement.style.scrollBehavior = "smooth"; // Restore smooth scrolling
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        showAlert("Failed to load data. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [question, filters]);

  // Process data for chart and descriptions
  useEffect(() => {
    if (!question || !beforeData) return;

    const processGraphData = (): GraphData => {
      if (!beforeData || !beforeData.data || !question?.list) {
        showAlert("Error retrieving data. Please try again.", "error");
        return [];
      }

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
        ...beforeData.data.map((item): [string, number, string, string] => [
          `${question.list[item.option]} \n (${item.count})`,
          +item.count,
          colorScheme[item.option % colorScheme.length],
          `${String(item.percentage)}%`,
        ]),
      ];
    };

    const processDescriptionList = (): Description[] => {
      if (!question?.list || !beforeData?.data) {
        return [];
      }

      return beforeData.data.map((item, index) => ({
        description: `${question.list[item.option]}`,
        color: colorScheme[index % colorScheme.length],
      }));
    };

    setGraphData(processGraphData());
    setDescriptionList(processDescriptionList());
  }, [beforeData, question]);

  if (!form || !patient) {
    return <div>No patient form found.</div>;
  }
  const renderHumanIcons = () => {
    if (!beforeData || !beforeData.data || !question) return null;

    return beforeData.data.map((item: any, index: number) => (
      <div key={index} className="flex items-start mb-4 w-full">
        {/* Fixed Left Space for "Currently Here" Box */}
        <div className="w-1/5 min-w-[150px] flex justify-start items-center">
          {index == Number(form[question?.name as AllOptionsType]) ? (
            <div className="flex items-center">
              <div className="bg-white rounded-md px-3 py-2 shadow-md">
                {getName()} is currently here
              </div>
              <div className="text-4xl ml-2">👉</div>
            </div>
          ) : (
            <div className="w-1/5 min-w-[120px]"></div>
          )}
        </div>

        {/* Human Icons and Label */}
        <div className="flex flex-col w-4/5">
          <div className="flex flex-row items-center mb-2">
            <div
              className="text-lg font-semibold mr-2 "
              style={{
                color: colorScheme[index % colorScheme.length],
              }}
            >
              {question.list[item.option]}
            </div>
            <div className="font-semibold">
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
                    color: colorScheme[index % colorScheme.length],
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
    <div className="w-full rounded-lg">
      {alert.message && <Alert />}

      {/* Information Section */}
      <article className="prose mb-5 max-w-none">
        <h3>Comparison with Similar Patients before Surgery</h3>
        <ul>
          <li>{getRankDescription()}</li>
          <li>
            Select an area to compare the levels of problems between{" "}
            <strong style={{ color: "#1976D2" }}>
              {" "}
              {/* Blue text */}
              {patient?.sex ? "Ms." : "Mr."} {patient?.fullname}
            </strong>{" "}
            and similar patients before surgery
          </li>
          {/* Variable Selection */}
          <SelectVariable
            value={variable || ""}
            onChange={(e) => setVariable(e.target.value as AllOptionsType)}
          />

          <li>
            Use the filters below to redefine similar patients based on their
            characteristics before surgery
          </li>
        </ul>
      </article>

      <FilterButtonsComponent
        key={variable}
        onFilterApply={handleFilterChange}
      />

      <PatientDetail />

      {/* Loading/Error State */}
      {isLoading && <div>Loading data...</div>}

      {/* Description Section */}
      {question && !isLoading && (
        <div className="bg-secondary p-4 shadow-md">
          {/* Responsive Container for Text and Chart */}
          <div className="flex flex-wrap lg:flex-nowrap gap-4 ">
            <div className="w-full">
              <article className="prose max-w-none">
                <p>
                  Below are what past patients reported before surgery. Those
                  patients are similar to {getName()}
                  {getFilterDescription(filters, patient)}.
                </p>
                <h3>{question.question}</h3>
                <h4>
                  Responses of {beforeData?.totalRows} patients similar to{" "}
                  {getName()}
                </h4>
              </article>

              <div className="w-full flex flex-row items-start mt-5">
                <div>{renderHumanIcons()}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeforeSurgery;
