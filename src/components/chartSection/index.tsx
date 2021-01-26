import { HorizontalBarSeries, RadialChart, XAxis, XYPlot, YAxis } from "react-vis";
import { MaterialCounts, Optional, Range, SizeCounts } from "../../types";
import React, { useMemo, useState } from "react";

import styles from "./styles";

type ChartSectionProps = {
  setFilterMaterial: (filterMaterial: Optional<string>) => void;
  setFilterSize: (filterSize: Optional<Range>) => void;
  materialsCounts: MaterialCounts;
  sizeCounts: SizeCounts;
};

const ChartSection = ({
  setFilterMaterial,
  setFilterSize,
  materialsCounts,
  sizeCounts,
}: ChartSectionProps) => {
  const [selectedRange, setRange] = useState<string>("All");

  const materialsChartData = useMemo(
    () =>
      Object.keys(materialsCounts).map((k) => ({
        y: k,
        x: materialsCounts[k],
      })),
    [materialsCounts]
  );
  const sizesChartData = useMemo(
    () =>
      sizeCounts.map((i) => ({
        angle: i.value,
        label: i.label,
        style: {
          fill: i.color,
          strokeWidth: 0,
        },
      })),
    [sizeCounts]
  );

  return (
    <div className={styles.chartContainer}>
      <div className={styles.mb20}>Drag the map to populate results</div>
      <button onClick={() => setFilterMaterial(null)} type="button">
        Reset Materials
      </button>
      <XYPlot
        yType="ordinal"
        xDomain={[0, Math.max(...Object.values(materialsCounts))]}
        color="grey"
        height={300}
        width={550}
        margin={{ left: 115, right: 10, top: 10, bottom: 40 }}
        className={styles.barChartStyles}
      >
        <XAxis
          style={{
            text: { stroke: "none", fill: "#6b6b76", fontSize: 12.5 },
          }}
        />
        <YAxis
          left={9}
          style={{
            text: { stroke: "none", fill: "#6b6b76", fontSize: 12.5 },
          }}
        />
        <HorizontalBarSeries
          onValueClick={(datapoint) => setFilterMaterial(datapoint.y as string)}
          data={materialsChartData}
          barWidth={0.75}
          opacity={0.3}
        />
      </XYPlot>
      <button
        onClick={() => {
          setFilterSize(null);
          setRange("All");
        }}
        type="button"
      >
        Reset Range
      </button>
      <div className={styles.RadialChartWrap}>
        <RadialChart
          animation
          onValueClick={(datapoint) => {
            const selected = sizeCounts.find((s) => datapoint.label === s.label);
            selected && setFilterSize(selected.range);
            setRange(datapoint.label!);
          }}
          data={sizesChartData}
          width={300}
          height={300}
          innerRadius={80}
          radius={150}
          padAngle={0.02}
          colorType="literal"
          labelsRadiusMultiplier={1.2}
          className={styles.radialChartStyles}
        >
          <>
            <div className={styles.radialChartLabel}>
              {selectedRange}
              <br />
              <>sizes shown</>
            </div>
          </>
        </RadialChart>
        <div>
          {sizeCounts.map((s) => (
            <div key={s.label} className={styles.chartAnnotation}>
              <span className={styles.annotation} style={{ backgroundColor: s.color }} />-{" "}
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ChartSection };
