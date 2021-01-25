import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

import { Action, setFeatures } from "./actions";
import { Feature, MaterialCounts, Optional, SizeCounts } from "./types";
import React, { Dispatch, useCallback, useEffect, useState } from "react";

import { ChartSection } from "./components/chartSection";
import { LngLatBounds } from "mapbox-gl";
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

type Filters = {
  size: Optional<[number, number]>;
  material: Optional<string>;
  mapBounds: Optional<LngLatBounds>;
};

const filteredFeaturesSelector = createSelector(
  (s: RootState) => s.features.features,
  (_: RootState, filters: Filters) => filters,
  (features, filters) => {
    const { size, material, mapBounds } = filters;

    if (size) {
      features = features.filter(
        (d) => size[0] <= d.properties.area_ && d.properties.area_ <= size[1]
      );
    }

    if (material) {
      features = features.filter((f) => f.properties.material === material);
    }

    if (mapBounds) {
      features = features.filter((f) => mapBounds.contains(f.geometry.coordinates[0][0][0]));
    }

    return features;
  }
);

const materialsSelector = createSelector(filteredFeaturesSelector, (data) =>
  data.map((item) => item.properties.material)
);

const areaSelector = createSelector(filteredFeaturesSelector, (data) =>
  data.map((item) => item.properties.area_)
);

const materialCountSelector = createSelector(materialsSelector, (materials) =>
  materials.reduce(
    (counts: MaterialCounts, m) => ({
      ...counts,
      [m]: m in counts ? counts[m] + 1 : 1,
    }),
    {}
  )
);

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

const fetchFeatures = async (): Promise<Feature[]> => {
  try {
    const response = await fetch("./boat_ramps.geojson");
    const { features } = await response.json();

    return features;
  } catch (error) {
    throw error;
  }
};

const App: React.FC = () => {
  const dispatch = useDispatch<Dispatch<Action>>();
  const dispatchFeatures = useCallback((features) => dispatch(setFeatures(features)), [dispatch]);
  const [materialFilter, setMaterialFilter] = useState<Optional<string>>(null);
  const [sizeFilter, setSizeFilter] = useState<Optional<[number, number]>>(null);
  const [viewportFilter, setViewportFilter] = useState<Optional<LngLatBounds>>(null);

  const filters = {
    size: sizeFilter,
    material: materialFilter,
    mapBounds: viewportFilter,
  };

  const features = useTypedSelector((s) => filteredFeaturesSelector(s, filters));
  const materialCounts = useTypedSelector((s) => materialCountSelector(s, filters));
  const sizeCounts = useTypedSelector((s) => sizeCountSelector(s, filters));

  //Todo: useDeepEffect
  useEffect(() => {
    (async () => {
      const features = await fetchFeatures();
      dispatchFeatures(features);
    })();
  }, []);

  return (
    <div className={app}>
      <Map data={features} onBoundsChange={setViewportFilter} />
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
