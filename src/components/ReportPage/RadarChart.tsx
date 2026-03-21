import { useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { colorScheme } from "../../models/UI/Color";
import { RadarDataPoint } from "../../models/patient/patientReport";
import { Questions } from "../../models/patient/patientDetails";

interface RadarChartPDFProps {
  onImageGenerated: (img: string) => void;
  radarData: RadarDataPoint[];
}

const maxValue = 5;
const levels = 5;
const radius = 160;
const cx = 400;
const cy = 350;

const angleForIndex = (i: number, total: number) =>
  (Math.PI * 2 * i) / total - Math.PI / 2;

const getPoint = (angle: number, value: number, scale: number) => {
  const r = (value / scale) * radius;
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
};

const remapInitial = (question: number, initial: number) => {
  if (question === 2) {
    if (initial >= 3) return initial - 1;
  }
  else if (question === 3) { 
    if (initial === 3) return 2;
    if (initial === 4 || initial === 5) return 3;
    if (initial === 6) return 4;
  }
  return initial;
}

const RadarChartCustom: React.FC<RadarChartPDFProps> = ({
  onImageGenerated,
  radarData,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    html2canvas(chartRef.current, { scale: 0.7 }).then((canvas) => {
      const image = canvas.toDataURL("image/png");
      onImageGenerated(image);
    });
  }, []);

  const dataCount = radarData.length;

  const levelPolygons = Array.from({ length: levels }, (_, levelIndex) => {
    const levelValue = ((levelIndex + 1) / levels) * maxValue;
    const points = Array.from({ length: dataCount }, (_, i) => {
      const angle = angleForIndex(i, dataCount);
      const { x, y } = getPoint(angle, levelValue, maxValue);
      return `${x},${y}`;
    }).join(" ");
    
    return (
      <polygon
        key={levelIndex}
        points={points}
        fill="none"
        stroke={colorScheme[colorScheme.length - 1 - levelIndex]}
        strokeWidth={1}
        strokeOpacity={0.7}
        strokeDasharray="4"
      />
    );
  });

  const axisLines = Array.from({ length: dataCount }, (_, i) => {
    const angle = angleForIndex(i, dataCount);
    const start = getPoint(angle, 1, maxValue);
    const end = getPoint(angle, maxValue, maxValue);
    return (
      <line
        key={i}
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="#aaa"
        strokeWidth={1}
      />
    );
  });

  const getQuestionByName = (id: number): string | undefined => {
    const found = Questions.find((q) => q.id === id);
    return found ? found.description : undefined;
  };

  const formatLabel = (id: number) => {
    const label = getQuestionByName(id) || String(id);
    const trimmed = label.startsWith("Your ")
      ? label.replace("Your ", "")
      : label;
    const noQuestionMark = trimmed.replace(/\?$/, "");
    return noQuestionMark.charAt(0).toUpperCase() + noQuestionMark.slice(1);
  };

  const labelOffset = radius + 130;
  const labels = Array.from({ length: dataCount }, (_, i) => {
    const angle = angleForIndex(i, dataCount);
    const { x, y } = getPoint(angle, labelOffset, radius);
    const mainLabel = formatLabel(radarData[i].questionid);

    const maxLen = 20;
    let line1 = mainLabel;
    let line2 = "";
    const isTooLong = mainLabel.length > maxLen;

    if (isTooLong) {
      let splitPoint = mainLabel.lastIndexOf(" ", maxLen);
      if (splitPoint === -1) splitPoint = maxLen;
      line1 = mainLabel.slice(0, splitPoint).trim();
      line2 = mainLabel.slice(splitPoint).trim();
    }

    return (
      <text
        key={i}
        x={x}
        y={y}
        fontSize={18}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#333"
      >   
        <tspan x={x} dy="0">
          {line1}
        </tspan>
        {isTooLong && (
          <tspan x={x} dy="1.2em">
            {line2}
          </tspan>
        )}
        <tspan x={x} dy="1.2em">
          ({radarData[i].n} similar patients)
        </tspan>
      </text>
    );
  });

  const makeDataPolygon = (
    data: RadarDataPoint[],
    valueKey: "initial" | "median",
    maxValue: number
  ): string[] => {

    if (dataCount === 0) return [];

    if (valueKey === "initial") {
      return data.map((d, i) => {
        const angle = angleForIndex(i, dataCount);
        const invertedValue = maxValue - remapInitial(d.questionid, d[valueKey]);
        const { x, y } = getPoint(angle, invertedValue, maxValue);
        return `${x},${y}`;
      });
    }

    if (data.length < dataCount) {
      return [];
    }

    const segments: string[] = [];
    let currentSegment: string[] = [];

    const points = data.map((d, i) => {
      const angle = angleForIndex(i, dataCount);
      const invertedValue = maxValue - remapInitial(d.questionid, d[valueKey]);
      const { x, y } = getPoint(angle, invertedValue, maxValue);
      return { index: i, coord: `${x},${y}`, n: d.n };
    });

    const firstPoint = points[0];
    const lastOriginalPoint = points[points.length - 1];
    points.push(firstPoint);

    const isValid = (point: { n: number }) => point.n > 0;

    for (let i = 0; i < points.length; i++) {
      const point = points[i];

      if (isValid(point)) {
        currentSegment.push(point.coord);
      } else {
        if (currentSegment.length > 0) {
          segments.push(currentSegment.join(" "));
          currentSegment = [];
        }
      }
    }

    if (currentSegment.length > 0) {
      if (isValid(firstPoint) && isValid(lastOriginalPoint)) {
        if (segments.length > 0) {
          const firstSegmentCoords = segments[0].split(" ");
          const mergedSegment = [...currentSegment, ...firstSegmentCoords].join(" ");
          segments[0] = mergedSegment;
        } else {
          segments.push(currentSegment.join(" "));
        }
      } else {
        segments.push(currentSegment.join(" "));
      }
    }

    return segments;
  };

  const initialPolygon = makeDataPolygon(radarData, "initial", maxValue);
  const medianPolygon = makeDataPolygon(radarData, "median", maxValue);

  return (
    <div ref={chartRef} style={{ width: "800px", height: "700px" }}>
      <svg width={800} height={700}>
        <g>
          {/* Grid levels */}
          {levelPolygons}

          {/* Axis lines */}
          {axisLines}

          {/* Axis labels */}
          {labels}

          {/* Data polygon */}
          <polygon
            points={initialPolygon.join(" ")}
            fill="none"
            fillOpacity={0.6}
            stroke="#00BFFF"
            strokeWidth={3}
          />
          {initialPolygon.map((point, index) => {
            const [x, y] = point.split(",").map((coord) => coord.trim());
            return (
              <circle
                key={index}
                cx={parseFloat(x)}
                cy={parseFloat(y)}
                r={6}
                fill="#00BFFF"
              />
            );
          })}

          {medianPolygon.map((segment, i) => (
            <polyline
              key={i}
              points={segment}
              fill="none"
              fillOpacity={0.6}
              stroke="#003f5c"
              strokeWidth={3}
            />
          ))}

          {/* Render nodes at each point */}
          {medianPolygon.map((segment, i) => {
            return segment.split(" ").map((point, j) => {
              const [x, y] = point.split(",");
              return (
                <circle
                  key={`${i}-${j}`}
                  cx={parseFloat(x)}
                  cy={parseFloat(y)}
                  r={6}
                  fill="#003f5c"
                />
              );
            });
          })}
        </g>
      </svg>
    </div>
  );
};

export default RadarChartCustom;