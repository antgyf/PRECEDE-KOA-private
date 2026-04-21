import { Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { colorScheme, colorScheme6, colorScheme7 } from "../../../../models/UI/Color";
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

Font.register({
  family: "NotoSansSC",
  src: "/fonts/NotoSansSC-Regular.ttf",
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
  title: {
    fontSize: 10,
    marginBottom: 2,
    fontFamily: getFontFamily(lang),
    paddingLeft: 75,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  optionText: {
    fontSize: 9,
    width: 110,
    textAlign: "right",
    marginRight: 5,
    marginLeft: 5,
    fontFamily: getFontFamily(lang),
  },
  barContainer: {
      flex: 1,
      height: 15,
      flexDirection: "row", // Keeps bar and text in a line
      alignItems: "center",
    },
    bar: {
      height: "100%",
      // Remove justifyContent/alignItems unless you put text INSIDE the bar
    },
    percentageText: {
      fontSize: 9,
      fontFamily: getFontFamily(lang),
      marginLeft: 4, // Spacing between the end of the bar and the text
      width: 35,    // Fixed width helps keep the "X of X" column stable
    },
    countText: {
      fontSize: 9,
      width: 60,
      textAlign: "right",
      fontFamily: getFontFamily(lang),
      marginLeft: 5, // Gap between percentage and the final column
    },
});

interface BarChartProps {
  data: BarChartData;
  lang: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, lang }) => {
  const styles = createStyles(lang);

  const getColor = (index: number, length: number) => {
    if (length === 5) return colorScheme[index % colorScheme.length];
    if (length === 6) return colorScheme6[index % 6];
    if (length === 7) return colorScheme7[index % 7];
    return colorScheme[index % colorScheme.length];
  };

  return (
    <View>
      {/* TITLE */}
      <Text style={styles.title}>{data.title}</Text>

      {/* ROWS */}
      {data.options.map((opt, index) => (
        <View key={index} style={styles.rowContainer}>
          {/* 1. LEFT LABEL (Fixed Width) */}
          <Text style={styles.optionText}>{opt.label}</Text>

          {/* 2. FLEXIBLE BAR AREA */}
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  width: `${opt.percent}%`,
                  backgroundColor: getColor(index, data.options.length),
                },
              ]}
            />
            {/* Percentage text moves with the width of the bar above */}
            <Text style={styles.percentageText}>
              {opt.percent}%
            </Text>
          </View>

          {/* 3. RIGHT "X of X" (Fixed Width/Aligned Right) */}
          <Text style={styles.countText}>
            {opt.percentageText ?? ""}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default BarChart;