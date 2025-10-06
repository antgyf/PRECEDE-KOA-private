import { Text, View } from "@react-pdf/renderer";
import { Patient } from "../../../../models/patient/patientReport";
import { Ethnicity, Sex, SurgeonTitle } from "../../../../models/patient/patientDetails";
import { columnStyles, columnConfig } from "./ColumnStyles";

interface TableRowProps {
  data: Patient;
}

const TableRow: React.FC<TableRowProps> = ({ data }) => {
  const rowData = [
    data.patientid,
    data.fullname,
    data.age,
    Sex[data.sex],
    Ethnicity[data.ethnicity],
    data.bmi, 
    SurgeonTitle[data.surgeontitle],
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