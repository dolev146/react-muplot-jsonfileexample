import React, { useEffect, useRef, useState } from "react";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";

const options = {
  title: "Axis Control",
  titleSize: 1,
  width: 1050,
  height: 100,
  scales: {
    x: {
      time: false,
      range: [0, 100],
    },
    y: {
      auto: false,
      range: [-120, 120],
    },
  },
  series: [
    {
      height: 1,
    },
    {
      stroke: "red",
      width: 1,
    },
  ],
  axes: [
    {
      labelSize: 1,
    },
    {
      space: 50,
    },
  ],
};

const App = () => {
  let nullStart = 0;
  let nullEnd = 2_200 * 4;
  let nullCount = 2_200;
  let stopIntervalFunctionPtr = null;

  const chartRef = useRef(null);
  const [DataMat, setDataMat] = useState(null); // [x, y]

  const UpdateChart = () => {
    let temp = [...chartRef.current.data];
    if (nullStart + nullCount > temp[1].length) {
      nullStart = 0;
      nullEnd = 2_200 * 4;
    }
    // use nullStart nullEnd nullCount to update the data
    for (let i = nullEnd; i < temp[1].length && i < nullEnd + nullCount; i++) {
      temp[1][i] = null;
    }
    for (let i = nullStart; i < nullStart + nullCount; i++) {
      temp[1][i] = DataMat[1][i];
    }
    // update the nullStart nullEnd nullCount
    nullStart = nullStart + nullCount;
    nullEnd = nullEnd + nullCount;
    chartRef.current.setData(temp);
  };

  useEffect(() => {
    // fetch the data from ./DataMat.json
    fetch("./DataMat.json")
      .then((response) => response.json())
      .then((jsonData) => {
        setDataMat(jsonData);
      });
  }, []);

  const startAnimation = () => {
    // set interval for every 1 second to update the data using UpdateChart function
    const interval = setInterval(() => {
      console.time("UpdateChart");
      UpdateChart();
      console.timeEnd("UpdateChart");
    }, 10);
    return () => clearInterval(interval);
  };

  return (
    <div className="App">
      {
        // if DataMat is not null then show UplotReact
        DataMat && (
          <UplotReact
            options={options}
            data={DataMat}
            onCreate={(chart) => {
              chartRef.current = chart;
              console.log(chartRef.current);
            }}
            onDelete={(chart) => {}}
            key={Math.random()}
          />
        )
      }

      <button
        onClick={() => {
          stopIntervalFunctionPtr = startAnimation();
        }}
      >
        start animation
      </button>
      <button
        onClick={() => {
          stopIntervalFunctionPtr();
        }}
      >
        stop animation
      </button>
    </div>
  );
};

export default App;
