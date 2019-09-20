import React, { useState } from "react"
import "../../node_modules/react-vis/dist/style.css"
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries
} from "react-vis"

const Bar = () => {
  const greenData = [{ x: "A", y: 10 }, { x: "B", y: 5 }, { x: "C", y: 15 }]
  const blueData = [{ x: "A", y: 12 }, { x: "B", y: 2 }, { x: "C", y: 11 }]

  return (
    <XYPlot xType="ordinal" width={300} height={300} xDistance={100}>
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis />
      <YAxis />
      <VerticalBarSeries data={greenData} />
      <VerticalBarSeries data={blueData} />
      {/* <LabelSeries data={labelData} getLabel={d => d.x} /> */}
    </XYPlot>
  )
}

export default Bar
