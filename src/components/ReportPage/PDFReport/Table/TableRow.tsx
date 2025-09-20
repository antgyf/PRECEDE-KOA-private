import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { Patient } from "../../../../models/patient/patientReport";
import { Ethnicity, Sex } from "../../../../models/patient/patientDetails";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  shortcell: {
    width: "10%",
    textAlign: "center",
    fontWeight: "bold",
  },
  longcell: {
    width: "18%",
    textAlign: "center",
    fontWeight: "bold",
  },
});

interface TableRowProps {
  data: Patient;
}

const TableRow: React.FC<TableRowProps> = ({ data }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.shortcell}>{data.patientid}</Text>
      <Text style={styles.longcell}>{data.fullname}</Text>
      <Text style={styles.longcell}>{data.age}</Text>
      <Text style={styles.longcell}>{Sex[data.sex]}</Text>
      <Text style={styles.longcell}>{Ethnicity[data.ethnicity]}</Text>
      <Text style={styles.longcell}>{data.bmi}</Text>
    </View>
  );
};

export default TableRow;
