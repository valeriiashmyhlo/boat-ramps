import { Doughnut, HorizontalBar } from "react-chartjs-2";
import { MaterialCounts, Optional, SizeCounts } from "../../types";

import React from "react";

const ChartSection: React.FC<{
  setFilterMaterial: (filterMaterial: Optional<string>) => void;
  setFilterSize: (filterSize: Optional<[number, number]>) => void;
  materialsCounts: MaterialCounts;
  sizeCounts: SizeCounts;
}> = ({ setFilterMaterial, setFilterSize, materialsCounts, sizeCounts }) => {
  const materialsChartData = {
    labels: Object.keys(materialsCounts),
    datasets: [
      {
        label: "Number of ramps per construction material",
        data: Object.values(materialsCounts),
        borderWidth: 1,
      },
    ],
  };
  const sizesChartData = {
    labels: Object.keys(sizeCounts),
    datasets: [
      {
        data: Object.values(sizeCounts).map((item) => item.value),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const onMaterialSelect = (_: never, elem: { _index: number }[]) => {
    if (elem.length === 0) return;
    const material = materialsChartData.labels[elem[0]._index];
    setFilterMaterial(material);
  };

  const onSizeSelect = (e: any, elem: { _index: number }[]) => {
    if (elem.length === 0) return;

    const range = sizesChartData.labels[elem[0]._index];
    setFilterSize(sizeCounts[range].range);
  };

  return (
    <div style={{ width: "50%", padding: "20px" }}>
      <div style={{ paddingBottom: "20px" }}>Drag the map to populate results</div>
      <button onClick={() => setFilterMaterial(null)} type="button">
        Reset Materials
      </button>
      <HorizontalBar
        data={materialsChartData}
        options={{
          onClick: onMaterialSelect,
        }}
      />
      <button onClick={() => setFilterSize(null)} type="button">
        Reset Range
      </button>
      <Doughnut
        data={sizesChartData}
        options={{
          onClick: onSizeSelect,
          legend: {
            onClick: (_: never, { text }: { text: string }) =>
              setFilterSize(sizeCounts[text].range),
          },
        }}
      />
    </div>
  );
};

export { ChartSection };
