import React, { useCallback, useEffect, useState } from "react";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import DataMatTemp from "./DataMat.json";
const DataMat = [...DataMatTemp];

const options = {
  width: 1600,
  height: 300,
  scales: {
    x: {
      time: false
    },
    y: {}
  },
  axes: [{}],
  series: [
    {},
    {
      stroke: "blue"
    }
  ]
};

const Chart = ({ data }) => (
  <UplotReact
    options={options}
    data={data}
    onCreate={(chart) => {}}
    onDelete={(chart) => {}}
  />
);

const App = () => {
  const [data, setData] = useState([[], []]);
  let nullPositionStart = 0;
  let nullPositionEnd = 0;
  const numOfUpdates = 2_200;

  const generateFirstNulls = useCallback(() => {
    // return value of this function shuld be a mix of nulls and values
    // the first 2200 yValues should be nulls
    // the rest should be values from DataMat
    const nullNumber = 2_200 * 4;
    const xValues = [];
    const yValues = [];

    // Add null values at the beginning of yValues
    for (let i = 0; i < nullNumber; i++) {
      yValues.push(null);
    }
    for (let i = 0; i < nullNumber; i++) {
      xValues.push(DataMat[0][i]);
    }
    // Add values from DataMat to yValues
    for (let i = 0; i < DataMat[0].length - nullNumber; i++) {
      xValues.push(DataMat[0][nullNumber + i]);
      yValues.push(DataMat[1][nullNumber + i]);
    }
    console.log("xValues", xValues);
    console.log("yValues", yValues);
    const newValues = [[...xValues], [...yValues]];
    nullPositionEnd = nullNumber;
    setData(newValues);
  }, []);

  useEffect(() => {
    generateFirstNulls();
  }, []);

  const updateChart = () => {
    const xValues = [...data[0]];
    const yValues = [...data[1]];

    // Check if nullPositionStart needs to be reset
    if (nullPositionStart + numOfUpdates >= yValues.length) {
      nullPositionStart = 0;
    }

    // Reset Y-values to original values from DataMat
    for (let i = nullPositionStart; i < nullPositionStart + numOfUpdates; i++) {
      yValues[i] = DataMat[1][i];
    }

    // Set Y-values to null based on nullPositionEnd
    for (let i = nullPositionEnd; i < nullPositionEnd + numOfUpdates; i++) {
      yValues[i] = null;
    }
    const newValues = [[...xValues], [...yValues]];
    console.log("newValues");
    nullPositionStart += numOfUpdates;
    nullPositionEnd += numOfUpdates;
    return newValues;
  };

  return (
    <>
      <Chart data={data} />
      <button
        onClick={() =>
          setData((prevData) => {
            const xValues = [...prevData[0]];
            const yValues = [...prevData[1]];

            // Check if nullPositionStart needs to be reset
            if (nullPositionStart + numOfUpdates >= yValues.length) {
              nullPositionStart = 0;
            }

            // Reset Y-values to original values from DataMat
            for (
              let i = nullPositionStart;
              i < nullPositionStart + numOfUpdates;
              i++
            ) {
              yValues[i] = DataMat[1][i];
            }

            // Set Y-values to null based on nullPositionEnd
            for (
              let i = nullPositionEnd;
              i < nullPositionEnd + numOfUpdates;
              i++
            ) {
              yValues[i] = null;
            }
            const newValues = [[...xValues], [...yValues]];
            console.log("newValues");
            nullPositionStart += numOfUpdates;
            nullPositionEnd += numOfUpdates;
            return newValues;
          })
        }
      >
        button
      </button>
    </>
  );
};

export default App;
