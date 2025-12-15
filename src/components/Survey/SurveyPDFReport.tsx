import React from "react";
import {
  Document,
  Page,
  PDFDownloadLink,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import Table from "../ReportPage/PDFReport/Table/Table";
import {
  BarChartData,
  FilterType,
} from "../../models/patient/patientDetails";
import BarChart from "../ReportPage/PDFReport/QuestionWithDynamicOptions/BarChart";
import { Font } from "@react-pdf/renderer";
import { Patient } from "./SurveyInputPage";
import { useAlert } from "../../hooks/AlertContext";
import { pdf } from "@react-pdf/renderer";
import api from "../../api/api";


Font.register({
  family: "NotoSansSC",
  fonts: [
    {
      src: "/fonts/NotoSansSC-Regular.ttf",
    },
    {
      src: "/fonts/NotoSansSC-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const getFontFamily = (lan: string) => {
  switch (lan) {
    case "zh":
      return "NotoSansSC";
    default:
      return "Inter";
  }
};

const createStyles = (lang: string) =>
  StyleSheet.create({
    page: {
      padding: 10,
      fontSize: 10,
      fontFamily: getFontFamily(lang),
      flexDirection: "column",
    },
    instruction: {
      fontSize: 11,
      marginBottom: 1,
      fontFamily: getFontFamily(lang),
    },
    title: {
      fontSize: 12,
      fontWeight: "bold",
      fontFamily: getFontFamily(lang),
      marginBottom: 1,
    },
    bold: {
      fontSize: 10,
      fontWeight: "bold",
      marginBottom: 2,
      fontFamily: getFontFamily(lang),
    },
    boldText: {
      color: "#1976D2",
      fontFamily: getFontFamily(lang),
      fontSize: 10,
      fontWeight: "bold",
    },
    colContainer: {
      flexDirection: "column",
      marginBottom: 5,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "center",
    },
    nameBoxContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    nameBox: {
      borderWidth: 2,
      borderColor: "black",
      padding: 5,
      fontSize: 10,
      fontFamily: getFontFamily(lang),
    },
    pointer: {
      fontSize: 14,
      marginLeft: 5,
    },
    chartContainer: {
      width: "80%",
    },
    noDataContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      height: 50,
    },
    noDataText: {
      fontSize: 14,
      color: "#666",
      fontFamily: getFontFamily(lang),
    },
  });

interface SurveyPDFReportProps {
  filters: FilterType;
  barChartData: BarChartData[];
  patient: Patient;
  currentLang: string;
}

const SurveyPDFReport: React.FC<SurveyPDFReportProps> = ({
  filters,
  patient,
  barChartData,
  currentLang,
}) => {

  const { showAlert } = useAlert();

  const styles = createStyles(currentLang);
  const numPriorities = barChartData.length;

  const formattedPatient = {
    ...patient,
    age: Number(patient.age),
    bmi: Number(patient.bmi),
    height : Number(patient.height),
    weight : Number(patient.weight),
    sex : Number(patient.sex === "male" ? 0 : 1),
    ethnicity: Number(patient.ethnicity),
    fullname : patient.fullName,
    patientid : 1,
    hasform: true,

    };

  const getName = () => {
    if (!patient) return null;

    return (
      <Text style={styles.bold}>
        {currentLang === "en"
          ? `${patient.sex ? "Ms." : "Mr."} ${patient.fullName}`
          : `${patient.fullName}${patient.sex ? "女士" : "先生"}`}
      </Text>
    );
  };

  const getFilterDescription = (filters: FilterType) => {
    if (!patient) return;

    const descriptionParts: React.ReactNode[] = [];

    // Age
    if (filters.categories.includes("Age Range") && filters.age) {
      if (currentLang === "en") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>Age</Text> (within {filters.age.range} years)
          </>
        );
      } else if (currentLang === "zh") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>年龄</Text> (相差{filters.age.range}岁之内)
          </>
        );
      }
    }

    // BMI
    if (filters.categories.includes("BMI Range") && filters.bmi) {
      if (currentLang === "en") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>BMI</Text> (within {filters.bmi.range} kg/m²)
          </>
        );
      } else if (currentLang === "zh") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>体重指数(BMI)</Text> (相差{filters.bmi.range}kg/m²之内)
          </>
        );
      }
    }

    // Assemble text
    return (
      <Text>
        {descriptionParts.length > 0}
        {descriptionParts.map((part, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && ", "}
            {part}
          </React.Fragment>
        ))}
      </Text>
    );
  };

  const pdfFileName = `${patient?.fullName} Summary Report.pdf`;

  const renderPDFDocument = (): React.ReactElement => (
    <Document title={pdfFileName}>
      {/* Page 1: Bar Charts */}
      <Page size="A4" style={styles.page}>
        {currentLang === "en" && patient && (
        <>
          <Table data={formattedPatient} currentLang={currentLang} />
          <Text style={styles.instruction}>
            Below are what past patients reported <Text style={styles.bold}>6 months after surgery </Text>
             in the {numPriorities} areas {getName()} hopes to see improvement most. 
            Those patients are similar to {getName()} in {getFilterDescription(filters)},
            and they experienced the same level of problems
            as in the {numPriorities} areas before surgery.
          </Text>
        </>
      )}

      {currentLang === "zh" && patient && (
        <>
          <Table data={formattedPatient} currentLang={currentLang}/>
          <Text style={styles.instruction}>
            下面是过去的患者在<Text style={styles.bold}>手术后6个月</Text>报告的、在{numPriorities}个不同方面的情况。
            这{numPriorities}个方面是{getName()}最希望看到改善的方面。
            这些患者与{getName()}在{getFilterDescription(filters)}方面相似。
            并且他们手术前在这{numPriorities}方面经历了与{getName()}相同程度的问题。
          </Text>
        </>
      )}


      {barChartData.map((data) => (
        <View key={data.variableQuestion} wrap={false} style={styles.colContainer}>
          <Text style={styles.title}>{data.variableQuestion}</Text>
          <View style={styles.row}>
            {/* Only show patient position if there's data */}
            {data.options.length > 0 && data.options[0].label !== "No data available" ? (
              <View
                style={[
                  styles.nameBoxContainer,
                  { marginTop: Number(data.initial) * 16 + 4 },
                ]}
              >
                <Text style={styles.nameBox}>
                  {
                  currentLang === "en" ? (
                    <>
                      {patient?.sex ? "Ms." : "Mr."} {patient?.fullName}
                    </>
                  ) : currentLang === "zh" ? (
                    <>
                      {patient?.fullName}
                      {patient?.sex ? "女士" : "先生"}
                    </>
                  ) : (
                    <>
                      {patient?.sex ? "Ms." : "Mr."} {patient?.fullName}
                    </>
                  )
                } {"\n"} 
                  {currentLang === "en" ? "is currently here" : "目前在这里"}
                </Text>
                <Text style={styles.pointer}>={`>`}</Text>
              </View>
            ) : (
              // Empty spacer to maintain layout when no data
              <View style={styles.nameBoxContainer} />
            )}
            
            <View style={styles.chartContainer}>
              {data.options.length > 0 && data.options[0].label !== "No data available" ? (
                <BarChart data={data} lang={currentLang} />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}> {currentLang === "en" ? "No similar patients were found" : "未找到相似的患者"}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      ))}
      </Page>
      </Document>
        )

      
  const handleSendReport = async () => {
    try {
      // 1. Generate PDF Blob
      const blob = await pdf(renderPDFDocument()).toBlob();

      // 2. Prepare form data
      const formData = new FormData();
      formData.append("email", patient.email);
      formData.append("mabelEmail", "e0959863@u.nus.edu")
      formData.append("file", blob, pdfFileName);

      // 3. Send to backend
      const response = await api.post("/patients/send-report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status !== 200) {
        throw new Error("Failed to send report");
      }

      showAlert(
        currentLang === "zh"
          ? "报告已成功发送至您的电子邮箱"
          : "Your report has been emailed successfully",
        "success"
      );
    } catch (err) {
      console.error(err);
      showAlert(
        currentLang === "zh"
          ? "发送报告时出错，请稍后再试"
          : "Failed to send report. Please try again.",
        "error"
      );
    }
  };
  
  return (
    <div className="w-full flex flex-col justify-center items-center">
  {/* Action buttons row */}
    <div className="flex flex-row gap-4 mb-4">
      <PDFDownloadLink
        document={renderPDFDocument()}
        fileName={pdfFileName}
        className="btn btn-primary text-xl"
      >
        Download PDF
      </PDFDownloadLink>

      <button
        onClick={handleSendReport}
        className="px-6 py-3 rounded-xl bg-green-600 text-white text-lg font-semibold hover:bg-green-700 transition"
      >
        {currentLang === "zh" ? "通过电子邮件发送报告" : "Email My Report"}
      </button>
    </div>

    <PDFViewer
      width="100%"
      height="850px"
      style={{ border: "2px solid black", backgroundColor: "white" }}
    >
      {renderPDFDocument()}
    </PDFViewer>
  </div>

  );
};

export default SurveyPDFReport;