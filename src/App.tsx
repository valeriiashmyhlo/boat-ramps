import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

import { Action, setFeatures } from "./actions";
import { Feature, MaterialCounts, Optional, SizeCounts } from "./types";
import React, { Dispatch, useCallback, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { ChartSection } from "./components/chartSection";
import { Map } from "./components/mapSection";
import { RootState } from "./rootReducer";

export const useStateSelector: TypedUseSelectorHook<RootState> = useSelector;

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

const App: React.FC = () => {
  const features = useStateSelector((s) => s.features.features);
  const dispatch = useDispatch<Dispatch<Action>>();
  const dispatchFeatures = useCallback((features) => dispatch(setFeatures(features)), [dispatch]);
  const [filterMaterial, setFilterMaterial] = useState<Optional<string>>(null);
  const [filterSize, setFilterSize] = useState<Optional<[number, number]>>(null);
  const materialsCounts = countMaterial(features);
  const sizeCounts = countSize(features);

  return (
    <div className="App">
      <Map setFeatures={dispatchFeatures} filter={getMapboxFilter(filterMaterial, filterSize)} />
      <ChartSection
        setFilterMaterial={setFilterMaterial}
        setFilterSize={setFilterSize}
        materialsCounts={materialsCounts}
        sizeCounts={sizeCounts}
      />
    </div>
  );
};

export default App;
