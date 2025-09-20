import { Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { colorScheme } from "../../../../models/UI/Color";
import { BarChartData } from "../../../../models/patient/patientDetails";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "/fonts/Inter_18pt-Regular.ttf", // Make sure this is in the public folder
    },
    {
      src: "/fonts/Inter_18pt-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  title: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
    fontFamily: "Inter",
    paddingLeft: 75,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  optionText: {
    fontSize: 10,
    width: 70,
    textAlign: "right",
    marginRight: 5,
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: 20,
    overflow: "hidden",
    position: "relative",
  },
  bar: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    fontSize: 10,
  },
});

interface BarChartProps {
  data: BarChartData;
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  return (
    <View>
      <Text style={styles.title}>{data.title}</Text>
      {data.options.map((opt, index) => {
        const match = opt.percentage.match(/^(\d+(\.\d+)?)%/); // Extract numeric part like "50" from "50% (20)"
        const numericPercentage = match ? parseFloat(match[1]) : 0;

        return (
          <View key={index} style={styles.rowContainer}>
            <Text style={styles.optionText}>{opt.label}</Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${numericPercentage}%`,
                    backgroundColor: colorScheme[index % colorScheme.length],
                  },
                ]}
              ></View>
            </View>
            <Text style={styles.percentageText}>{opt.percentage}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default BarChart;
