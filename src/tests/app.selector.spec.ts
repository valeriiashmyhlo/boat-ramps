import {
  filteredDataSelector,
  filteredFeaturesSelector,
  materialCountSelector,
  sizeCountSelector,
} from "../app.selector";

import { Feature } from "../types";
import { LngLatBounds } from "mapbox-gl";

const f1: Feature = {
  type: "Feature",
  geometry: {
    type: "MultiPolygon",
    coordinates: [[[[153, -27]]]],
  },
  properties: {
    material: "Concrete",

    area_: 40.4,
  },
};
const f2: Feature = {
  type: "Feature",
  geometry: {
    type: "MultiPolygon",
    coordinates: [[[[111, 222]]]],
  },
  properties: {
    material: "Gravel",

    area_: 184.4,
  },
};
const f3: Feature = {
  type: "Feature",
  geometry: {
    type: "MultiPolygon",
    coordinates: [[[[111, 222]]]],
  },
  properties: {
    material: "Other",

    area_: 210.4,
  },
};
const range1 = {
  range: [0, 50],
  color: "#1a3177",
  label: "[0,50]",
  value: 0,
};
const range2 = {
  range: [50, 200],
  color: "#79c7e3",
  label: "[50,200]",
  value: 0,
};
const range3 = {
  range: [200, 526],
  color: "#119399",
  label: "[200,526]",
  value: 0,
};

test("filteredFeaturesSelector should return list of filtered features", () => {
  const bounds = {
    sw: [1, 2],
    ne: [3, 4],
    contains: jest.fn(),
  };
  expect(
    filteredFeaturesSelector(
      { features: { features: [f1, f2, f2, f2] } },
      { size: null, material: "Gravel", bounds: null }
    )
  ).toEqual([f2, f2, f2]);
  expect(
    filteredFeaturesSelector(
      { features: { features: [f1, f2, f2, f2] } },
      { size: [50, 200], material: "Gravel", bounds: null }
    )
  ).toEqual([f2, f2, f2]);
  expect(
    filteredFeaturesSelector(
      { features: { features: [f1, f2, f2, f2] } },
      { size: [50, 200], material: "Concrete", bounds: null }
    )
  ).toEqual([]);
  expect(
    filteredFeaturesSelector(
      { features: { features: [f1, f2, f2, f2] } },
      { size: [50, 200], material: "Gravel", bounds: (bounds as unknown) as LngLatBounds }
    )
  ).toEqual([]);
});

test("materialCountSelector should return counted materials according to the filter", () => {
  expect(
    materialCountSelector(
      { features: { features: [f1, f2, f2, f2] } },
      { size: null, material: "Gravel", bounds: null }
    )
  ).toEqual({ Gravel: 3 });
  expect(
    materialCountSelector(
      { features: { features: [f1, f2, f2, f2] } },
      { size: null, material: "Concrete", bounds: null }
    )
  ).toEqual({ Concrete: 1 });
  expect(
    materialCountSelector(
      { features: { features: [f1, f2, f2, f2] } },
      { size: null, material: "Other", bounds: null }
    )
  ).toEqual({});
});

test("sizeCountSelector should return counted size according to the filter", () => {
  expect(
    sizeCountSelector(
      { features: { features: [f1, f2, f2, f2] } },
      { size: [0, 50], material: null, bounds: null }
    )
  ).toEqual([{ ...range1, value: 1 }, range2, range3]);
  expect(
    sizeCountSelector(
      { features: { features: [f1, f2, f2, f2] } },
      { size: [50, 200], material: null, bounds: null }
    )
  ).toEqual([range1, { ...range2, value: 3 }, range3]);
  expect(
    sizeCountSelector(
      { features: { features: [f1, f2, f2, f2] } },
      { size: [200, 526], material: null, bounds: null }
    )
  ).toEqual([range1, range2, range3]);
});

test("filteredDataSelector", () => {
  expect(
    filteredDataSelector(
      { features: { features: [f1, f2, f2, f2] } },
      { size: [0, 50], material: null, bounds: null }
    )
  ).toEqual({
    features: [f1],
    materialCount: { Concrete: 1 },
    sizeCount: [{ ...range1, value: 1 }, range2, range3],
  });
  expect(
    filteredDataSelector(
      { features: { features: [f1, f2, f2, f3] } },
      { size: [50, 200], material: "Other", bounds: null }
    )
  ).toEqual({
    features: [],
    materialCount: {},
    sizeCount: [range1, range2, range3],
  });
  expect(
    filteredDataSelector(
      { features: { features: [f1, f2, f2, f3] } },
      { size: [200, 526], material: "Other", bounds: null }
    )
  ).toEqual({
    features: [f3],
    materialCount: { Other: 1 },
    sizeCount: [range1, range2, { ...range3, value: 1 }],
  });
});
