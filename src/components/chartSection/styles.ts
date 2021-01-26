import { percent, px } from "csx";

import { stylesheet } from "typestyle";

export default stylesheet({
  chartContainer: {
    width: percent(50),
    padding: px(20),
  },

  mb20: {
    marginBottom: px(20),
  },

  RadialChartWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  radialChartStyles: {
    position: "relative",
    padding: "30px",
  },

  barChartStyles: {
    width: "100%",
    margin: "0 auto",
  },

  radialChartLabel: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: 140,
    right: "37%",
    height: 80,
    width: 90,
    flexDirection: "column",
    color: "#6b6b76",
  },

  chartAnnotation: {
    display: "flex",
    alignItems: "baseline",
  },

  annotation: {
    display: "block",
    width: "10px",
    height: "10px",
  },
});
