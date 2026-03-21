import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { OtherOptions } from "../../../../models/patient/patientDetails";

const styles = StyleSheet.create({
  questionContainer: { marginVertical: 5 },
  questionText: {
    fontSize: 12,
    marginBottom: 5,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },
  radioButtonOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
  },
  optionText: { fontSize: 11, width: 60 },
});

interface RadioOptionsProps {
  question: string;
  option: number;
}

const RadioOptions: React.FC<RadioOptionsProps> = ({ question, option }) => (
  <View style={styles.questionContainer}>
    <Text style={styles.questionText}>
      {question}
      {"\r"}
    </Text>
    {Object.entries(OtherOptions).map(([, value], index) => (
      <View key={index} style={styles.optionContainer}>
        <View style={styles.radioButtonOuter}>
          {index === option && <View style={styles.radioButtonInner} />}
        </View>
        <Text style={styles.optionText}>{value}</Text>
      </View>
    ))}
  </View>
);

export default RadioOptions;
