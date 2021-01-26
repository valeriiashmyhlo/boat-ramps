import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

import { Filters, Optional, Range } from "./types";
import { QueryParamConfig, StringParam, useQueryParam } from "use-query-params";
import React, { useEffect, useMemo, useState } from "react";

import { ChartSection } from "./components/chartSection";
import { LngLatBounds } from "mapbox-gl";
import { Map } from "./components/mapSection";
import { fetchFeatures } from "./api";
import { filteredDataSelector } from "./app.selector";
import { setFeatures } from "./actions";
import { style } from "typestyle";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "./reducers/features.reducer";

const app = style({
  display: "flex",
  textAlign: "center",
});

const RangeParam: QueryParamConfig<Optional<Range>> = {
  encode: (val) => val && `${val[0]},${val[1]}`,
  decode: (input) => {
    if (input === undefined || input === null || input instanceof Array) {
      return null;
    }
    const a = input.split(",");
    if (a.length !== 2) {
      return null;
    }
    const range = a.map(Number);
    if (range.some(isNaN)) {
      return null;
    }
    return [range[0], range[1]];
  },
};

const useFilters = (): [
  Filters,
  (material: Optional<string>) => void,
  (size: Optional<Range>) => void,
  (bounds: Optional<LngLatBounds>) => void
] => {
  const [material, setMaterial] = useQueryParam("material", StringParam);
  const [size, setSize] = useQueryParam("range", RangeParam);
  const [bounds, setBounds] = useState<Optional<LngLatBounds>>(null);
  const filters: Filters = useMemo(
    () => ({
      size,
      material,
      bounds,
    }),
    [size, material, bounds]
  );

  return [filters, setMaterial, setSize, setBounds];
};

const App = () => {
  const dispatch = useDispatch();
  const [filters, setMaterial, setSize, setBounds] = useFilters();
  const data = useTypedSelector((s) => filteredDataSelector(s, filters));

  useEffect(() => {
    fetchFeatures().then((features) => dispatch(setFeatures(features)));
  }, []);

  return (
    <div className={app}>
      <Map data={data.features} onBoundsChange={setBounds} />
      <ChartSection
        setFilterMaterial={setMaterial}
        setFilterSize={setSize}
        materialsCounts={data.materialCount}
        sizeCounts={data.sizeCount}
      />
    </div>
  );
};

export default App;
