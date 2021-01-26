import { Filters, MaterialCounts, SizeCounts } from "./types";

import { RootState } from "./rootReducer";
import { createSelector } from "reselect";

const filteredFeaturesSelector = createSelector(
  (s: RootState) => s.features.features,
  (_: RootState, filters: Filters) => filters,
  (features, filters) => {
    const { size, material, bounds } = filters;

    if (size) {
      features = features.filter(
        (d) => size[0] <= d.properties.area_ && d.properties.area_ <= size[1]
      );
    }

    if (material) {
      features = features.filter((f) => f.properties.material === material);
    }

    if (bounds) {
      features = features.filter((f) => bounds.contains(f.geometry.coordinates[0][0][0]));
    }

    return features;
  }
);

const materialCountSelector = createSelector(filteredFeaturesSelector, (data) =>
  data
    .map((item) => item.properties.material)
    .reduce(
      (counts: MaterialCounts, m) => ({
        ...counts,
        [m]: m in counts ? counts[m] + 1 : 1,
      }),
      {}
    )
);

const sizeOptions: SizeCounts = [
  {
    range: [0, 50],
    color: "#1a3177",
  },
  {
    range: [50, 200],
    color: "#79c7e3",
  },
  {
    range: [200, 526],
    color: "#119399",
  },
];

const sizeCountSelector = createSelector(filteredFeaturesSelector, (data) => {
  const areas = data.map((item) => item.properties.area_);

  return sizeOptions.map((opt) => ({
    ...opt,
    label: `[${String(opt.range)}]`,
    value: areas.filter((val) => opt.range[0] <= val && val <= opt.range[1]).length,
  }));
});

export const filteredDataSelector = createSelector(
  filteredFeaturesSelector,
  materialCountSelector,
  sizeCountSelector,
  (features, materialCount, sizeCount) => ({ features, materialCount, sizeCount })
);
