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

const creatStyles = (lang: string) =>
  StyleSheet.create({
  title: {
    fontSize: 10,
    fontWeight: "bold",
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
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: 15,
    overflow: "hidden",
    position: "relative",
  },
  bar: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    fontSize: 9,
    width: 90,
    marginLeft: 3,
    fontFamily: getFontFamily(lang),
  },
});

interface BarChartProps {
  data: BarChartData;
  lang: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, lang }) => {
  const styles = creatStyles(lang);

  return (
    <View>
      <Text style={styles.title}>{data.title}</Text>
      {data.options.map((opt, index) => {

        return (
          <View key={index} style={styles.rowContainer}>
            <Text style={styles.optionText}>{opt.label}</Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${opt.percent}%`,
                    backgroundColor: data.options.length === 5 
                    ? colorScheme[index % colorScheme.length] 
                    : data.options.length === 6
                    ? colorScheme6[index % 6]
                    : data.options.length === 7
                    ? colorScheme7[index % 7]
                    : colorScheme[index % colorScheme.length],
                  },
                ]}
              ></View>
            </View>
            <Text style={styles.percentageText}>{opt.percentageText}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default BarChart;
