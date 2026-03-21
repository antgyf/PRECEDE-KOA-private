import { Text, View } from "@react-pdf/renderer";
import { columnStyles, columnConfig } from "./ColumnStyles";

interface TableHeaderProps {
  currentLang: string; // "en" | "zh"
}
  
const TableHeader: React.FC<TableHeaderProps> = ({ currentLang }) => {
  const headers = [
    "Study ID",
    "Name",
    "Age",
    "Sex",
    "Ethnicity",
    "BMI(kg/m²)",
  ];

  const chHeaders = [
    "研究编号",
    "姓名",
    "年龄",
    "性别",
    "种族",
    "BMI(kg/m²)",
  ];

  const displayedHeaders = currentLang === "zh" ? chHeaders : headers;

  return (
    <View style={columnStyles.headerRow}>
      {displayedHeaders.map((header, index) => {
        const isShort = columnConfig[index].width === "short";
        const style = isShort
          ? columnStyles.headerShortCell
          : columnStyles.headerCell;

        return (
          <Text key={index} style={style}>
            {header}
          </Text>
        );
      })}
    </View>
  );
};

export default TableHeader;