import { ActionTypes } from "../actions";
import { Feature } from "../types";
import { handleActions } from "redux-actions";

type FeaturesState = {
  features: Feature[];
};

const FEATURES_DEFAULT_STATE: FeaturesState = {
  features: [],
};

export const featuresReducer = handleActions<FeaturesState, Feature[]>(
  {
    [ActionTypes.SET_FEATURES]: (state, action) => ({
      ...state,
      features: action.payload,
    }),
  },
  FEATURES_DEFAULT_STATE
);
