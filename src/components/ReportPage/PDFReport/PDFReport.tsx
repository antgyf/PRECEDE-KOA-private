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

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 10,
    flexDirection: "column",
  },
  instruction: {
    fontSize: 11,
    marginBottom: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Inter",
    marginBottom: 1,
  },
  bold: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
    fontFamily: "Inter",
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
  },
  pointer: {
    fontSize: 14,
    marginLeft: 5,
  },
  chartContainer: {
    width: "80%",
  },
  boldText: {
    color: "#1976D2",
    fontFamily: "Inter",
    fontSize: 10,
    fontWeight: "bold",
  },
    noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200, // Adjust based on your chart height
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

interface PDFReportProps {
  filters: FilterType;
  barChartData: BarChartData[];
  radarImage: string;
  renderRadar: boolean;
}

const PDFReport: React.FC<PDFReportProps> = ({
  filters,
  barChartData,
  radarImage,
  renderRadar,
}) => {
  const { patient } = useForm();

  const getName = () => (
    <Text style={styles.boldText}>
      {patient?.sex ? "Ms." : "Mr."} {patient?.fullname}
    </Text>
  );

  const remapInitial = (question: number, initial: number) => {
    if (question === 2) {
      if (initial >= 3) return initial - 1;
    }
    else if (question === 3) { 
      if (initial === 3) return 2;
      if (initial === 4 || initial === 5) return 3;
      if (initial === 6) return 4;
    }
    return initial;
  }

  const getFilterDescription = (filters: FilterType) => {
    if (!patient) return;

    const descriptionParts: React.ReactNode[] = [];

    // Age
    if (filters.categories.includes("Age Range") && filters.age) {
      descriptionParts.push(
        <>
          <Text style={styles.boldText}>Age</Text> (within {filters.age.range} years)
        </>
      );
    }

    // BMI
    if (filters.categories.includes("BMI Range") && filters.bmi) {
      descriptionParts.push(
        <>
          <Text style={styles.boldText}>BMI</Text> (within {filters.bmi.range} kg/m²)
        </>
      );
    }

    // Gender
    if (filters.categories.includes("Gender")) {
      descriptionParts.push(
        <>
          <Text style={styles.boldText}>Gender</Text> ({Sex[patient.sex]})
        </>
      );
    }

    // Ethnicity
    if (filters.categories.includes("Ethnicity")) {
      descriptionParts.push(
        <>
          <Text style={styles.boldText}>Ethnicity</Text> ({Ethnicity[patient.ethnicity]})
        </>
      );
    }

    // Surgeon Title — applies to reference patients, not live patient
    if (filters.surgeontitle) {
      descriptionParts.push(
        <>
          and were operated on by a <Text style={styles.boldText}>{filters.surgeontitle}</Text> surgeon
        </>
      );
    }

    // Surgeon ID — applies to reference patients, not live patient
    if (filters.surgeonid) {
      descriptionParts.push(
        <>
          and were operated on by Surgeon with Surgeon ID <Text style={styles.boldText}>{filters.surgeonid}</Text>
        </>
      );
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
        {patient && <Table data={patient} />}
        <Text style={styles.instruction}>
          Below are what past patients reported{" "}
          <Text style={styles.bold}>6 months after surgery</Text> in the five
          areas {getName()} hopes to see improvement most. Those patients are
          similar to {getName()}
          {getFilterDescription(filters)}, and they experienced the same level
          of problems as {getName()} in those areas before surgery.
        </Text>

      {barChartData.map((data) => (
        <View key={data.variableQuestion} wrap={false} style={styles.colContainer}>
          <Text style={styles.title}>{data.variableQuestion}</Text>
          <View style={styles.row}>
            {/* Only show patient position if there's data */}
            {data.options.length > 0 && data.options[0].label !== "No data available" ? (
              <View
                style={[
                  styles.nameBoxContainer,
                  { marginTop: remapInitial(data.questionid, Number(data.initial)) * 22 + 8 },
                ]}
              >
                <Text style={styles.nameBox}>
                  {patient?.sex ? "Ms." : "Mr."} {patient?.fullname} {"\n"}is
                  currently here
                </Text>
                <Text style={styles.pointer}>={`>`}</Text>
              </View>
            ) : (
              // Empty spacer to maintain layout when no data
              <View style={styles.nameBoxContainer} />
            )}
            
            <View style={styles.chartContainer}>
              {data.options.length > 0 && data.options[0].label !== "No data available" ? (
                <BarChart data={data} />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No similar patients found for this question</Text>
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
              the five areas {getName()} cares most about, against the experience of
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
  );
  
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