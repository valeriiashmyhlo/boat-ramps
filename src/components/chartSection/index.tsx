import { HorizontalBarSeries, RadialChart, XAxis, XYPlot, YAxis } from "react-vis";
import { MaterialCounts, Optional, SizeCounts } from "../../types";
import React, { useState } from "react";
import { percent, px } from "csx";

import { style } from "typestyle";

const chartContainer = style({
  width: percent(50),
  padding: px(20),
});

const mb20 = style({
  marginBottom: px(20),
});

const radialChartStyles = style({
  position: "relative",
  padding: "30px",
  margin: "0 auto",
});

const barChartStyles = style({
  width: "100%",
  margin: "0 auto",
});

const radialChartLabel = style({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  top: 140,
  right: "37%",
  height: 80,
  width: 90,
  flexDirection: "column",
  color: "#6b6b76",
});

const chartAnnotation = style({
  display: "flex",
  alignItems: "baseline",
});

const ChartSection: React.FC<{
  setFilterMaterial: (filterMaterial: Optional<string>) => void;
  setFilterSize: (filterSize: Optional<[number, number]>) => void;
  materialsCounts: MaterialCounts;
  sizeCounts: SizeCounts;
}> = ({ setFilterMaterial, setFilterSize, materialsCounts, sizeCounts }) => {
  const [selectedRange, setRange] = useState<string>("All");
  // Todo: useMemo
  const materialsChartData = Object.keys(materialsCounts).map((k) => ({
    y: k,
    x: materialsCounts[k],
  }));
  const sizesChartData = Object.keys(sizeCounts).map((k) => ({
    angle: sizeCounts[k].value,
    label: k,
    style: {
      fill: sizeCounts[k].color,
      strokeWidth: 0,
    },
  }));

  return (
    <div className={chartContainer}>
      <div className={mb20}>Drag the map to populate results</div>
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
        className={barChartStyles}
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
      <RadialChart
        animation
        onValueClick={(datapoint) => {
          setFilterSize(sizeCounts[datapoint.label!].range);
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
        className={radialChartStyles}
      >
        <>
          <div className={radialChartLabel}>
            {selectedRange}
            <br />
            <>sizes shown</>
          </div>
        </>
      </RadialChart>
      <div>
        {Object.keys(sizeCounts).map((k) => (
          <div key={k} className={chartAnnotation}>
            <span
              style={{
                display: "block",
                width: "10px",
                height: "10px",
                backgroundColor: sizeCounts[k].color,
              }}
            />
            - {k}
          </div>
        ))}
      </div>
    </div>
  );
};

export { ChartSection };
