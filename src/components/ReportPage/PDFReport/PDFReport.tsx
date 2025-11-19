import React from "react";
import {
  Document,
  Image,
  Page,
  PDFDownloadLink,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import Table from "./Table/Table";
import {
  BarChartData,
  Ethnicity,
  FilterType,
  Sex,
} from "../../../models/patient/patientDetails";
import { useForm } from "../../../hooks/FormContext";
import BarChart from "./QuestionWithDynamicOptions/BarChart";
import { getChSurgeonTitle } from "../../../utils/helper";
import { Font } from "@react-pdf/renderer";

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

interface PDFReportProps {
  filters: FilterType;
  barChartData: BarChartData[];
  radarImage: string;
  renderRadar: boolean;
  currentLang: string;
}

const PDFReport: React.FC<PDFReportProps> = ({
  filters,
  barChartData,
  radarImage,
  renderRadar,
  currentLang,
}) => {
  const { patient } = useForm();

  const styles = createStyles(currentLang);
  const numPriorities = barChartData.length;

  const getName = () => {
    if (currentLang === "en") {
      return (
        <strong style={{ color: "#1976D2" }}>
          {" "}
          {patient?.sex ? "Ms." : "Mr."} {patient?.fullname}
        </strong>
      );
    } else if (currentLang === "zh") {
      return (
        <strong style={{ color: "#1976D2" }}>
          {" "}
          {patient?.fullname} {patient?.sex ? "女士" : "先生"}
        </strong>
      );
    }
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
            <Text style={styles.boldText}>年龄</Text> (在 {filters.age.range} 岁之间)
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
            <Text style={styles.boldText}>BMI</Text> (在 {filters.bmi.range} kg/m²之间)
          </>
        );
      }
    }

    // Gender
    if (filters.categories.includes("Gender")) {
      if (currentLang === "en") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>Gender</Text> ({Sex[patient.sex]})
          </>
        );
      } else if (currentLang === "zh") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>性别</Text> ({Sex[patient.sex]})
          </>
        );
      }
    }

    // Ethnicity
    if (filters.categories.includes("Ethnicity")) {
      if (currentLang === "en") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>Ethnicity</Text> ({Ethnicity[patient.ethnicity]})
          </>
        );
      } else if (currentLang === "zh") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>种族</Text> ({Ethnicity[patient.ethnicity]})
          </>
        );
      }
    }

    // Surgeon Title — applies to reference patients, not live patient
    if (filters.surgeontitle) {
      if (currentLang === "en") {
        descriptionParts.push(
          <>
            and were operated on by a <Text style={styles.boldText}>{filters.surgeontitle}</Text> surgeon
          </>
        );
      } else if (currentLang === "zh") {
        descriptionParts.push(
          <>
            并由一位 <Text style={styles.boldText}>{getChSurgeonTitle(filters.surgeontitle)}</Text> 外科医生进行手术
          </>
        );
      }
    }

    // Surgeon ID — applies to reference patients, not live patient
    if (filters.surgeonid) {
      if (currentLang === "en") {
        descriptionParts.push(
          <>
            and were operated on by Surgeon with Surgeon ID <Text style={styles.boldText}>{filters.surgeonid}</Text>
          </>
        );
      } else if (currentLang === "zh") {
        descriptionParts.push(
          <>
            并由外科医生ID为 <Text style={styles.boldText}>{filters.surgeonid}</Text> 的外科医生进行手术
          </>
        );
      }
    }

    // Assemble text
    return (
      <Text>
        {descriptionParts.length > 0 && " in "}
        {descriptionParts.map((part, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && ", "}
            {part}
          </React.Fragment>
        ))}
      </Text>
    );
  };

  const pdfFileName = `${patient?.patientid}. ${patient?.fullname} Summary Report.pdf`;

  const renderPDFDocument = (radarImage: string) => (
    <Document title={pdfFileName}>
      {/* Page 1: Bar Charts */}
      <Page size="A4" style={styles.page}>
        {currentLang === "en" && patient && (
        <>
          <Table data={patient} />
          <Text style={styles.instruction}>
            Below are what past patients reported{" "}
            <Text style={styles.bold}>6 months after surgery</Text> in the {numPriorities}
            {numPriorities > 1 ? " areas" : " area"} {getName()} hopes to see improvement most.
            Those patients are similar to {getName()}
            {getFilterDescription(filters)}, and they experienced the same level
            of problems as {getName()} in those areas before surgery.
          </Text>
        </>
      )}

      {currentLang === "zh" && patient && (
        <>
          <Table data={patient} />
          <Text style={styles.instruction}>
            下面是过去的患者在手术后6个月报告的情况，{numPriorities}
            {numPriorities > 1 ? " 个方面" : " 个方面"} 是 {getName()} 最希望看到改善的地方。
            这些患者与 {getName()} 类似，{getFilterDescription(filters)}，
            并且他们在手术前在这些方面经历了与 {getName()} 相同的问题程度。
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
                      {patient?.sex ? "Ms." : "Mr."} {patient?.fullname}
                    </>
                  ) : currentLang === "zh" ? (
                    <>
                      {patient?.fullname}
                      {patient?.sex ? "女士" : "先生"}
                    </>
                  ) : (
                    <>
                      {patient?.sex ? "Ms." : "Mr."} {patient?.fullname}
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
                  <Text style={styles.noDataText}> {currentLang === "en" ? "No similar patients were found" : "未找到类似的患者"}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      ))}
      </Page>
      
      {/* Page 2: Radar Chart + Legend */}
        {renderRadar && (
          <Page size="A4" style={styles.page}>
            {patient && <Table data={patient} />}
            <Text style={styles.title}>Patient Overview</Text>
            <Text style={styles.instruction}>
              The chart below compares what {getName()} is currently experiencing in
              the {numPriorities} {numPriorities > 1 ? " areas " : " area "} {getName()} cares most about, against the experience of
              similar patients 6 months after surgery. Those patients were similar
              to {getName()}
              {getFilterDescription(filters)}, and they experienced the same level
              of problems as {getName()} in those areas before surgery.
            </Text>

            <View style={{ marginTop: 20, gap: 2 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 10, color: "#003f5c" }}>Dark blue: </Text>
                <Text style={{ fontSize: 10 }}>
                  The experience of similar patients 6 months after surgery
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 10, color: "#00BFFF" }}>Light blue: </Text>
                <Text style={{ fontSize: 10 }}>
                  current experience of {getName()}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 10, color: "green" }}>Green: </Text>
                <Text style={{ fontSize: 10 }}>no problems</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 10, color: "#90ee90" }}>Light green: </Text>
                <Text style={{ fontSize: 10 }}>slight problems</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 10, color: "#FFD700" }}>Yellow: </Text>
                <Text style={{ fontSize: 10 }}>moderate problems</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 10, color: "#FFA500" }}>Orange: </Text>
                <Text style={{ fontSize: 10 }}>severe problems</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 10, color: "red" }}>Red: </Text>
                <Text style={{ fontSize: 10 }}>extreme problems</Text>
              </View>
            </View>

            <Image
              src={radarImage}
              style={{
                width: "80%",
                margin: "0 auto",
                marginTop: 20,
              }}
            />
          </Page>
        )}
          </Document>
        )
  
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <PDFDownloadLink
        document={renderPDFDocument(radarImage)}
        fileName={pdfFileName}
        className="btn btn-primary text-xl max-w-7xl mb-2"
      >
        Download PDF
      </PDFDownloadLink>
      <PDFViewer
        width="100%"
        height="850px"
        style={{ border: "2px solid black", backgroundColor: "white" }}
      >
        {renderPDFDocument(radarImage)}
      </PDFViewer>
    </div>
  );
};

export default PDFReport;