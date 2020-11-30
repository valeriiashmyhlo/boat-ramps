import React, { useState, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGL, { Source, Layer, InteractiveMap } from "react-map-gl";
import { HorizontalBar, Doughnut } from "react-chartjs-2";
import { connect } from "react-redux";
import "./App.css";
import mapboxgl from "mapbox-gl";
import { Feature, Optional } from "./types";
import { Dispatch, RootState } from "./store";

type MaterialCounts = { [key: string]: number };
const countMaterial = (data: Feature[]): MaterialCounts => {
  const materials = data.map((item) => item.properties.material);
  const counts: MaterialCounts = {};

  for (const m of materials) {
    if (!(m in counts)) {
      counts[m] = 0;
    }
    counts[m] += 1;
  }
  return counts;
};

type SizeCounts = { [key: string]: { range: [number, number]; value: number } };
const countSize = (data: Feature[]): SizeCounts => {
  const areas = data.map((item) => item.properties.area_);
  const counts: SizeCounts = {
    "[0, 50]": {
      range: [0, 50],
      value: 0,
    },
    "[50, 200]": {
      range: [50, 200],
      value: 0,
    },
    "[200, 526]": {
      range: [200, 526],
      value: 0,
    },
  };

  for (const a of areas) {
    for (const k of Object.keys(counts)) {
      const [min, max] = counts[k].range;
      if (min < a && a <= max) {
        counts[k].value += 1;
      }
    }
  }

  return counts;
};

const getMapboxFilter = (
  filterMaterial: Optional<string>,
  filterSize: Optional<[number, number]>
): any[] => {
  const filters: any[] = ["all"];

  if (filterSize) {
    filters.push(["<=", filterSize[0], ["get", "area_"]], ["<=", ["get", "area_"], filterSize[1]]);
  }
  if (filterMaterial) {
    filters.push(["==", ["get", "material"], filterMaterial]);
  }

  return filters;
};

const App: React.FC<{
  setFeatures: (features: Feature[]) => void;
  features: Feature[];
}> = ({ setFeatures, features }) => {
  const [viewport, setViewport] = useState({
    width: 800,
    height: 790,
    latitude: -28.016666,
    longitude: 153.399994,
    zoom: 8,
  });
  const [filterMaterial, setFilterMaterial] = useState<Optional<string>>(null);
  const [filterSize, setFilterSize] = useState<Optional<[number, number]>>(null);
  const ref = useRef<InteractiveMap>(null);

  const onViewportChange = () => {
    if (ref.current && ref.current.getMap().getLayer("anything")) {
      const visibleFeatures: mapboxgl.MapboxGeoJSONFeature[] = ref.current.queryRenderedFeatures(
        undefined,
        { layers: ["anything"] }
      );

      if (visibleFeatures.length > 0) {
        setFeatures(visibleFeatures as Feature[]);
      }
    }
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

  const materialsCounts = countMaterial(features);
  const sizeCounts = countSize(features);

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

  return (
    <div className="App">
      <div>
        <ReactMapGL
          ref={ref}
          mapStyle="mapbox://styles/mapbox/light-v9"
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          onLoad={onViewportChange}
          onViewportChange={(newViewport) => {
            onViewportChange();
            setViewport(newViewport);
          }}
        >
          <Source id="goldCoast" type="geojson" data="./boat_ramps.geojson" tolerance={0.00001} />
          <Layer
            id="anything"
            type="symbol"
            paint={{}}
            layout={{
              "icon-image": "star-11",
              "icon-padding": 0,
              "icon-allow-overlap": true,
            }}
            filter={getMapboxFilter(filterMaterial, filterSize)}
            source="goldCoast"
          />
        </ReactMapGL>
      </div>
      <div style={{ width: "50%", padding: "20px" }}>
        <div>Drag the map to populate results</div>
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
    </div>
  );
};

const mapState = ({ features: { features } }: RootState) => ({
  features,
});

const mapDispatch = (dispatch: Dispatch) => ({
  setFeatures: dispatch.features.setFeatures,
});

export default connect(mapState, mapDispatch)(App);
