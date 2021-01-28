import "mapbox-gl/dist/mapbox-gl.css";

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

export const RangeParam: QueryParamConfig<Optional<Range>> = {
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

export const useFilters = () => {
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

  return [filters, { setMaterial, setSize, setBounds }] as const;
};

type R<T> = {
  data: Optional<T>;
  isLoading: boolean;
  error: Optional<Error>;
};

function useFetchApi<T>(call: () => Promise<T>): R<T> {
  const [result, setResult] = useState<R<T>>({ data: null, isLoading: false, error: null });

  useEffect(() => {
    (async () => {
      setResult((res) => ({ ...res, isLoading: true }));
      try {
        const data = await call();
        setResult((res) => ({ ...res, data: data, error: null }));
      } catch (e) {
        setResult((res) => ({ ...res, error: e }));
      } finally {
        setResult((res) => ({ ...res, isLoading: false }));
      }
    })();
  }, [call]);

  return result;
}

const App = () => {
  const dispatch = useDispatch();
  const [filters, { setBounds, setMaterial, setSize }] = useFilters();
  const data = useTypedSelector((s) => filteredDataSelector(s, filters));

  useEffect(() => {
    fetchFeatures().then((features) => dispatch(setFeatures(features)));
  }, [dispatch]);

  const result = useFetchApi(fetchFeatures);

  return (
    <div className={app}>
      <Map data={data.features} onBoundsChange={setBounds} />
      <ChartSection
        setFilterMaterial={setMaterial}
        setFilterSize={setSize}
        materialsCounts={data.materialCount}
        sizeCounts={data.sizeCount}
        selectedRange={filters.size}
      />
    </div>
  );
};

export default App;
