import { Feature } from "../types";

export const fetchFeatures = async (): Promise<Feature[]> => {
  const response = await fetch("./boat_ramps.geojson");
  const { features } = await response.json();

  return features;
};
