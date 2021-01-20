import { Feature } from "../types";

export enum ActionTypes {
  SET_FEATURES = "SET_FEATURES",
}

export const setFeatures = (features: Feature[]) => ({
  type: ActionTypes.SET_FEATURES,
  payload: features,
});

export type Action = ReturnType<typeof setFeatures>;
