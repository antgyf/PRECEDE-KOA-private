import { useEffect, useState } from "react";
import SurveyPDFReport from "./SurveyPDFReport";
import {
  BarChartData,
  FilterType,
  QuestionData,
  Questions,
  QuestionType,
} from "../../models/patient/patientDetails";
import { useAlert } from "../../hooks/AlertContext";
import api from "../../api/api";
import { Patient, FormData, PrioritiesData } from "./SurveyInputPage";
import Alert from "../UI/Alert";

interface SurveyReportPageProps {
  currentLang: string;
  patient: Patient;
  form: FormData;
  priorities: PrioritiesData;
  activeTab?: "summary";
}

const SurveyReportPage: React.FC<SurveyReportPageProps> = ({
  currentLang,
  patient,
  form,
  priorities,
}) => {
  const [filters] = useState<FilterType>({
    categories: ["Age Range", "BMI Range"],
    age: { range: 5 },
    bmi: { range: 2 },
  });
  const { alert, showAlert } = useAlert();
  const [questionData, setQuestionData] = useState<Record<number, QuestionData>>({});
  const [barChartData, setBarChartData] = useState<BarChartData[]>([]);

  /*
  const formattedPatient = {
    ...patient,
    age: Number(patient.age),
    bmi: Number(patient.bmi),
    height : Number(patient.height),
    weight : Number(patient.weight),
    sex : Number(patient.sex === "male" ? 0 : 1),
    ethnicity: Number(patient.ethnicity),
    fullname : patient.fullName,
};
*/

  if (!form) {
    return (
      <>
        {currentLang === "en"
          ? "Something went wrong with retrieving patient data. Please try again."
          : currentLang === "zh"
          ? "获取患者数据时出错。请再试一次。"
          : ""}
      </>
    );
  }

  if (!priorities || priorities.length === 0) {
    return (
      <>
        {currentLang === "en"
          ? "No priorities selected. Please go back to the previous page."
          : currentLang === "zh"
          ? "未选择优先事项。请返回上一页。"
          : ""}
      </>
    );
  }

  const getRankDescription = (lan: string) => {
    let priorityQuestions: string[] | undefined;
    if (lan === "zh") {
      priorityQuestions = priorities?.map((code) => {
        const description = Questions.find((q) => q.code === code)?.chineseDescription || "N/A";
        return description;
      });
    } else {
      priorityQuestions = priorities?.map((code) => {
        const description = Questions.find((q) => q.code === code)?.description || "N/A";
        return description;
      });
    }
  
    if (lan === "en") {
      return (
        <>
  
          <ul className="leading-tight">
            {(priorityQuestions ?? []).map((q) => (
              <li key={q}>{"  "}{q}</li>
            ))}
          </ul>
        </>
      );
    } else if (lan === "zh") {
      return (
        <>
          <ul className="leading-tight">
            {(priorityQuestions ?? []).map((q) => (
              <li key={q}>{"  "}{q}</li>
            ))}
          </ul>
        </>
      );
    }
  };

  // Map priority codes to questions
  const questionsWithOptions: (QuestionType & { value: string | null })[] = priorities
    .map((code) => {
      const question = Questions.find((q) => q.code === code);
      if (!question) return null;
      return { ...question, value: form[code] ?? null };
    })
    .filter(Boolean) as (QuestionType & { value: string | null })[];

  // Extract numeric IDs for API processing
  const variableIds: number[] = questionsWithOptions.map((q) => q.id);

  // Process bar chart data when all questionData is loaded
  useEffect(() => {
    if (Object.keys(questionData).length === variableIds.length && variableIds.length > 0) {
      processBarChartData();
    }
  }, [questionData, variableIds.length]);

  const processBarChartData = () => {
    const updatedBarChartData: BarChartData[] = variableIds.map((qid) => {
      const data = questionData[qid];
      const question = Questions.find((q) => q.id === qid);

      const initial = question ? Number(form[question.code] ?? -1) : -1;

      if (!data || data.totalRows === 0 || !data.data || data.data.length === 0) {
        return {
          title: `No similar patients found for question ${qid}`,
          options: [{ label: "No data available", percentageText: "0 of 0 (0%)", percent: 0 }],
          questionid: qid,
          variableQuestion:
            currentLang === "en"
              ? question?.description ?? ""
              : question?.chineseDescription ?? "",
          initial,
        };
      }

      const title =
        currentLang === "en"
          ? `Responses of ${data.totalRows} patient(s) similar to ${
              patient?.sex ? `Ms. ${patient?.fullName}` : `Mr. ${patient?.fullName}`
            }`
          : currentLang === "zh"
          ? `与 ${patient?.fullName}${patient?.sex ? "女士" : "先生"} 相似的 ${data.totalRows} 名患者的回答`
          : "";

      const labelsAndPercentages = data.data.map((v) => {
        const total = Number(data.totalRows);
        const count = Number(v.count);
        const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : "0";
        return {
          label:
            currentLang === "en"
              ? question?.list?.[Number(v.option)] ?? v.option
              : currentLang === "zh"
              ? question?.chList?.[Number(v.option)] ?? v.option
              : question?.list?.[Number(v.option)] ?? v.option,
          percentageText:
            currentLang === "en"
              ? `${count} of ${total} (${percentage}%)`
              : currentLang === "zh"
              ? `${count} / ${total} (${percentage}%)`
              : `${count} of ${total} (${percentage}%)`,
          percent: Number(percentage),
        };
      });

      return {
        title,
        options: labelsAndPercentages,
        questionid: qid,
        variableQuestion:
          currentLang === "en"
            ? question?.description ?? ""
            : currentLang === "zh"
            ? question?.chineseDescription ?? ""
            : "",
        initial,
      };
    });

    setBarChartData(updatedBarChartData);
  };

  // Fetch data for each question
  useEffect(() => {
    if (variableIds.length === 0) return;

    setQuestionData({});
    setBarChartData([]);

    const fetchDataForQuestion = async (q: QuestionType & { value: string | null }) => {
      try {
        const options = Object.keys(q.list).map(Number);

        showAlert(
          currentLang === "en" ? "Loading..." : currentLang === "zh" ? "加载中..." : "Loading...",
          "info"
        );

        const response = await api.post(
          "/patients/after",
          {
            questionid: q.id,
            options,
            filters,
            patient,
            initial: Number(form[q.code] ?? -1),
            median: true,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.message === "No baseline patients found for the given filters.") {
          response.data = { questionid: q.id, totalRows: 0, data: [], median: 0 };
        }

        setQuestionData((prev) => ({
          ...prev,
          [response.data.questionid]: {
            totalRows: response.data.totalRows,
            data: [...response.data.data],
            questionid: response.data.questionid,
          },
        }));

        showAlert(
          currentLang === "en"
            ? "Successfully loaded patient"
            : currentLang === "zh"
            ? "成功加载患者"
            : "Successfully loaded patient",
          "success"
        );
      } catch (error) {
        showAlert(
          currentLang === "en"
            ? "Failed to fetch data. Please try again."
            : currentLang === "zh"
            ? "获取数据失败。请再试一次。"
            : "Failed to fetch data. Please try again.",
          "error"
        );
      }
    };

    Promise.all(questionsWithOptions.map(fetchDataForQuestion)).finally(() => true);
  }, [filters, currentLang]);

  return (
    <div className="flex flex-col items-start justify-start h-full w-full gap-2">
      {alert.message && <Alert />}
      <div className="flex flex-col w-full justify-start mb-1">
        <article className="prose mb-1 max-w-none">
          {currentLang === "en" && (
            <h3>
              The {priorities.length} areas{" "}
              <strong style={{ color: "#1976D2" }}>
                {patient?.sex ? "Ms." : "Mr."} {patient?.fullName}
              </strong>{" "}
              hopes to see improvement in are:
            </h3>
          )}
          {currentLang === "zh" && (
            <h3>
              {priorities.length} 个{" "}
              <strong style={{ color: "#1976D2" }}>
                {patient?.fullName} {patient?.sex ? "女士" : "先生"}
              </strong>{" "}
              希望看到改善的主要方面是：
            </h3>
          )}
          <ul className="text-xl mb-3">{getRankDescription(currentLang)}</ul>
          <div className="text-2xl mb-3">
            {currentLang === "en"
              ? "Self-reported Functions of Similar Patients 6 Months after Surgery"
              : currentLang === "zh"
              ? "相似患者手术后6个月报告的功能"
              : ""}
          </div>
        </article>
      </div>

      <SurveyPDFReport filters={filters} barChartData={barChartData} patient={patient} currentLang={currentLang} />
    </div>
  );
};

export default SurveyReportPage;
