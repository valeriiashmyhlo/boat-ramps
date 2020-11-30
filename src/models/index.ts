import { Models } from "@rematch/core";
import { createModel } from "@rematch/core";
import { Feature, Optional } from "../types";

export interface RootModel extends Models<RootModel> {
  features: typeof features;
}

type FeaturesState = {
  features: Feature[];
  error: Optional<Error>;
};

const initialState: FeaturesState = {
  features: [],
  error: null,
};

const features = createModel<RootModel>()({
  state: initialState,
  reducers: {
    setFeatures(state, payload: Feature[]) {
      return { ...state, features: payload };
    },
  }
});

export const models: RootModel = { features };
