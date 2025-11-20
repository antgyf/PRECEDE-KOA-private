import { StyleSheet } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";

Font.register({
  family: "NotoSansSC",
  fonts: [
    {
      src: "/fonts/NotoSansSC-Regular.ttf",
    },
    {
      src: "/fonts/NotoSansSC-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

export const columnStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "1pt solid #ddd",
    paddingVertical: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEE",
    paddingVertical: 5,
    borderBottom: "2pt solid #333",
  },
  shortcell: {
    width: "10%",
    paddingHorizontal: 2,
    textAlign: "center",
    fontFamily: "NotoSansSC",
  },
  longcell: {
    width: "18%",
    paddingHorizontal: 2,
    textAlign: "center",
    fontFamily: "NotoSansSC",
  },
  headerCell: {
    width: "18%",
    paddingHorizontal: 2,
    textAlign: "center",
    fontFamily: "NotoSansSC",
    fontWeight: "bold",
  },
  headerShortCell: {
    width: "10%",
    paddingHorizontal: 2,
    textAlign: "center",
    fontFamily: "NotoSansSC",
    fontWeight: "bold",
  },
});

// Define which columns are short vs long
export const columnConfig = [
  { key: "patientid", width: "short" },
  { key: "fullname", width: "long" },
  { key: "age", width: "long" },
  { key: "sex", width: "long" },
  { key: "ethnicity", width: "long" },
  { key: "bmi", width: "long" },
  { key: "surgeontitle", width: "long" },
];