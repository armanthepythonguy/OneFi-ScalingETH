import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = (props) => {
  const data = {
    labels: [props.one, props.two, props.three, props.four],
    datasets: [
      {
        label: "Value in $",
        data: [
          props.valueOne,
          props.valueTwo,
          props.valueThree,
          props.valueFour,
        ],
        borderColor: ["#6FE8C8", "#FEFF9A", "#D2FAFB", "#B793E6"],
        backgroundColor: ["#6FE8C8", "#FEFF9A", "#D2FAFB", "#B793E6"],
      },
    ],
  };

  const options = {};

  return (
    <div>
      <div className="justify-center scale-95 hover:scale-100 transition ease-in-out delay-10">
        <Pie data={data} options={options} height="400" width="400"></Pie>
      </div>
    </div>
  );
};

export default PieChart;
