import mapboxgl from "mapbox-gl";

export interface Feature extends mapboxgl.MapboxGeoJSONFeature {
  properties: {
    material: string;
    area_: number;
  };
}

export type Optional<T> = T | null;
