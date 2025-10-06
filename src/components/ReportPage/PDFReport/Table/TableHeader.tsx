import { Text, View } from "@react-pdf/renderer";
import { columnStyles, columnConfig } from "./ColumnStyles";

const TableHeader: React.FC = () => {
  const headers = [
    "Study ID",
    "Name",
    "Age",
    "Sex",
    "Ethnicity",
    "BMI(kg/m²)",
    "Surgeon Title",
  ];

  return (
    <View style={columnStyles.headerRow}>
      {headers.map((header, index) => {
        const isShort = columnConfig[index].width === "short";
        const style = isShort ? columnStyles.headerShortCell : columnStyles.headerCell;
        
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