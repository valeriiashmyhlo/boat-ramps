import { combineReducers } from "redux";
import { featuresReducer } from "./reducers/features.reducer";

export const rootReducer = combineReducers({
  features: featuresReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
