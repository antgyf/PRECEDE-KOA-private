import { View, StyleSheet } from "@react-pdf/renderer";
import TableRow from "./TableRow";
import { Patient } from "../../../../models/patient/patientReport";
import TableHeader from "./TableHeader";

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  line: {
    height: 1, // Line height
    backgroundColor: "#000", // Line color
    marginVertical: 10, // Spacing above and below the line
    width: "100%", // Full width
  },
});

interface TableProps {
  data: Patient;
}

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <View style={styles.tableContainer}>
      <TableHeader />
      <TableRow data={data} />
      <View style={styles.line} />
    </View>
  );
};

export default Table;
