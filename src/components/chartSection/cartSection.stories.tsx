import { ChartSection, ChartSectionProps } from ".";

import React from "react";
import { SizeCounts } from "../../types";
import { Story } from "@storybook/react/types-6-0";
import { style } from "typestyle";

export default {
  title: "ChartSection",
  component: ChartSection,
};

const wrapper = style({
  margin: 0,
  fontFamily:
    "BlinkMacSystemFont, 'Roboto', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  display: "flex",
  color: "grey",
  textAlign: "center",
});

const range1 = {
  range: [0, 50],
  color: "#1a3177",
  label: "[0, 50]",
  value: 1,
};
const range2 = {
  range: [50, 200],
  color: "#79c7e3",
  label: "[50, 200]",
  value: 2,
};
const range3 = {
  range: [200, 526],
  color: "#119399",
  label: "[200, 526]",
  value: 5,
};

const Wrapper: React.FC<{}> = ({ children }) => <div className={wrapper}>{children}</div>;

const Template: Story<ChartSectionProps> = (props) => {
  return (
    <Wrapper>
      <ChartSection {...props} />
    </Wrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  materialsCounts: { Other: 5, Concrete: 8, Gravel: 2, Bitumen: 12 },
  sizeCounts: [range1, range2, range3] as SizeCounts,
  selectedRange: null,
  setFilterMaterial: () => null,
  setFilterSize: () => null,
};

export const FilterBySize = Template.bind({});

FilterBySize.args = {
  ...Default.args,
  selectedRange: [50, 200],
  sizeCounts: [
    { ...range1, value: 0 },
    { ...range2, value: 8 },
    { ...range3, value: 0 },
  ] as SizeCounts,
};

export const FilterByMaterial = Template.bind({});

FilterByMaterial.args = {
  ...Default.args,
  materialsCounts: { Concrete: 8 },
};
