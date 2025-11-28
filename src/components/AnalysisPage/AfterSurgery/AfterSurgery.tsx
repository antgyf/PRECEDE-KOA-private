import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { useForm } from "../../../hooks/FormContext";
import {
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

interface AfterSurgeryProps {
  activeTab: "summary" | "before" | "after";
  currentLang: string;
}

const AfterSurgery: React.FC<AfterSurgeryProps> = ({ activeTab, currentLang }) => {
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
    categories: ["Age Range", "BMI Range"],
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
      
      showAlert(currentLang === "en" ? "Fetching data..." : currentLang === "zh" ? "正在获取数据..." : "Fetching data...", "info");
      try {
        const options = Object.entries(question?.list).map(([key]) =>
          parseInt(key, 10)
        );

        if (filters.surgeonid && !filters.categories.includes("Surgeon ID")) {
          filters.categories = [...filters.categories, "Surgeon ID"];
        }

        if (filters.surgeontitle && !filters.categories.includes("Surgeon Title")) {
          filters.categories = [...filters.categories, "Surgeon Title"];
        }

        const scrollY = window.scrollY; // Save current scroll position

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
        
        showAlert(currentLang === "en" ? "Successfully fetched patient data" : currentLang === "zh" ? "成功获取患者数据" : "Successfully fetched patient data", "success");

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
        showAlert(currentLang === "en" ? "Failed to fetch data. Please try again." : currentLang === "zh" ? "获取数据失败。请再试一次。" : "Failed to fetch data. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [question, filters, selectedTerm, currentLang]);

  // Process data after `afterData` is updated
  useEffect(() => {
    if (!afterData || !question) return;

    const processGraphData = (): GraphData => {
      if (!afterData || !afterData.data || !question || !question.list) {
        showAlert(
          currentLang === "en" ? "Something went wrong with retrieving the data. Please try again." : currentLang === "zh" ? "检索数据时出错。请再试一次。" : "Something went wrong with retrieving the data. Please try again.",
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
          `${currentLang === "en" ? question.list[item.option] : currentLang === "zh" ? question.chList[item.option] : question.list[item.option]} `,
          +item.count,
          gradientColors[item.option % gradientColors.length],
          `${item.count} (${String(item.percentage)}%)`,
        ]),
      ];
    };

    const processDescriptionList = () => {
      if (!question?.list || !afterData?.data) {
        return [];
      }

      return afterData.data.map((item, index) => ({
        description: `${currentLang === "en" ? question.list[item.option] : currentLang === "zh" ? question.chList[item.option] : question.list[item.option]}`,
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
    return <div>{currentLang === "en" ? "No patient form found." : currentLang === "zh" ? "未找到患者表单。" : "No patient form found."}</div>;
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
                {getName(currentLang)} {currentLang === "en" ? "is currently here" : currentLang === "zh" ? "当前在这里" : "is currently here"}
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
              {currentLang === "en" ? question.list[item.option] : currentLang === "zh" ? question.chList[item.option] : question.list[item.option]}
            </div>
            <div>
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
        {currentLang === "en" && (
          <h3>
            The {form.priorities?.length || 0} areas{" "}
            <strong style={{ color: "#1976D2" }}>
              {patient?.sex ? "Ms." : "Mr."} {patient?.fullname}
            </strong>{" "}
            hopes to see improvement in are:
          </h3>
          )}
          {currentLang === "zh" && (
          <h3>
            {form.priorities?.length || 0} 个{" "}
            <strong style={{ color: "#1976D2" }}>
              {patient?.fullname} {patient?.sex ? "女士" : "先生"}
            </strong>{" "}
            希望看到改善的主要方面是：
              </h3>
          )}          <ul>
            {getRankDescription(currentLang)}
            <li>
              {currentLang === "en" ? "Select an area you wish to know how similar patients functioned after surgery" : currentLang === "zh" ? "选择您希望了解术后相似患者功能的区域" : "Select an area you wish to know how similar patients functioned after surgery"}
              <SelectVariable
                value={question?.code || ""}
                onChange={(e) => {
                  const selectedCode = e.target.value;
                  const foundQuestion = Questions.find(q => q.code === selectedCode);
                  if (foundQuestion) setQuestion(foundQuestion);
                }}
                currentLang={currentLang}
          />
            </li>
            <li>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="whitespace-nowrap">
                  {currentLang === "en" ? "Select the post-surgery time point:" : currentLang === "zh" ? "选择术后时间点：" : "Select the post-surgery time point:"}
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
                  <span className="whitespace-nowrap">{currentLang === "en" ? "months" : currentLang === "zh" ? "个月" : "months"}</span>
                </form>
              </div>
            </li>

            <li>
              {currentLang === "en" ? "Self-reported Functions of Similar Patients 6 Months after Surgery" : 
              currentLang === "zh" ? "手术后6个月相似患者的自我报告功能" 
              : "Self-reported Functions of Similar Patients 6 Months after Surgery"}
            </li>
          </ul>
        </article>
        {/* Filter Buttons */}
        <FilterButtonsComponent
          key={question ? question.id : "no-question"}
          onFilterApply={handleFilterChange}
          activeTab={activeTab}
          currentLang={currentLang}
        />

        <PatientDetail currentLang={currentLang} />
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
                    {currentLang === "en" && (
                      <>Below are what past patients reported {" "}
                      <strong style={{ color: "#1976D2" }}>{termToMonths(selectedTerm)}</strong>{" "}
                      months after surgery. Those patients are similar to {getName(currentLang)} in {getFilterDescription(filters, patient, currentLang)}{" "} 
                      and they experienced the same level of problem as {getName(currentLang)} before surgery</>
                    )}
                    {currentLang === "zh" && (
                      <>下面是过去的患者在{" "}
                    <strong style={{ color: "#1976D2" }}>{termToMonths(selectedTerm)}</strong>{" "}
                    个月后的手术。这些患者与{getName(currentLang)}在{getFilterDescription(filters, patient, currentLang)}方面相似，{" "}
                    并且他们经历了与{getName(currentLang)}手术前相同水平的问题。</>
                    )}
                  </p>
                  <h3>{currentLang === "en" ? question.question : currentLang === "zh" ? question.chineseDescription : question.question}</h3>
                  <h4>
                    {currentLang === "en" ? "Responses of" : currentLang === "zh" ? "相似患者的回答" : "Responses of"} {afterData?.totalRows} {currentLang === "en" ? "patients similar to" : currentLang === "zh" ? "患者相似于" : "patients similar to"}{" "}
                    {getName(currentLang)} {termToMonths(selectedTerm)} {currentLang === "en" ? "months after surgery" : currentLang === "zh" ? "个月后的手术" : "months after surgery"}
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
