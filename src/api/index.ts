import { Feature } from "../types";

export const fetchFeatures = async (): Promise<Feature[]> => {
  try {
    const response = await fetch("./boat_ramps.geojson");
    const { features } = await response.json();

    return features;
  } catch (error) {
    throw error;
  }
};
