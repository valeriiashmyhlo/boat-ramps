import App, { RangeParam, useFilters } from "../App";
import { NumberParam, QueryParamProvider, useQueryParam } from "use-query-params";
import { RootState, rootReducer } from "../rootReducer";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Feature } from "../types";
import { Provider } from "react-redux";
import React from "react";
import { Store } from "../store";
import { createStore } from "redux";
import { render as rtlRender } from "@testing-library/react";

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

function render(
  ui: JSX.Element,
  {
    initialState,
    store = createStore(rootReducer, initialState),
    ...renderOptions
  }: { initialState: RootState; store: Store }
) {
  const Wrapper: React.FC<{}> = ({ children }) => <Provider store={store}>{children}</Provider>;
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

test("renders App component", () => {
  const initialState = { features: { features: [f1, f2, f3] } };
  const { container } = render(
    <Router>
      <QueryParamProvider ReactRouterRoute={Route}>
        <App />
      </QueryParamProvider>
    </Router>,
    {
      initialState,
      store: createStore(rootReducer, initialState),
    }
  );
  expect(container.firstChild).toMatchSnapshot();
});

describe("RangeParam", () => {
  it("encode should correctly convert range to string", () => {
    expect(RangeParam.encode([0, 50])).toBe("0,50");
    expect(RangeParam.encode([5, 5])).toBe("5,5");
    expect(RangeParam.encode(null)).toBe(null);
  });
  it("decode should correctly convert string to range", () => {
    expect(RangeParam.decode("5,50")).toEqual([5, 50]);
    expect(RangeParam.decode("0,0")).toEqual([0, 0]);
    expect(RangeParam.decode(null)).toEqual(null);
    expect(RangeParam.decode(undefined)).toEqual(null);
    expect(RangeParam.decode(["1", "2"])).toEqual(null);
  });
});
