export const colorScheme = [
  "#1B5E20", // Dark Green (None)
  "#8BC34A", // Light Green (Slight)
  "#CC9900", // Darker Yellow (Moderate)
  "#FF9800", // Orange (Severe)
  "#D50000", // Vivid Red (Extreme)
];

export const colorScheme6 = [
  "#1B5E20", // Dark Green (None)
  "#66BB6A", // Medium Green (Very Mild)
  "#8BC34A", // Light Green (Mild)
  "#CC9900", // Darker Yellow (Moderate)
  "#FF9800", // Orange (Severe)
  "#D50000", // Vivid Red (Extreme)
];

export const colorScheme7 = [
  "#1B5E20", // Dark Green (None)
  "#66BB6A", // Medium Green (Very Mild)
  "#8BC34A", // Light Green (Mild)
  "#CC9900", // Darker Yellow (Moderate)
  "#FF9800", // Orange (Severe)
  "#FF5722", // Deep Orange (Very Severe)
  "#D50000", // Vivid Red (Extreme)
];

export const startColor = "#1B5E20"; // Dark Green
export const endColor = "#D50000";   // Vivid Red
// Generate a gradient of colors between start and end colors

export const generateGradientColors = (steps: number, start: string, end: string): string[] => {
  return Array.from({ length: steps }, (_, i) =>
    interpolateColor(start, end, i / (steps - 1))
  );
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Interpolate between two hex colors
const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff;
  const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff;

  const r = Math.round(lerp(r1, r2, factor));
  const g = Math.round(lerp(g1, g2, factor));
  const b = Math.round(lerp(b1, b2, factor));

  return `rgb(${r}, ${g}, ${b})`;
};