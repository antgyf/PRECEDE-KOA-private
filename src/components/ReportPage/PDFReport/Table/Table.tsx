import { View, StyleSheet } from "@react-pdf/renderer";
import TableRow from "./TableRow";
import { Patient } from "../../../../models/patient/patientReport";
import TableHeader from "./TableHeader";

const styles = StyleSheet.create({
  tableContainer: {
    width: "100%", // Ensure full width for proper alignment
    marginVertical: 10,
  },
  line: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 10,
    width: "100%",
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