import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

import { Action, setFeatures } from "./actions";
import { MaterialCounts, Optional, SizeCounts } from "./types";
import React, { Dispatch, useCallback, useState } from "react";

import { ChartSection } from "./components/chartSection";
import { Map } from "./components/mapSection";
import { RootState } from "./rootReducer";
import { createSelector } from "reselect";
import { style } from "typestyle";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "./reducers/features.reducer";

const app = style({
  display: "flex",
  textAlign: "center",
});

const featuresSelector = (s: RootState) => s.features.features;

const materialsSelector = createSelector(featuresSelector, (data) =>
  data.map((item) => item.properties.material)
);

const areaSelector = createSelector(featuresSelector, (data) =>
  data.map((item) => item.properties.area_)
);

const materialCountSelector = createSelector(materialsSelector, (materials) => {
  const counts: MaterialCounts = {};

  for (const m of materials) {
    if (!(m in counts)) {
      counts[m] = 0;
    }
    counts[m] += 1;
  }
  return counts;
});

const sizeCountSelector = createSelector(areaSelector, (areas) => {
  const counts: SizeCounts = {
    "[0, 50]": {
      range: [0, 50],
      value: 0,
      color: "#1a3177",
    },
    "[50, 200]": {
      range: [50, 200],
      value: 0,
      color: "#79c7e3",
    },
    "[200, 526]": {
      range: [200, 526],
      value: 0,
      color: "#119399",
    },
  };

  for (const a of areas) {
    for (const k in counts) {
      const [min, max] = counts[k].range;
      if (min < a && a <= max) {
        counts[k].value += 1;
      }
    }
  }

  for (const k in counts) {
    if (counts[k].value === 0) delete counts[k];
  }

  return counts;
});

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
  const materialCounts = useTypedSelector(materialCountSelector);
  const sizeCounts = useTypedSelector(sizeCountSelector);

  const dispatch = useDispatch<Dispatch<Action>>();
  const dispatchFeatures = useCallback((features) => dispatch(setFeatures(features)), [dispatch]);
  const [materialFilter, setMaterialFilter] = useState<Optional<string>>(null);
  const [sizeFilter, setSizeFilter] = useState<Optional<[number, number]>>(null);

  return (
    <div className={app}>
      <Map setFeatures={dispatchFeatures} filter={getMapboxFilter(materialFilter, sizeFilter)} />
      <ChartSection
        setFilterMaterial={setMaterialFilter}
        setFilterSize={setSizeFilter}
        materialsCounts={materialCounts}
        sizeCounts={sizeCounts}
      />
    </div>
  );
};

export default App;
