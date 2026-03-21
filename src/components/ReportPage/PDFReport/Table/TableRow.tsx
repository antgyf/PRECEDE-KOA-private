import { Text, View } from "@react-pdf/renderer";
import { Patient } from "../../../../models/patient/patientReport";
import { Ethnicity, EthnicityCh } from "../../../../models/patient/patientDetails";
import { columnStyles, columnConfig } from "./ColumnStyles";

interface TableRowProps {
  data: Patient;
  currentLang: string; // "en" | "zh"
}

const getSexLabel = (sex: number, lang: string) => {
  if (lang === "zh") {
    return sex === 0 ? "男" : "女";
  }
  if (lang === "en") {
    return sex === 0 ? "Male" : "Female";
  }
}

const getEthnicityLabel = (ethnicity: number, lang: string) => {
  if (lang === "zh") {
    // Add Chinese labels for ethnicities if needed
    return EthnicityCh[ethnicity];
  }
  if (lang === "en") {
    return Ethnicity[ethnicity];
  }
}

const TableRow: React.FC<TableRowProps> = ({ data, currentLang }) => {
  const rowData = [
    data.patientid,
    data.fullname,
    data.age,
    getSexLabel(data.sex, currentLang),   
    getEthnicityLabel(data.ethnicity, currentLang),
    data.bmi, 
  ];

  return (
    <View style={columnStyles.row}>
      {rowData.map((value, index) => {
        const isShort = columnConfig[index].width === "short";
        const style = isShort ? columnStyles.shortcell : columnStyles.longcell;
        
        return (
          <Text key={index} style={style}>
            {value || "-"} {/* Handle null/undefined values */}
          </Text>
        );
      })}
    </View>
  );
};

export default TableRow;