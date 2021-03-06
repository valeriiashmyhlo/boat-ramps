import mapboxgl, { LngLatBounds } from "mapbox-gl";
export interface Feature {
  type: "Feature";
  geometry: mapboxgl.MapboxGeoJSONFeature["geometry"] & {
    type: "MultiPolygon";
    coordinates: [number, number][][][];
  };
  properties: {
    material: string;
    area_: number;
  };
}

export type Optional<T> = T | null;

export type SizeCounts = Array<{
  label?: string;
  range: Range;
  value?: number;
  color?: string;
}>;

export type MaterialCounts = { [key: string]: number };

export type Range = [number, number];

export type Filters = {
  size: Optional<Range>;
  material: Optional<string> | undefined;
  bounds: Optional<LngLatBounds>;
};
