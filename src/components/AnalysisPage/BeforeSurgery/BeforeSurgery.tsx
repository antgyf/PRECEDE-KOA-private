import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import {
  FilterType,
  Questions,
  QuestionType,
} from "../../../models/patient/patientDetails";
import PatientDetail from "../../FormPage/PatientDetail";
import SelectVariable from "../SelectVariable";
import { endColor, generateGradientColors, startColor } from "../../../models/UI/Color";
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

interface BeforeSurgeryProps {
  activeTab: "summary" | "before" | "after";
  currentLang: string;
}

const BeforeSurgery: React.FC<BeforeSurgeryProps> = ({ activeTab, currentLang }) => {
  const { form, patient } = useForm();
  const { alert, showAlert } = useAlert();

  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [gradientColors, setGradientScheme] = useState<string[]>([]);
  const [beforeData, setBeforeData] = useState<BeforeData | null>(null);
  const [, setDescriptionList] = useState<Description[]>([]);
  const [, setGraphData] = useState<GraphData>([]);
  const [filters, setFilters] = useState<FilterType>({
    categories: ["Age Range", "BMI Range"],
    age: { range: 5 },
    bmi: { range: 5 },
    surgeonid: "",
    surgeontitle: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (selectedFilters: FilterType) => {
    setFilters(selectedFilters);
  };

  // Fetch before surgery data when filters or variable change
  useEffect(() => {
    if (!question) return;

    const fetchData = async () => {
      setIsLoading(true);
      currentLang === "en" ? showAlert("Fetching data...", "info") : currentLang === "zh" ?
      showAlert("正在获取数据...", "info") : showAlert("Fetching data...", "info");

      try {
        const options = Object.entries(question.list);

        if (filters.surgeonid && !filters.categories.includes("Surgeon ID")) {
          filters.categories = [...filters.categories, "Surgeon ID"];
        }

        if (filters.surgeontitle && !filters.categories.includes("Surgeon Title")) {
          filters.categories = [...filters.categories, "Surgeon Title"];
        }

        const scrollY = window.scrollY; // Save scroll position
        const response = await api.post(
          "/patients/before",
          {
            questionid: question.id,
            filters: filters,
            options: options.map(([key]) => +key), // Convert keys from answer options to numbers
            patient: patient,
          }
        );

        currentLang === "en" ? showAlert("Successfully fetched patient data", "success") : currentLang === "zh" ?
        showAlert("成功获取患者数据", "success") : showAlert("Successfully fetched patient data", "success");

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
        currentLang === "en" ? showAlert("Failed to load data. Please try again.", "error") : currentLang === "zh" ?
        showAlert("加载数据失败。请再试一次。", "error") : showAlert("Failed to load data. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [question, filters, currentLang]);

  // Process data for chart and descriptions
  useEffect(() => {
    if (!question || !beforeData) return;

    const processGraphData = (): GraphData => {
      if (!beforeData || !beforeData.data || !question?.list) {
        showAlert("Error retrieving data. Please try again.", "error");
        return [];
      }

      const gradient = generateGradientColors(beforeData.data.length, startColor, endColor);
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
        ...beforeData.data.map((item): [string, number, string, string] => [
          `${currentLang === "en" ? question.list[item.option] : currentLang === "zh" ? question.chList[item.option] : question.list[item.option]} \n (${item.count})`,
          +item.count,
          gradientColors[item.option % gradientColors.length],
          `${String(item.percentage)}%`,
        ]),
      ];
    };

    const processDescriptionList = (): Description[] => {
      if (!question?.list || !beforeData?.data) {
        return [];
      }

      return beforeData.data.map((item, index) => ({
        description: currentLang === "en" ? `${question.list[item.option]}` : currentLang === "zh" ? `${question.chList[item.option]}` : `${question.list[item.option]}`,
        color: gradientColors[index % gradientColors.length],
      }));
    };

    setGraphData(processGraphData());
    setDescriptionList(processDescriptionList());
  }, [beforeData, question, currentLang]);

  if (!form || !patient) {
    return <div>No patient form found.</div>;
  }

const renderHumanIcons = () => {
  if (!beforeData || !beforeData.data || !question) return null;

  // Get the patient's selected answer value for this question
  const patientAnswerValue = form.responses.find(
    (r) => r.questionid === question.id
  )?.answervalue;

  /*
  beforeData.data.forEach((item, index) => {
    console.log(`Item ${index} - option:`, item.option, typeof item.option, 'matches:', item.option == patientAnswerValue);
  });
  */

  return beforeData.data.map((item: any, index: number) => {
    // Check if this item's option matches the patient's answer
    const isPatientHere = item.option == patientAnswerValue;

    return (
      <div key={index} className="flex items-start mb-4 w-full">
        {/* Fixed Left Space for "Currently Here" Box */}
        <div className="w-1/5 min-w-[150px] flex justify-start items-center">
          {isPatientHere ? (
            <div className="flex items-center">
              <div className="bg-white rounded-md px-3 py-2 shadow-md">
                {getName()} {currentLang === "en" ? "is currently here" : currentLang === "zh" ? "当前在这里" : "is currently here"}
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
                color: gradientColors[index % gradientColors.length],
              }}
            >
              {currentLang === "en" ? question.list[item.option] : currentLang === "zh" ? question.chList[item.option] : question.list[item.option]}
            </div>
            <div className="font-semibold">
              {item.count} ({String(item.percentage)}%)
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
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  });
};


  return (
    <div className="w-full rounded-lg">
      {alert.message && <Alert />}

      {/* Information Section */}
      <article className="prose mb-5 max-w-none">
        <h3>{currentLang === "en" ? "Comparison with Similar Patients before Surgery" : currentLang === "zh" ? "与类似患者手术前的比较" : "Comparison with Similar Patients before Surgery"}</h3>
        <ul>
          <li>{getRankDescription(currentLang)}</li>
          <li>
           {currentLang === "en" ? "Select an area to compare the levels of problems between" : currentLang === "zh" ? "选择一个区域比较" : "Select an area to compare the levels of problems between"}{" "}
            <strong style={{ color: "#1976D2" }}>
              {" "}
              {/* Blue text */}
              {patient?.sex ? (currentLang === "en" ? "Ms." : currentLang === "zh" ? "女士" : "Ms.") : (currentLang === "en" ? "Mr." : currentLang === "zh" ? "先生" : "Mr.")} {patient?.fullname}
            </strong>{" "}
            {currentLang === "en" ? "and similar patients before surgery" : currentLang === "zh" ? "和类似患者在手术前" : "and similar patients before surgery"}
          </li>
          {/* Variable Selection */}
          <SelectVariable
            value={question?.code || ""}
            onChange={(e) => {
              const selectedCode = e.target.value;
              const foundQuestion = Questions.find(q => q.code === selectedCode);
              if (foundQuestion) setQuestion(foundQuestion);
            }}
            currentLang={currentLang}
          />
          <li>
            {currentLang === "en" ? "Use the filters below to redefine similar patients based on their characteristics before surgery" : currentLang === "zh" ? "使用以下筛选器根据手术前的特征重新定义类似患者" : "Use the filters below to redefine similar patients based on their characteristics before surgery"}
          </li>
        </ul>
      </article>

      <FilterButtonsComponent
        key={question?.id}
        onFilterApply={handleFilterChange}
        activeTab={activeTab}
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
                  {currentLang === "en" ? "Below are what past patients reported before surgery. Those patients are similar to" : currentLang === "zh" ? "下面是过去的患者在手术前报告的情况。这些患者与" : "Below are what past patients reported before surgery. Those patients are similar to"} {getName()}
                  {getFilterDescription(filters, patient, currentLang)}.
                </p>
                <h3>{currentLang === "en" ? question.question : currentLang === "zh" ? question.chineseDescription : question.question}</h3>
                <h4>
                  {currentLang === "en" ? "Responses of" : currentLang === "zh" ? "类似患者的回答" : "Responses of"} {beforeData?.totalRows} {currentLang === "en" ? "patients similar to" : currentLang === "zh" ? "患者类似于" : "patients similar to"}{" "}
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
