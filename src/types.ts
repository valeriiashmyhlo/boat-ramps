import mapboxgl from "mapbox-gl";

export interface Feature extends mapboxgl.MapboxGeoJSONFeature {
  geometry: mapboxgl.MapboxGeoJSONFeature["geometry"] & {
    type: "MultiPolygon";
    coordinates: [];
  };
  properties: {
    material: string;
    area_: number;
  };
}

export type Optional<T> = T | null;

export type SizeCounts = {
  [key: string]: { range: [number, number]; value: number; color?: string };
};

export type MaterialCounts = { [key: string]: number };
