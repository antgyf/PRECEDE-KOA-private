import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEE", // Highlight the header row
    padding: 5,
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

const TableHeader: React.FC = () => {
  const headers = [
    "Study ID",
    "Name",
    "Age",
    "Sex",
    "Ethnicity",
    "BMI(kg/m^2)",
  ];

  const isShortCell = (header: string) => {
    return header === "Study ID";
  };

  return (
    <View style={styles.row}>
      {headers.map((header, index) => (
        <Text
          key={index}
          style={isShortCell(header) ? styles.shortcell : styles.longcell}
        >
          {header}
        </Text>
      ))}
    </View>
  );
};

export default TableHeader;
